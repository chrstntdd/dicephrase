import { unlinkSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import { build as viteBuild } from "vite"
import { minify } from "html-minifier-terser"
import ESB from "esbuild"
import type { OutputAsset, OutputChunk, RollupOutput } from "rollup"

import { assert } from "../src/lib/assert"

main()

async function main() {
	let MOUNT_POINT = "<!--ssr-outlet-->"
	let HYDRATION_SCRIPT = "<!-- HYDRATION_SCRIPT -->"
	let INJECTED_HEAD_TAGS = "<!-- INJECTED_HEAD_TAGS -->"

	let [_, clientOutput] = await Promise.all([
		viteBuild({
			mode: "ssg",
			publicDir: false,
			build: {
				ssr: true,
				outDir: resolve("dist-ssg"),
				rollupOptions: {
					output: {
						// Force a single JS file.
						inlineDynamicImports: true,
					},
					external: ["solid-js", "solid-js/web"],
					input: resolve("src", "main-ssg.tsx"),
				},
			},
		}),
		viteBuild(),
	])

	removeReferencedIndexCss(clientOutput as RollupOutput)

	/* Ensure we can run as a module with plain js extensions */
	writeFileSync(
		resolve("dist-ssg", "package.json"),
		JSON.stringify({ type: "module" }),
	)

	await import("./make-sw.js")

	assert(!Array.isArray(clientOutput) && "output" in clientOutput)

	let template = (
		clientOutput.output.find((m) => m.fileName === "index.html") as OutputAsset
	).source as string

	let criticalBaseCSS = (
		clientOutput.output.find(
			(m) => m.fileName.endsWith(".css") && m.fileName.includes("index"),
		) as OutputAsset
	).source as string

	let ssgEntryPath = resolve("dist-ssg", "main-ssg.js")

	let render = (await import(ssgEntryPath)).render

	let sharedHeadTags = [
		`<meta property=og:image content=/img/dicephrase-og.jpg>`,
		`<meta property=og:title content="Dicephrase | Generate">`,
		`<meta property=og:description content="Simple, random, and secure in-browser password generator">`,
		`<meta property=og:type content=website>`,
		`<style>${criticalBaseCSS}</style>`,
	]

	let pages = [
		{
			path: "/",
			destination: "index.html",
			headTags: [
				`<title>Dicephrase | Generate</title>`,
				`<meta property=og:title content="Dicephrase | Generate">`,
				...sharedHeadTags,
			],
		},
		{
			path: "/about",
			destination: "about.html",
			headTags: [
				`<title>Dicephrase | About</title>`,
				`<meta property=og:title content="Dicephrase | About">`,
				...sharedHeadTags,
			],
		},
	]

	for (let { path, destination, headTags } of pages) {
		let { html: appAsHTML, hydrationScript } = await render(path)

		let doc = removeLinkedIndexCss(
			template
				.replace(MOUNT_POINT, appAsHTML)
				.replace(HYDRATION_SCRIPT, hydrationScript)
				.replace(INJECTED_HEAD_TAGS, headTags.join("")),
		)

		let minifiedHTML = await minify(doc, {
			collapseBooleanAttributes: true,
			collapseWhitespace: true,
			minifyCSS: true,
			minifyJS: true,
			removeAttributeQuotes: true,
			removeEmptyAttributes: true,
			removeTagWhitespace: true,
			useShortDoctype: true,
		})

		writeFileSync(resolve("dist", destination), minifiedHTML)
	}

	console.log("🥳 Done pre-rendering & optimizing 🚀")
	process.exit(0)
}

import { parse } from "@typescript-eslint/typescript-estree"
import escg from "escodegen"
import * as astray from "astray"

function removeReferencedIndexCss(co: RollupOutput) {
	// Find the string path to remove
	let criticalBaseCSSPath = (
		co.output.find(
			(m) => m.fileName.endsWith(".css") && m.fileName.includes("index"),
		) as OutputAsset
	).fileName

	let needle = `"${criticalBaseCSSPath}"`

	let { code, fileName } = co.output.find(
		(thing) => thing.type === "chunk" && thing.code.includes(needle),
	) as OutputChunk

	const AST = parse(code)

	astray.walk(AST, {
		Literal: {
			enter(node) {
				if (node.raw === needle) return astray.REMOVE
			},
		},
	})

	let generated = escg.generate(AST)

	let final = ESB.transformSync(generated, {
		minify: true,
		target: "esnext",
		format: "esm",
	})

	writeFileSync(resolve("dist", fileName), final.code)

	// Finally, cleanup the file
	unlinkSync(resolve("dist", criticalBaseCSSPath))
}

import { parseHTML } from "linkedom"

function removeLinkedIndexCss(html: string) {
	const {
		// note, these are *not* globals
		window,
		document,
		customElements,
		HTMLElement,
		Event,
		CustomEvent,
		// other exports ..
	} = parseHTML(html)

	let nodeList = document.querySelectorAll(
		'link[rel="stylesheet"][href$=".css"]',
	)

	for (const el of nodeList) {
		if ((el as HTMLLinkElement).href.includes("index.")) {
			el.remove()
		}
	}

	return document.toString()
}

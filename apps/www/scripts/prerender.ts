import { writeFileSync } from "fs"
import { resolve } from "path"
import { build as viteBuild } from "vite"
import type { OutputAsset } from "rollup"

import { assert } from "../src/lib/assert"

main()

async function main() {
	let MOUNT_POINT = "<!--ssr-outlet-->"
	let HYDRATION_SCRIPT = "<!-- HYDRATION_SCRIPT -->"
	let INJECTED_HEAD_TAGS = "<!-- INJECTED_HEAD_TAGS -->"

	let [_, clientOutput] = await Promise.all([
		viteBuild({
			mode: "ssg",
			resolve: {
				conditions: ["solid", "node"],
			},
			publicDir: false,
			build: {
				ssr: true,
				outDir: resolve("dist-ssg"),
				rollupOptions: {
					output: {
						format: "esm",
					},
					external: ["solid-js", "solid-js/web"],
					input: resolve("src", "main-ssg.tsx"),
				},
			},
		}),
		viteBuild({ resolve: { conditions: ["solid"] } }),
	])

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

	let ssgEntryPath = resolve("dist-ssg", "main-ssg.js")

	let render = (await import(ssgEntryPath)).render

	let sharedHeadTags = [
		`<meta property=og:image content=/img/dicephrase-og.jpg>`,
		`<meta property=og:title content="Dicephrase | Generate">`,
		`<meta property=og:description content="Simple, random, and secure in-browser password generator">`,
		`<meta property=og:type content=website>`,
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

		let doc = template
			.replace(MOUNT_POINT, appAsHTML)
			.replace(HYDRATION_SCRIPT, hydrationScript)
			.replace(INJECTED_HEAD_TAGS, headTags.join(""))

		writeFileSync(resolve("dist", destination), doc)
	}

	console.log("🥳 Pre-rendered the pages")
	process.exit(0)
}

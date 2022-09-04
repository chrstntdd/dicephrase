import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import ESB from "esbuild"

import type { Manifest } from "vite"

let commitHash = execSync("git rev-parse --short HEAD").toString().trim()

const filesToPrecache = buildPrecacheList()

ESB.buildSync({
	bundle: true,
	define: {
		__SW_CACHE_KEY__: `"${commitHash}-${Date.now()}"`,
		__PRECACHE_BUILD_ASSETS__: `'[${filesToPrecache.join(",")}]'`,
	},
	entryPoints: ["src/sw/sw.ts"],
	minify: true,
	outfile: "dist/sw.js",
	platform: "browser",
})

console.info("Built the service worker!")

function makeFilePath(s) {
	return `"${s}"`
}

function isBaseIndexCss(p: string) {
	return p.includes("/index.") && p.endsWith(".css")
}

function buildPrecacheList() {
	let filesToPrecache = new Set(['"/about"', '"/", "/wl-2016.json"'])

	let manifest: Manifest = JSON.parse(
		readFileSync(resolve("dist", "manifest.json"), "utf-8"),
	)

	for (const entry in manifest) {
		let manifestChunk = manifest[entry]
		// Avoid pre-caching our index.css file since it's inlined into the document head
		if (isBaseIndexCss(manifestChunk.file)) continue

		filesToPrecache.add(makeFilePath(manifestChunk.file))
		if (manifestChunk.css) {
			for (let index = 0; index < manifestChunk.css.length; index++) {
				const cssAsset = manifestChunk.css[index]

				// Avoid pre-caching our index.css file since it's inlined into the document head
				if (isBaseIndexCss(cssAsset)) continue

				filesToPrecache.add(makeFilePath(cssAsset))
			}
		}
	}

	return [...filesToPrecache]
}

import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import ESB from "esbuild"

import type { Manifest } from "vite"

let commitHash = spawnSync("git rev-parse --short HEAD", {
	encoding: "utf-8",
	shell: true,
}).stdout.trim()

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

function makeFilePath(s: string) {
	return `"${s}"`
}

function buildPrecacheList() {
	let filesToPrecache = new Set(['"/about"', '"/", "/wl-2016.json"'])

	let manifest: Manifest = JSON.parse(
		readFileSync(resolve("dist", "manifest.json"), "utf-8"),
	)

	for (const entry in manifest) {
		let manifestChunk = manifest[entry]!
		filesToPrecache.add(makeFilePath(manifestChunk.file))
		if (manifestChunk.css) {
			for (let index = 0; index < manifestChunk.css.length; index++) {
				const cssAsset = manifestChunk.css[index]!

				filesToPrecache.add(makeFilePath(cssAsset))
			}
		}
	}

	return [...filesToPrecache].filter(
		(p) => !(p.includes(".css") && p.includes("index")),
	)
}

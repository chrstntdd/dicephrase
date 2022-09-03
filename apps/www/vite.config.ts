import { readFileSync } from "fs"
import { sep } from "path"

import { defineConfig, UserConfig } from "vite"
import solid from "vite-plugin-solid"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import type { Plugin } from "vite"

let IS_NET = process.env.IS_NET === "true"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	let isSSG = mode === "ssg"
	let sharedBuild: UserConfig["build"] = {
		manifest: !isSSG,
		rollupOptions: isSSG
			? undefined
			: {
					output: {
						manualChunks(id) {
							if (!id.endsWith(".css") && id.includes("node_modules")) {
								let directories = id.split(sep)
								let name =
									directories[directories.lastIndexOf("node_modules") + 1]

								if (name.includes("solid-js")) {
									return "vend-fw"
								}

								if (name === "xstate") {
									return "vend-xstate"
								}

								// Defer to default behavior
							}
						},
					},
			  },
	}
	return {
		plugins: [
			vanillaExtractPlugin(),
			solid(
				isSSG
					? { ssr: true, solid: { hydratable: true, generate: "ssr" } }
					: undefined,
			),
			parcelCSSPlugin(),
		],
		build: sharedBuild,
		// Prevent build failures during cloudflare deployment
		server: IS_NET
			? undefined
			: {
					port: 3000,
					https: {
						key: readFileSync("localhost-key.pem"),
						cert: readFileSync("localhost.pem"),
					},
			  },
	}
})

import css from "@parcel/css"
import browserslist from "browserslist"
import pkg from "./package.json"

function parcelCSSPlugin(): Plugin {
	return {
		name: "vite-plugin-parcel-css",
		enforce: "post",
		generateBundle: function (opts, bundle) {
			for (let filename in bundle) {
				let element = bundle[filename]
				if (element.type === "asset" && element.name?.includes(".css")) {
					/* Prevent vite from further processing the CSS file — we'll handle this ourselves with parcel's css plugin */
					delete bundle[filename]

					let { code } = css.transform({
						code: Buffer.from(element.source),
						filename,
						minify: true,
						targets: css.browserslistToTargets(browserslist(pkg.browserslist)),
					})

					this.emitFile({
						name: element.name,
						fileName: filename,
						type: "asset",
						source: code.toString("utf-8"),
					})
				}
			}
		},
	}
}

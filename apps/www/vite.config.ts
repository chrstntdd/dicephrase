import { readFileSync } from "node:fs"

import { defineConfig, UserConfig } from "vite"
import solid from "vite-plugin-solid"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import lightningcss from "vite-plugin-lightningcss"
import { buildPlugin } from "@ct/vite-plugin-build-info"

import pkg from "./package.json"

let IS_NET = process.env.IS_NET === "true"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	let isSSG = mode === "ssg"
	let sharedBuild: UserConfig["build"] = {
		manifest: !isSSG,
	}
	return {
		plugins: [
			vanillaExtractPlugin(),
			solid(
				isSSG
					? { ssr: true, solid: { hydratable: true, generate: "ssr" } }
					: { ssr: false, solid: { hydratable: true, generate: "dom" } },
			),
			lightningcss({
				browserslist: pkg.browserslist,
				minify: true,
			}),
			buildPlugin({ version: pkg.version }),
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

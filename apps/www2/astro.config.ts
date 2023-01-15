import { defineConfig } from "astro/config"
import solidJs from "@astrojs/solid-js"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import lightningcss from "vite-plugin-lightningcss"
import { buildPlugin } from "@ct/vite-plugin-build-info"

import pkg from "./package.json"

// https://astro.build/config
export default defineConfig({
	integrations: [solidJs()],
	vite: {
		plugins: [
			vanillaExtractPlugin(),
			lightningcss({
				browserslist: pkg.browserslist,
			}),
			buildPlugin({ version: pkg.version }),
		],
	},
})

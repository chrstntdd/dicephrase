import { defineConfig } from "astro/config"
import solidJs from "@astrojs/solid-js"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { parcelCSSPlugin } from "@ct/vite-plugin-parcel-css"
import { buildPlugin } from "@ct/vite-plugin-build-info"

import pkg from "./package.json"

// https://astro.build/config
export default defineConfig({
	integrations: [solidJs()],
	vite: {
		plugins: [
			vanillaExtractPlugin(),
			parcelCSSPlugin({
				browserslist: pkg.browserslist,
				minify: true,
			}),
			buildPlugin({ version: pkg.version }),
		],
	},
})

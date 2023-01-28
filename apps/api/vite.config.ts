import { resolve } from "node:path"

import { defineConfig } from "vite"

import pkg from "./package.json"
import wl from "./wl-2016.json"

// https://vitejs.dev/config/
export default defineConfig(({ ssrBuild, mode }) => {
	let isProd = mode === "production"

	let define = {
		ENVIRONMENT: JSON.stringify(mode),
		__WL_2016__: `${JSON.stringify(wl)}`,
	}

	return {
		// Only copy web assets for the production non-ssr build
		publicDir: ssrBuild && isProd ? false : undefined,
		define,
		ssr: ssrBuild
			? {
					// Workers need to contain all the deps in the bundled output
					noExternal: [...Object.keys(pkg.dependencies)],
			  }
			: undefined,
		build: {
			emptyOutDir: false, // Prevent builds from affecting each other
			manifest: !ssrBuild,
			ssr: ssrBuild,
		},
		resolve: {
			alias: {
				"~": resolve("src"),
			},
		},
	}
})

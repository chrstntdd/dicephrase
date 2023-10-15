import * as p from "node:path"
import * as url from "node:url"
import { defineConfig } from "vite"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

let rootMelangeBuild = p.resolve(__dirname, "..", "..", "_build/default/app")
let rootMelangeNodeModules = p.resolve(rootMelangeBuild, "node_modules")

let mainEntry = p.join(
	rootMelangeBuild,
	"apps/ocaml/lib/javascript/javascript.mjs",
)

export default defineConfig({
	build: {
		minify: false,
		lib: {
			formats: ["es"],
			fileName: "mod",
			entry: [mainEntry],
		},
	},
	resolve: {
		alias: [
			...["melange.js", "melange.belt", "melange.runtime", "melange"].map(
				(moduleId) => {
					// Special handling so the ESM (in plain.js without type:module) can be resolved correctly
					return {
						find: moduleId,
						replacement: join(rootMelangeNodeModules, moduleId),
					}
				},
			),
		],
	},
	test: {
		include: ["test/**/*.test.ts"],
		coverage: {
			reporter: ["lcov", "html"],
			include: ["_build/default/app/lib/**"],
			exclude: ["node_modules"],
		},
		useAtomics: true,
	},
})

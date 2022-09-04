import { build } from "esbuild"

import pkg from "./package.json" assert { type: "json" }

await build({
	bundle: true,
	entryPoints: ["src/plugin.ts"],
	external: [
		...Object.keys(pkg.devDependencies),
		...Object.keys(pkg.dependencies),
	],
	format: "esm",
	outfile: pkg.exports["."].import,
	platform: "node",
	target: "node18",
})

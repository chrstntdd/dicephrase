import { build } from "esbuild"

import pkg from "./package.json" assert { type: "json" }

let shared = {
	bundle: true,
	entryPoints: ["src/plugin.ts"],
	external: [
		...Object.keys(pkg.devDependencies),
		...Object.keys(pkg.dependencies),
	],
	format: "esm",
	platform: "node",
	target: "node18",
}

await build({
	...shared,
	format: "esm",
	outfile: pkg.exports["."].import,
})
await build({
	...shared,
	format: "cjs",
	outfile: pkg.exports["."].require,
})

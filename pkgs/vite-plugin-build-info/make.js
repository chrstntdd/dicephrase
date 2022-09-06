import { build } from "esbuild"

import pkg from "./package.json" assert { type: "json" }

await build({
	bundle: true,
	entryPoints: ["src/plugin.ts"],
	external: [...Object.keys(pkg.devDependencies)],
	format: "esm",
	outfile: pkg.exports["."].import,
	platform: "node",
	target: "node18",
})

console.log(`Built ${pkg.name}@${pkg.version} ⚡️`)

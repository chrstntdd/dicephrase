import ES from "esbuild"
import { readFileSync } from "fs"

/** @type ES.BuildOptions */
const SHARED_ESBUILD_OPTIONS = {
  bundle: true,
  entryPoints: ["./src/worker.ts"],
  minify: true,
  target: "esnext"
}

make()

async function make() {
  await ES.build({
    ...SHARED_ESBUILD_OPTIONS,
    format: "esm",
    outfile: "./dist/worker.js"
  })
}

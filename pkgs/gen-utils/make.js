import ES from "esbuild"
import { readFileSync } from "fs"

const localPkgJson = JSON.parse(readFileSync("./package.json", "utf-8"))

/** @type ES.BuildOptions */
const SHARED_ESBUILD_OPTIONS = {
  bundle: true,
  entryPoints: ["./src/Gen.gen.tsx"],
  minify: true,
  target: "esnext"
}

make()

async function make() {
  await Promise.all([
    ES.build({
      ...SHARED_ESBUILD_OPTIONS,
      format: "esm",
      outfile: localPkgJson.module
    }),
    ES.build({
      ...SHARED_ESBUILD_OPTIONS,
      format: "cjs",
      outfile: localPkgJson.main
    })
  ])
}

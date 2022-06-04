import * as esbuild from "https://deno.land/x/esbuild@v0.14.42/mod.js"

await esbuild.build({
  bundle: true,
  entryPoints: ["../../pkgs/gen-utils/src/index.ts"],
  format: "esm",
  minify: true,
  outfile: "./src/deps/gen-utils.js",
  target: "esnext"
})

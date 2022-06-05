import * as esbuild from "https://deno.land/x/esbuild@v0.14.42/mod.js"

await esbuild.build({
  bundle: true,
  entryPoints: ["../../pkgs/gen-utils/src/index.ts"],
  format: "esm",
  minify: true,
  outfile: "./src/deps/gen-utils.js",
  target: "esnext",
  platform: "neutral",
  external: ["rescript"]
})

// ESBuild hangs for some reasons, so we need to exit manually
Deno.exit(0)

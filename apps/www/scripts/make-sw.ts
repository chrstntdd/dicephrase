import { resolve } from "path"
import { execSync } from "child_process"

import ESB from "esbuild"

import { readFileSync } from "fs"
import type { Manifest } from "vite"

let commitHash = execSync("git rev-parse --short HEAD").toString().trim()

const filesToPrecache = buildPrecacheList()

ESB.buildSync({
  bundle: true,
  define: {
    __SW_CACHE_KEY__: `"${commitHash}-${Date.now()}"`,
    __PRECACHE_BUILD_ASSETS__: `'[${filesToPrecache.join(",")}]'`
  },
  entryPoints: ["src/sw/sw.ts"],
  minify: true,
  outfile: "dist/sw.js",
  platform: "browser"
})

console.info("Built the service worker!")

function makeFilePath(s) {
  return `"${s}"`
}

function buildPrecacheList() {
  let filesToPrecache = new Set(['"/about"', '"/", "/wl-2016.json"'])

  let manifest: Manifest = JSON.parse(
    readFileSync(resolve("dist", "manifest.json"), "utf-8")
  )

  for (const entry in manifest) {
    let manifestChunk = manifest[entry]
    filesToPrecache.add(makeFilePath(manifestChunk.file))
    if (manifestChunk.css) {
      manifestChunk.css.forEach((c) => filesToPrecache.add(makeFilePath(c)))
    }
  }

  return [...filesToPrecache]
}

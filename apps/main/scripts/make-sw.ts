import { resolve } from "path"
import { execSync } from "child_process"

import ESB from "esbuild"

import { readFileSync } from "fs"
import type { Manifest } from "vite"

let commitHash = execSync("git rev-parse --short HEAD").toString().trim()

const filesToPrecache = buildPrecacheList()

const SHARED_CFG: ESB.BuildOptions = {
  bundle: true,
  entryPoints: ["src/sw/sw.ts"],
  platform: "browser",
  minify: true,
  define: {
    __SW_CACHE_KEY__: `"${commitHash}-${Date.now()}"`,
    __PRECACHE_BUILD_ASSETS__: `'[${filesToPrecache.join(",")}]'`
  }
}

ESB.buildSync({
  ...SHARED_CFG,
  outfile: "public/sw.js"
})

ESB.buildSync({
  ...SHARED_CFG,
  outfile: "dist/sw.js"
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

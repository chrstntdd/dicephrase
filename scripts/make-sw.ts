import { resolve, relative } from "path"
import { execSync } from "child_process"

import ESB from "esbuild"

import { walkSync } from "./walk"

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

function buildPrecacheList() {
  let filesToPrecache = new Set(['"about.html"'])

  for (const { name } of walkSync(resolve("dist"), {
    filter: (n) =>
      (n.includes("/fonts/") ||
        n.includes("/favicons/") ||
        n.endsWith(".html") ||
        n.endsWith(".js") ||
        n.endsWith(".css") ||
        n.endsWith(".json")) &&
      !n.includes("sw.js") &&
      !n.includes(".DS_Store"),
    includeDirs: false,
    includeFiles: true
  })) {
    let rel = relative(resolve("dist"), name)
    filesToPrecache.add(`"${rel}"`)
  }

  return [...filesToPrecache]
}

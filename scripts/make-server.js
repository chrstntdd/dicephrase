import { readFileSync } from "fs"
import { resolve } from "path"

import ESB from "esbuild"

const projectPkg = JSON.parse(readFileSync(resolve("package.json"), "utf-8"))

make()

function make() {
  ESB.buildSync({
    bundle: true,
    entryPoints: ["./src/server/server.ts"],
    format: "esm",
    outfile: "lib/server.mjs",
    platform: "node",
    treeShaking: true,
    external: Object.keys({
      ...(projectPkg.dependencies || {}),
      ...(projectPkg.devDependencies || {}),
      ...(projectPkg.peerDependencies || {})
    }),
    define: {
      "process.env.NODE_ENV": "'production'"
    }
  })

  console.info("Made the server")
}

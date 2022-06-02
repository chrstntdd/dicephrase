import { writeFileSync } from "fs"
import { resolve } from "path"
import { build as viteBuild } from "vite"
import type { OutputAsset } from "rollup"

import { assert } from "../src/lib/assert"

main()

async function main() {
  let MOUNT_POINT = "<!--ssr-outlet-->"
  let HYDRATION_SCRIPT = "<!-- HYDRATION_SCRIPT -->"
  let SOLID_META = "<!-- SOLID_META -->"

  await viteBuild({
    mode: "ssg",
    resolve: {
      conditions: ["solid", "node"]
    },
    publicDir: false,
    build: {
      ssr: true,
      outDir: resolve("dist-ssg"),
      rollupOptions: {
        output: {
          format: "esm"
        },
        external: ["solid-js", "solid-js/web"],
        input: resolve("src", "main-ssg.tsx")
      }
    }
  })
  /* Ensure we can run as a module with plain js extensions */
  writeFileSync(
    resolve("dist-ssg", "package.json"),
    JSON.stringify({ type: "module" })
  )

  let clientOutput = await viteBuild({ resolve: { conditions: ["solid"] } })

  await import("./make-sw.js")

  assert(!Array.isArray(clientOutput) && "output" in clientOutput)

  let template = (
    clientOutput.output.find((m) => m.fileName === "index.html") as OutputAsset
  ).source as string

  let ssgEntryPath = resolve("dist-ssg", "main-ssg.js")

  let render = (await import(ssgEntryPath)).render

  let pages = [
    { path: "/", destination: "index.html" },
    { path: "/about", destination: "about.html" }
  ]

  for (let { path, destination } of pages) {
    let {
      html: appAsHTML,
      hydrationScript,
      renderedHeadTags
    } = await render(path)

    let doc = template
      .replace(MOUNT_POINT, appAsHTML)
      .replace(HYDRATION_SCRIPT, hydrationScript)
      .replace(SOLID_META, renderedHeadTags)

    writeFileSync(resolve("dist", destination), doc)
  }

  console.log("🥳 Pre-rendered the pages")
  process.exit(0)
}

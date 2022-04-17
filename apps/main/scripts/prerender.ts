import { writeFileSync } from "fs"
import { resolve } from "path"
import { build as viteBuild } from "vite"
import type { RollupOutput, OutputAsset } from "rollup"

main()

async function main() {
  let MOUNT_POINT = "<!--ssr-outlet-->"
  let DOCUMENT_TITLE = "<!--doc-title-->"
  let HYDRATION_SCRIPT = "<!-- HYDRATION_SCRIPT -->"
  let SOLID_META = "<!-- SOLID_META -->"
  try {
    await viteBuild({
      mode: "ssg",
      resolve: {
        conditions: ["solid", "node"]
      },
      publicDir: undefined,
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

    let clientOutput = await viteBuild({
      resolve: {
        conditions: ["solid"]
      }
    })

    await import("./make-sw.js")

    let template = (
      (clientOutput as RollupOutput).output.find(
        (m) => m.fileName === "index.html"
      ) as OutputAsset
    ).source as string

    let ssgEntryPath = resolve("dist-ssg", "main-ssg.js")

    let render = (await import(ssgEntryPath)).render

    let pages = [{ path: "/" }, { path: "/about" }]

    for (let { path } of pages) {
      let {
        html: appAsHTML,
        hydrationScript,
        renderedHeadTags
      } = await render(path)

      let doc = template
        .replace(MOUNT_POINT, appAsHTML)
        .replace(HYDRATION_SCRIPT, hydrationScript)
        .replace(SOLID_META, renderedHeadTags)

      let destinationPath =
        path === "/"
          ? "index.html"
          : path === "/about"
          ? "about.html"
          : "FALLBACK.html"

      writeFileSync(resolve("dist", destinationPath), doc)
    }

    console.log("🥳 Pre-rendered the pages")
    process.exit(0)
  } catch (error) {
    console.error(error)
  }
}

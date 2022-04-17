import { writeFileSync } from "fs"
import { resolve } from "path"
import { build as viteBuild } from "vite"
import type { RollupOutput, OutputAsset } from "rollup"

main()

async function main() {
  let MOUNT_POINT = "<!--ssr-outlet-->"
  let DOCUMENT_TITLE = "<!--doc-title-->"
  let HYDRATION_SCRIPT = "<!-- HYDRATION_SCRIPT -->"
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

    let pages = [
      { path: "/", title: "dicephrase | generate" },
      { path: "/about", title: "dicephrase | about" }
    ]

    for (let { path, title } of pages) {
      let { html: appAsHTML, hydrationScript } = await render(path)

      let doc = template
        .replace(MOUNT_POINT, appAsHTML)
        .replace(DOCUMENT_TITLE, title)
        .replace(HYDRATION_SCRIPT, hydrationScript)

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

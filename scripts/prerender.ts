import { writeFileSync } from "fs"
import { resolve } from "path"
import { build as viteBuild } from "vite"

main()

async function main() {
  try {
    await viteBuild({
      mode: "ssg",
      resolve: {
        conditions: ["solid", "node"]
      },
      build: {
        ssr: true,
        outDir: resolve("dist-ssg"),
        rollupOptions: {
          external: ["solid-js", "solid-js/web"],
          input: resolve("src", "main-ssg.tsx")
        }
      }
    })

    let clientOutput = await viteBuild({
      resolve: {
        conditions: ["solid"]
      }
    })

    await import("./make-sw.js")

    let template = clientOutput.output.find(
      (m) => m.fileName === "index.html"
    ).source

    let ssgEntryPath = resolve("dist-ssg", "main-ssg.js")

    let render = (await import(ssgEntryPath)).render

    let pages = [
      { path: "/", title: "dicephrase" },
      { path: "/generate", title: "dicephrase | generate" },
      { path: "/about", title: "dicephrase | about" }
    ]

    let MOUNT_POINT = "<!--ssr-outlet-->"
    let DOCUMENT_TITLE = "<!--doc-title-->"
    let HYDRATION_SCRIPT = "<!-- HYDRATION_SCRIPT -->"

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
          : path === "/generate"
          ? "generate.html"
          : "FALLBACK.html"

      writeFileSync(resolve("dist", destinationPath), doc)
    }

    console.log("🥳 Pre-rendered the pages")
    process.exit(0)
  } catch (error) {
    console.error(error)
  }
}

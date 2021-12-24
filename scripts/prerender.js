// @ts-check
import { writeFileSync } from "fs"
import { resolve } from "path"
import { build as viteBuild } from "vite"

main()

async function main() {
  try {
    const ssgOutput = await viteBuild({
      build: {
        ssr: true,
        outDir: resolve("dist-ssg"),
        rollupOptions: {
          input: resolve("src", "main-ssg.tsx")
        }
      }
    })

    const clientOutput = await viteBuild({
      build: {
        // For now...
        cssCodeSplit: false
      }
    })

    await import("./make-sw.js")

    let template = clientOutput.output.find(
      (m) => m.fileName === "index.html"
    ).source

    let render = (await import(resolve("dist-ssg", "main-ssg.js"))).render

    let pages = [
      { path: "/", title: "dicephrase" },
      { path: "/generate", title: "dicephrase | generate" },
      { path: "/about", title: "dicephrase | about" }
    ]

    let MOUNT_POINT = "<!--ssr-outlet-->"
    let DOCUMENT_TITLE = "<!--doc-title-->"

    for (const { path, title } of pages) {
      let { html: appAsHTML } = await render(path)

      let doc = template
        .replace(MOUNT_POINT, appAsHTML)
        .replace(DOCUMENT_TITLE, title)

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
  } catch (error) {
    console.error(error)
  }
}

import { writeFileSync } from "fs"
import { resolve } from "path"
import { build as viteBuild } from "vite"

main()

async function main() {
  let CSP_META_TAG = `<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline'" />`
  let MOUNT_POINT = "<!--ssr-outlet-->"
  let DOCUMENT_TITLE = "<!--doc-title-->"
  let HYDRATION_SCRIPT = "<!-- HYDRATION_SCRIPT -->"
  let CSP_TAG = "<!-- CSP_TAG -->"
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

    let template = clientOutput.output.find(
      (m) => m.fileName === "index.html"
    ).source

    let ssgEntryPath = resolve("dist-ssg", "main-ssg.js")

    let render = (await import(ssgEntryPath)).render

    let pages = [
      { path: "/", title: "dicephrase" },
      { path: "/generate", title: "dicephrase | generate" },
      { path: "/generated", title: "dicephrase | generated" },
      { path: "/about", title: "dicephrase | about" }
    ]

    for (let { path, title } of pages) {
      let { html: appAsHTML, hydrationScript } = await render(path)

      let doc = template
        .replace(MOUNT_POINT, appAsHTML)
        .replace(DOCUMENT_TITLE, title)
        .replace(HYDRATION_SCRIPT, hydrationScript)
        .replace(CSP_TAG, CSP_META_TAG)

      let destinationPath =
        path === "/"
          ? "index.html"
          : path === "/about"
          ? "about.html"
          : path === "/generate"
          ? "generate.html"
          : path === "/generated"
          ? "generated.html"
          : "FALLBACK.html"

      writeFileSync(resolve("dist", destinationPath), doc)
    }

    console.log("🥳 Pre-rendered the pages")
    process.exit(0)
  } catch (error) {
    console.error(error)
  }
}

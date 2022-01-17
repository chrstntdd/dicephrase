import { writeFile } from "fs/promises"
import { resolve } from "path"

import { minify } from "html-minifier-terser"

import { walkSync } from "./walk"
import { readFileSync } from "fs"

let srcHtml = Array.from(
  walkSync("./dist", {
    includeDirs: false,
    includeFiles: true,
    filter: (n) => n.endsWith(".html")
  })
)

await Promise.all(
  srcHtml.map(async ({ name, data }) => {
    let html = readFileSync(name, "utf-8")

    let minifiedHTML = await minify(html, {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      removeTagWhitespace: true,
      useShortDoctype: true
    })

    return writeFile(resolve(name), minifiedHTML, "utf-8")
  })
)

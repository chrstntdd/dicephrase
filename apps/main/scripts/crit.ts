import { writeFile } from "fs/promises"
import { resolve } from "path"
import { readdirSync } from "fs"

import crit from "critical"
import { minify } from "html-minifier-terser"

function resolveToDist(n: string) {
  return resolve("dist", n)
}

let srcHtml = readdirSync("dist").flatMap((f) =>
  f.endsWith(".html") ? [resolveToDist(f)] : []
)

let css = readdirSync("dist").flatMap((f) =>
  f.endsWith(".css") ? [resolveToDist(f)] : []
)

await Promise.all(
  srcHtml.map(async (name) => {
    let htmlWithInlinedCSS: string = (
      await crit.generate({
        base: "/dist",
        css: css,
        inline: true,
        src: name
      })
    ).html

    let minifiedHTML = await minify(htmlWithInlinedCSS, {
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

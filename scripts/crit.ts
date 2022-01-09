import { writeFile } from "fs/promises"
import { resolve } from "path"

import crit from "critical"

import { walkSync } from "./walk"

let srcHtml = Array.from(
  walkSync("./dist", {
    includeDirs: false,
    includeFiles: true,
    filter: (n) => n.endsWith(".html")
  })
)
let css = Array.from(
  walkSync("./dist", {
    includeDirs: false,
    includeFiles: true,
    filter: (n) => n.endsWith(".css")
  })
)

await Promise.all(
  srcHtml.map(async ({ name, data }) => {
    let htmlWithInlinedCSS: string = (
      await crit.generate({
        base: "/dist",
        css: css.map(({ name }) => name),
        inline: true,
        src: name
      })
    ).html

    return writeFile(resolve(name), htmlWithInlinedCSS, "utf-8")
  })
)

import { resolve } from "node:path"
import { readdir, readFile, writeFile } from "node:fs/promises"

import { minify } from "html-minifier-terser"

let srcHtml = (await readdir("dist")).flatMap((f) =>
	f.endsWith(".html") ? [resolve("dist", f)] : [],
)

await Promise.all(
	srcHtml.map(async (name) => {
		let rawHTML = await readFile(name, "utf-8")
		let minifiedHTML = await minify(rawHTML, {
			collapseBooleanAttributes: true,
			collapseWhitespace: true,
			minifyCSS: true,
			minifyJS: true,
			removeAttributeQuotes: true,
			removeEmptyAttributes: true,
			removeTagWhitespace: true,
			useShortDoctype: true,
		})

		return writeFile(resolve(name), minifiedHTML, "utf-8")
	}),
)

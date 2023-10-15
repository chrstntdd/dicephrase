import { createServer } from "node:http"

import {
	combine_zip,
	make_phrases,
	make_separators,
	VAL_RANDOM,
} from "gen-utils"

import wl from "../www/public/wl-2016.json" assert { type: "json" }

let port = "8081"

function clamp({ min, max }) {
	return (value) => {
		return Math.min(Math.max(value, min), max)
	}
}

let clampEntropy = clamp({ min: 4, max: 20 })

let makeGetFromParams =
	(t) =>
	({ key, parser, fallback }) => {
		let raw = t.get(key)
		if (raw) {
			let { val, err } = parser(raw) ?? {}
			if (val) {
				return val
			}
			if (err) {
				return fallback
			}
		}
		return fallback
	}

createServer((req, res) => {
	let url = new URL(req.url, `http://${req.headers.host}`)
	let get = makeGetFromParams(url.searchParams)

	switch (url.pathname) {
		case "/gen": {
			let count = get({
				key: "c",
				fallback: 4,
				parser: (rawCount) => {
					let c = +rawCount
					if (Number.isNaN(c)) {
						return { err: "Count must be valid whole number" }
					}
					if (!Number.isInteger(c)) {
						return { err: "Count must be a whole number" }
					}
					return { val: clampEntropy(c) }
				},
			})

			let sep = get({
				key: "s",
				fallback: "🟨",
				parser: (rawSep) => {
					if (rawSep === VAL_RANDOM) {
						return { val: VAL_RANDOM }
					}
					let isStr = typeof rawSep === "string"
					if (isStr) {
						if (rawSep.length === 1) {
							return { val: rawSep }
						}
						// Trim to two chars to allow for emoji separators
						return { val: rawSep.slice(0, 2) }
					}
					return { err: "Invalid separator" }
				},
			})
			let fmt = get({
				key: "fmt",
				fallback: "text",
				parser: (rawPart) => {
					if (rawPart === "parts") {
						return { val: "parts" }
					}
					return { val: "text" }
				},
			})

			let separators = make_separators(sep, count)
			let phrases = make_phrases(count, wl)

			if (fmt === "parts") {
				return res
					.setHeader("content-type", "application/json")
					.writeHead(200)
					.end(`${JSON.stringify({ phrases, separators })}`)
			}

			return res
				.setHeader("content-type", "text/html")
				.writeHead(200)
				.end(`${combine_zip(phrases, separators).join("")}`)
		}

		default:
			res.writeHead(404, "Not found").end()
			break
	}
})
	.listen(Number.parseInt(port, 10), "0.0.0.0")
	.once("listening", () => {
		console.log(`🟨 Node.js@${process.version}\n📡 http://0.0.0.0:${port}/`)
	})

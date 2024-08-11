import { Elysia, t } from "elysia"
import { html } from "@elysiajs/html"
import swagger from "@elysiajs/swagger"

import { make_separators, make_phrases, combine_zip } from "gen-utils"
import wl from "@dicephrase/wordlist"

let port = +process.env.PORT! as number
let hostname = "0.0.0.0"
let defaultSep = "🌭"
let defaultWordCount = 11

const app = new Elysia()
	.use(html())
	.use(
		swagger({
			path: "/_/swagger",
			documentation: {
				info: {
					title: "Dicephrase",
					version: "0.0.1",
					description: "🎲",
				},
			},
		}),
	)
	.use(import("./csp-plugin"))
	.get(
		"/gen",
		({ query, headers }) => {
			let sep = query.s ?? defaultSep
			let count = query.c ?? defaultWordCount
			let separators = make_separators(sep, count)
			let words = make_phrases(count, wl)

			if (headers.accept?.includes("application/json")) {
				return {
					words,
					separators,
				}
			}
			return (
				<code id="dicephrase">{combine_zip(words, separators).join("")}</code>
			)
		},
		{
			query: t.Optional(
				t.Partial(
					t.Object({
						c: t.Number({ minimum: 2, maximum: 20, default: defaultWordCount }),
						s: t.ReadonlyOptional(t.String({ default: defaultSep })),
					}),
				),
			),
			detail: {
				summary: "Generate a Dicephrase",
				responses: {
					200: {
						description: "Successful responses",
						content: {
							"application/json": {
								example: {
									words: ["revenge", "founding", "book", "geriatric"],
									separators: new Array(4).fill(defaultSep),
								},
							},
							"text/html": {
								example:
									'<code id="dicephrase">raffle🌭smudge🌭buffoon🌭daredevil</code>',
							},
							"*/*": {
								example:
									'<code id="dicephrase">campsite🌭puzzling🌭gloomy🌭tapering</code>',
							},
						},
					},
				},
			},
			// transform({ query }) {
			// 	let c = +query.c!
			// 	// Using custom transform instead of numeric cuz swagger does not handle the t.Numeric :(
			// 	// See: https://elysiajs.com/concept/numeric.html#numeric
			// 	if (!Number.isNaN(c)) query.c = c
			// },
		},
	)
	.listen({ port, hostname })

console.info(`🦊 ${app.server?.hostname}:${app.server?.port}`)

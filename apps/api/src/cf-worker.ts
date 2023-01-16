import { Hono } from "hono"
import * as v from "@badrap/valita"
import {
	combine_zip,
	make_phrases,
	make_separators,
	RANDOM_SEPARATOR_OPTS,
	VAL_RANDOM,
} from "gen-utils"

let app = new Hono()

let queryParamParser = v.object({
	count: v.string().chain((rawCount) => {
		let c = +rawCount
		if (!Number.isInteger(c)) {
			return v.err(new Error("Count must be a whole number"))
		}
		if (Number.isNaN(c)) {
			return v.err(new Error("Count is invalid"))
		}
		if (c > 50) {
			return v.err(new Error("Count is too large"))
		}

		return v.ok(c)
	}),
	sep: v.union(
		...[
			...RANDOM_SEPARATOR_OPTS.map((char) => v.literal(char)),
			v.literal(VAL_RANDOM),
		],
	),
	fmt: v
		.union(v.literal("text"), v.literal("parts"), v.literal("verbose"))
		.default("text"),
})

app.get(
	"/gen",
	async (ctx, next) => {
		let rawInputQueryParams = {
			count: ctx.req.query("count"),
			sep: ctx.req.query("sep"),
			fmt: ctx.req.query("fmt"),
		}
		try {
			let input = queryParamParser.parse(rawInputQueryParams)
			ctx.req.valid(input)
			await next()
		} catch (error) {
			if (error instanceof v.ValitaError && error.issues) {
				return ctx.json(
					{
						// @ts-expect-error
						// Not sure why the types are wrong, but reality is this code works.
						issues: error.issues.map((e) => e.error.message),
					},
					400,
				)
			}

			return ctx.status(400)
		}
	},
	async (ctx) => {
		let input = ctx.req.valid() as v.Infer<typeof queryParamParser>
		let separators = make_separators(input.sep, input.count)
		let phrases = make_phrases(input.count, __WL_2016__)

		if (input.fmt === "text") {
			return ctx.text(combine_zip(phrases, separators).join(""))
		}
		if (input.fmt === "parts") {
			return ctx.json({
				phrases,
				separators,
			})
		}

		return ctx.status(400)
	},
)

export default app

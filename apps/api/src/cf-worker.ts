import { Hono } from "hono"
import * as v from "@badrap/valita"
import { valitaValidator } from "@chrstntdd/valita-validator"

import {
	combine_zip,
	make_phrases,
	make_separators,
	VAL_RANDOM,
} from "gen-utils"

let app = new Hono()

function clamp({ min, max }: { min: number; max: number }) {
	return (value: number) => {
		return Math.min(Math.max(value, min), max)
	}
}

let clampEntropy = clamp({ min: 4, max: 20 })

let schema = v.object({
	count: v.string().chain((rawCount) => {
		let c = +rawCount
		if (Number.isNaN(c)) {
			return v.err(new Error("Count must be valid whole number"))
		}
		if (!Number.isInteger(c)) {
			return v.err(new Error("Count must be a whole number"))
		}

		return v.ok(clampEntropy(c))
	}),
	sep: v.union(v.literal(VAL_RANDOM), v.string()),
	fmt: v
		.union(v.literal("text"), v.literal("parts"), v.literal("verbose"))
		.default("text"),
})

app.get(
	"/gen",
	// @ts-expect-error not sure about this one, the overload doesn't match?
	valitaValidator("query", { schema }, async (r, ctx) => {
		if (!r.success) {
			return ctx.text("Invalid params", 400)
		}
		let { sep, fmt, count } = r.data
		let separators = make_separators(sep, count)
		let phrases = make_phrases(count, __WL_2016__)

		if (fmt === "text") {
			return ctx.text(combine_zip(phrases, separators).join(""))
		}
		if (fmt === "parts") {
			return ctx.json({
				phrases,
				separators,
			})
		}
		return ctx.text("boo", 400)
	}),
)

export default app

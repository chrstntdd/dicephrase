import * as crypto from "crypto"
import { readFileSync } from "fs"
import { resolve } from "path"
import * as fc from "fast-check"

import { test, describe, expect, vi, beforeAll } from "vitest"
import { PHRASE_COUNT_FALLBACK, RANDOM_SEPARATOR_OPTS } from "./constants"

import { make_separators } from "."

function propertyHolds(fn: () => ReturnType<typeof fc["assert"]>) {
	expect(() => fn()).not.toThrowError()
}

beforeAll(() => {
	vi.stubGlobal("crypto", {
		getRandomValues: (x) => crypto.webcrypto.getRandomValues(x),
	})
})

describe("make_separators", () => {
	test("returns an array of characters from the available options with  length = $count - 1 ", () => {
		propertyHolds(() =>
			fc.assert(
				fc.property(fc.integer(), (count) => {
					fc.pre(count > 0 && count < 11)
					let result = make_separators("random", count)

					return (
						result.every((char) => RANDOM_SEPARATOR_OPTS.includes(char)) &&
						result.length === count - 1
					)
				}),
			),
		)
	})
})

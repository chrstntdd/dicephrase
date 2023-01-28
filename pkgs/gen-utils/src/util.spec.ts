import * as crypto from "node:crypto"

import { beforeAll, describe, expect, vi, it } from "vitest"

import {
	crack_time_in_years,
	random_int,
	sum_shannon_for_word,
} from "./Util.bs"

describe("random_int", () => {
	beforeAll(() => {
		vi.stubGlobal("crypto", {
			getRandomValues: (x) => crypto.webcrypto.getRandomValues(x),
		})
	})
	it("should return a number", () => {
		let res = random_int(0, 1)

		expect(res).toBeTypeOf("number")
	})

	it("should return a number in the range", () => {
		let res = random_int(0, 10)

		expect(res).toBeGreaterThanOrEqual(0)
		expect(res).toBeLessThanOrEqual(10)
	})

	it("should work with big numbers, too", () => {
		let res = random_int(1_000_000, 100_000_000)

		expect(res).toBeGreaterThanOrEqual(1_000_000)
		expect(res).toBeLessThanOrEqual(100_000_000)
	})
})

describe("sum_shannon_for_word", () => {
	it("should work", () => {
		let lowEnd = 6 * sum_shannon_for_word()
		let highEnd = 10 * sum_shannon_for_word()

		expect(lowEnd).toMatchInlineSnapshot("77.54887502163469")
		expect(highEnd).toMatchInlineSnapshot("129.24812503605781")
	})
})

describe("crack_time_in_years", () => {
	it("should work", () => {
		let lowEnd = 6 * sum_shannon_for_word()
		let highEnd = 10 * sum_shannon_for_word()
		let attemptsPerSec = 1_000_000_000

		expect(crack_time_in_years(lowEnd, attemptsPerSec)).toMatchInlineSnapshot(
			"7005.409781502188",
		)
		expect(crack_time_in_years(highEnd, attemptsPerSec)).toMatchInlineSnapshot(
			"25612888098739036000",
		)
	})
})

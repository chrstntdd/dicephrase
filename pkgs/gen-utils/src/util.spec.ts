import * as crypto from "crypto"
import { it, describe, expect, beforeAll, vi } from "vitest"

import { random_int } from "./Util.bs"

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

import * as crypto from "node:crypto"
import * as fc from "fast-check"
import { vi, test, expect, beforeAll } from "vitest"

import { random_int } from "./Util.gen"

function propertyHolds(fn: () => ReturnType<typeof fc["assert"]>) {
	expect(() => fn()).not.toThrowError()
}

type RandomImpl = (opts: { min: number; max: number }) => number

type Predicate = (min: number, max: number, result: number) => boolean

let isInInclusiveRange: Predicate = (min, max, result) =>
	result >= min && result <= max

let isInteger: Predicate = (_, __, result) => Number.isInteger(result)

let notNaN: Predicate = (_, __, result) => !Number.isNaN(result)

function harness(randomFnImpl: RandomImpl) {
	return function makeValidateProperty(predFn: Predicate) {
		return function validateProperty(min: number, max: number) {
			fc.pre(min < max)

			const result = randomFnImpl({ min, max })

			return predFn(min, max, result)
		}
	}
}

function makeTestsForIntegers(
	name: string,
	predicate: ReturnType<ReturnType<typeof harness>>,
	opts: Parameters<typeof fc["assert"]>[1],
) {
	test(`[integer] ${name}`, () => {
		propertyHolds(() =>
			fc.assert(fc.property(fc.integer(), fc.integer(), predicate), opts),
		)
	})

	test(`[nat] ${name}`, () => {
		propertyHolds(() =>
			fc.assert(fc.property(fc.nat(), fc.nat(), predicate), opts),
		)
	})
	test(`[maxSafeInteger] ${name}`, () => {
		propertyHolds(() =>
			fc.assert(
				fc.property(fc.maxSafeInteger(), fc.maxSafeInteger(), predicate),
				opts,
			),
		)
	})
	test(`[maxSafeNat] ${name}`, () => {
		propertyHolds(() =>
			fc.assert(fc.property(fc.maxSafeNat(), fc.maxSafeNat(), predicate), opts),
		)
	})
}

function makeTests(
	randomFnImpl: RandomImpl,
	opts: Parameters<typeof fc["assert"]>[1],
) {
	let validateProperty = harness(randomFnImpl)
	makeTestsForIntegers(
		"returns a number within the specified range",
		validateProperty(isInInclusiveRange),
		opts,
	)
	makeTestsForIntegers("returns an integer", validateProperty(isInteger), opts)
	makeTestsForIntegers("never returns NaN", validateProperty(notNaN), opts)
}

let sharedOptions = { numRuns: 500 } as Parameters<typeof makeTests>[1]

beforeAll(() => {
	vi.stubGlobal("crypto", {
		getRandomValues: (x) => crypto.webcrypto.getRandomValues(x),
	})
})

makeTests(random_int, sharedOptions)

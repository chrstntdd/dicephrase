/* eslint-disable @typescript-eslint/no-explicit-any, no-empty */

function assert(value: boolean, message?: string): asserts value
function assert<T>(
	value: T | null | undefined,
	message?: string,
): asserts value is T
function assert(value: any, message?: string) {
	if (value === false || value === null || typeof value === "undefined") {
		throw Error(message || "Assertion failed")
	}
}

export { assert }

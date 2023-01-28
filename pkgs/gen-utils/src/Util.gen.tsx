/* TypeScript file generated from Util.res by genType. */
/* eslint-disable import/first */

// @ts-ignore: Implicit any on import
import * as UtilBS__Es6Import from "./Util.bs"
const UtilBS: any = UtilBS__Es6Import

export const random_int: (_1: {
	readonly min: number
	readonly max: number
}) => number = function (Arg1: any) {
	const result = UtilBS.random_int(Arg1.min, Arg1.max)
	return result
}

export const sum_shannon_for_word: () => number = UtilBS.sum_shannon_for_word

export const crack_time_in_years: (_1: {
	readonly bits_of_entropy: number
	readonly attempts_per_second: number
}) => number = function (Arg1: any) {
	const result = UtilBS.crack_time_in_years(
		Arg1.bits_of_entropy,
		Arg1.attempts_per_second,
	)
	return result
}

// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Js_option from "rescript/lib/es6/js_option.js"
import * as Caml_exceptions from "rescript/lib/es6/caml_exceptions.js"

function str_to_int(s) {
	var nt = parseInt(s, 10)
	var match = isNaN(nt)
	if (match) {
		return
	} else {
		return nt
	}
}

function nullable_to_option(n) {
	if (null !== n) {
		return Js_option.some(n)
	}
}

function remainder_float(a, b) {
	return a % b
}

var DivisionByZero = /* @__PURE__ */ Caml_exceptions.create(
	"Util.DivisionByZero",
)

function remainder_float_exn(dividend, divisor) {
	if (divisor === 0) {
		throw {
			RE_EXN_ID: DivisionByZero,
			message: "Attempting to divide by 0",
			Error: new Error(),
		}
	}
	return remainder_float(dividend, divisor)
}

function random_int(min, max) {
	var range = Math.abs(max - min) + 1
	var bit = crypto.getRandomValues(new Uint32Array(1))[0]
	return min + remainder_float_exn(bit, range)
}

function shannon_entropy(outcome_count) {
	var prob = 1 / outcome_count
	var entropy = prob * -1 * Math.log2(prob)
	return entropy * outcome_count
}

function sum_shannon_for_word() {
	return shannon_entropy(6) * 5
}

var ms_per_year = 365.25 * 24 * 60 * 60 * 1000

function crack_time_in_years(bits_of_entropy, attempts_per_second) {
	var total_combos = Math.pow(2, bits_of_entropy)
	return total_combos / attempts_per_second / ms_per_year
}

export {
	str_to_int,
	nullable_to_option,
	remainder_float,
	DivisionByZero,
	remainder_float_exn,
	random_int,
	shannon_entropy,
	sum_shannon_for_word,
	ms_per_year,
	crack_time_in_years,
}
/* No side effect */

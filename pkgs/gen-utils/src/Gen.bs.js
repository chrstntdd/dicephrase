// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Util from "./Util.bs.js"
import * as Const from "./Const.bs.js"
import * as Js_math from "rescript/lib/es6/js_math.js"
import * as Js_option from "rescript/lib/es6/js_option.js"
import * as Caml_int32 from "rescript/lib/es6/caml_int32.js"

function make_key(_acc, _idx, data, len, min, max) {
	while (true) {
		var idx = _idx
		var acc = _acc
		if (len === idx) {
			return acc
		}
		var rand_bytes = data[idx]
		var remainder = Caml_int32.mod_(rand_bytes, max)
		var roll = (remainder + min) | 0
		var curr = acc + String(roll)
		var next_idx = (idx + 1) | 0
		_idx = next_idx
		_acc = curr
		continue
	}
}

function make_wl_keys(count) {
	var chunk_size = 5
	var key_count = Math.imul(count, chunk_size)
	var random_bits = crypto.getRandomValues(new Uint32Array(key_count))
	var acc = new Array(count).fill("")
	var _idx = 0
	var _out_idx = 0
	while (true) {
		var out_idx = _out_idx
		var idx = _idx
		var chunk_of_random_bytes = random_bits.subarray(
			idx,
			(idx + chunk_size) | 0,
		)
		var wl_key = make_key("", 0, chunk_of_random_bytes, chunk_size, 1, 6)
		acc[out_idx] = wl_key
		var next = (idx + chunk_size) | 0
		if (next === key_count) {
			return acc
		}
		_out_idx = (out_idx + 1) | 0
		_idx = next
		continue
	}
}

function shuffle(arr) {
	var items = arr
	var len = arr.length
	var idx = 0
	while (len > 0) {
		len = (len - 1) | 0
		var rand = Math.random()
		idx = Js_math.floor_int(rand * len)
		var t = items[len]
		items[len] = items[idx]
		items[idx] = t
	}
	return items
}

function combine_zip(a1, a2) {
	var a_size = a1.length
	var acc = []
	var _idx = 0
	while (true) {
		var idx = _idx
		if (idx === a_size) {
			return acc
		}
		var a_item = a1[idx]
		acc.push(a_item)
		var b_item = a2[idx]
		acc.push(b_item)
		_idx = (idx + 1) | 0
		continue
	}
}

function parse_qs_to_phrase_config(qs) {
	var url_inst = new URLSearchParams(qs)
	var count_from_qs = Util.nullable_to_option(url_inst.get(Const.count_key))
	var sep_from_qs = Util.nullable_to_option(url_inst.get(Const.sep_key))
	var count = Js_option.andThen(function (x) {
		var count_int = Util.str_to_int(x)
		return Js_option.andThen(function (x) {
			if (x >= Const.count_min && x <= Const.count_max) {
				return count_int
			}
		}, count_int)
	}, count_from_qs)
	var sep = Js_option.andThen(function (s) {
		if (/(random|\u00a0|-|\.|\$)/.test(s)) {
			return s
		}
	}, sep_from_qs)
	if (count !== undefined && sep !== undefined) {
		return {
			count: count,
			sep: sep,
		}
	} else {
		return {
			count: Const.count_fallback,
			sep: Const.sep_fallback,
		}
	}
}

function parse_count_val(v) {
	var vi = Util.str_to_int(v)
	if (vi !== undefined) {
		return vi
	} else {
		return Const.count_fallback
	}
}

function make_phrases(count, wlRecord) {
	var keys = make_wl_keys(count)
	var key_length = keys.length
	var phrases = new Array(key_length).fill("")
	var _idx = 0
	while (true) {
		var idx = _idx
		if (idx === key_length) {
			return phrases
		}
		var key = keys[idx]
		phrases[idx] = wlRecord[key]
		_idx = (idx + 1) | 0
		continue
	}
}

function make_separators(separator_kind, count) {
	var sep_count = (count - 1) | 0
	if (separator_kind !== Const.sep_fallback) {
		return new Array(sep_count).fill(separator_kind)
	}
	var all_chars = Const.random_sep_chars.length
	var empty_arr = new Array(sep_count).fill("")
	var max = (all_chars - 1) | 0
	var _i = 0
	while (true) {
		var i = _i
		if (i === sep_count) {
			return empty_arr
		}
		var param = Util.random_int(0, max) | 0
		var random_separator_char = Const.random_sep_chars[param]
		empty_arr[i] = random_separator_char
		_i = (i + 1) | 0
		continue
	}
}

export {
	make_wl_keys,
	shuffle,
	combine_zip,
	parse_qs_to_phrase_config,
	parse_count_val,
	make_phrases,
	make_separators,
}
/* Const Not a pure module */

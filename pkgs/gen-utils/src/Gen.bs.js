// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Js_math from "rescript/lib/es6/js_math.js"
import * as Js_option from "rescript/lib/es6/js_option.js"
import * as Caml_int32 from "rescript/lib/es6/caml_int32.js"
import * as Constants from "./constants"

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
  var key_count = Math.imul(count, 5)
  var raw_bits = new Uint32Array(key_count)
  crypto.getRandomValues(raw_bits)
  var acc = new Array(count)
  var _idx = 0
  var _out_idx = 0
  while (true) {
    var out_idx = _out_idx
    var idx = _idx
    var chunk_of_random_bytes = raw_bits.subarray(idx, (idx + 5) | 0)
    var collection_length = chunk_of_random_bytes.length
    var wl_key = make_key("", 0, chunk_of_random_bytes, collection_length, 1, 6)
    acc[out_idx] = wl_key
    var next = (idx + 5) | 0
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

function str_to_int(s) {
  var nt = parseInt(s, 10)
  var match = isNaN(nt)
  if (match) {
    return
  } else {
    return nt
  }
}

var count_key = Constants.PHRASE_COUNT_KEY

var sep_key = Constants.SEPARATOR_KEY

var count_min = Constants.PHRASE_COUNT_MIN

var count_max = Constants.PHRASE_COUNT_MAX

var count_fallback = Constants.PHRASE_COUNT_FALLBACK

var sep_fallback = Constants.SEPARATOR_FALLBACK

function nullable_to_option(n) {
  if (null !== n) {
    return Js_option.some(n)
  }
}

function parse_qs_to_phrase_config(qs) {
  var url_inst = new URLSearchParams(qs)
  var count_from_qs = nullable_to_option(url_inst.get(count_key))
  var sep_from_qs = nullable_to_option(url_inst.get(sep_key))
  var count = Js_option.andThen(function (x) {
    var count_int = str_to_int(x)
    return Js_option.andThen(function (x) {
      if (x >= count_min && x <= count_max) {
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
      sep: sep
    }
  } else {
    return {
      count: count_fallback,
      sep: sep_fallback
    }
  }
}

function parse_count_val(v) {
  var vi = str_to_int(v)
  if (vi !== undefined) {
    return vi
  } else {
    return count_fallback
  }
}

function make_phrases(count, wlRecord) {
  var keys = make_wl_keys(count)
  var key_length = keys.length
  var phrases = new Array(key_length)
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

var random_sep_chars = Constants.RANDOM_SEPARATOR_OPTS

function make_separators(separator_kind, count) {
  var sep_count = (count - 1) | 0
  if (separator_kind !== "random") {
    return new Array(sep_count).fill(separator_kind)
  }
  var separators = []
  while (separators.length < sep_count) {
    separators.push(shuffle(random_sep_chars.slice())[0])
  }
  return separators
}

export {
  make_key,
  make_wl_keys,
  shuffle,
  combine_zip,
  str_to_int,
  count_key,
  sep_key,
  count_min,
  count_max,
  count_fallback,
  sep_fallback,
  nullable_to_option,
  parse_qs_to_phrase_config,
  parse_count_val,
  make_phrases,
  random_sep_chars,
  make_separators
}
/* count_key Not a pure module */

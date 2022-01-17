// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Js_math from "rescript/lib/es6/js_math.js";
import * as Js_option from "rescript/lib/es6/js_option.js";
import * as Constants from "./constants";

function make_wl_keys(count, getRandomValues) {
  var key_count = Math.imul(count, 5);
  var raw_bits = new Uint32Array(key_count);
  getRandomValues(raw_bits);
  var acc = [];
  var _idx = 0;
  while(true) {
    var idx = _idx;
    if (idx % 5 === 0) {
      acc.push(raw_bits.subarray(idx, idx + 5 | 0).map(function (x) {
                  return x % 6 + 1 | 0;
                }).join(""));
    }
    if ((idx + 1 | 0) === key_count) {
      return acc;
    }
    _idx = idx + 1 | 0;
    continue ;
  };
}

function shuffle(arr) {
  var items = arr;
  var len = arr.length;
  var idx = 0;
  while(len > 0) {
    len = len - 1 | 0;
    var rand = Math.random();
    idx = Js_math.floor_int(rand * len);
    var t = items[len];
    items[len] = items[idx];
    items[idx] = t;
  };
  return items;
}

function combine_zip(a1, a2) {
  var a_size = a1.length;
  var out = [];
  var _idx = 0;
  while(true) {
    var idx = _idx;
    if (idx === a_size) {
      return out;
    }
    var a_item = a1[idx];
    out.push(a_item);
    var b_item = a2[idx];
    out.push(b_item);
    _idx = idx + 1 | 0;
    continue ;
  };
}

function str_to_int(s) {
  var nt = parseInt(s, 10);
  var match = isNaN(nt);
  if (match) {
    return ;
  } else {
    return nt;
  }
}

var count_key = Constants.PHRASE_COUNT_KEY;

var sep_key = Constants.SEPARATOR_KEY;

var count_min = Constants.PHRASE_COUNT_MIN;

var count_max = Constants.PHRASE_COUNT_MAX;

var count_fallback = Constants.PHRASE_COUNT_FALLBACK;

var sep_fallback = Constants.SEPARATOR_FALLBACK;

function nullable_to_option(n) {
  if (null !== n) {
    return Js_option.some(n);
  }
  
}

function parse_qs_to_phrase_config(qs) {
  var url_inst = new URLSearchParams(qs);
  var count_from_qs = nullable_to_option(url_inst.get(count_key));
  var sep_from_qs = nullable_to_option(url_inst.get(sep_key));
  var count = Js_option.andThen((function (x) {
          var count_int = str_to_int(x);
          return Js_option.andThen((function (x) {
                        if (x >= count_min && x <= count_max) {
                          return count_int;
                        }
                        
                      }), count_int);
        }), count_from_qs);
  var sep = Js_option.andThen((function (s) {
          if (/(random|\u00a0|-|\.|\$)/.test(s)) {
            return s;
          }
          
        }), sep_from_qs);
  if (count !== undefined && sep !== undefined) {
    return {
            count: count,
            sep: sep
          };
  } else {
    return {
            count: count_fallback,
            sep: sep_fallback
          };
  }
}

function parse_count_val(v) {
  var vi = str_to_int(v);
  if (vi !== undefined) {
    return vi;
  } else {
    return count_fallback;
  }
}

export {
  make_wl_keys ,
  shuffle ,
  combine_zip ,
  str_to_int ,
  count_key ,
  sep_key ,
  count_min ,
  count_max ,
  count_fallback ,
  sep_fallback ,
  nullable_to_option ,
  parse_qs_to_phrase_config ,
  parse_count_val ,
  
}
/* count_key Not a pure module */

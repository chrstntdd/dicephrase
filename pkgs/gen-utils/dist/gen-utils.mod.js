var F = Object.defineProperty
var U = (n, e) => {
  for (var t in e) F(n, t, { get: e[t], enumerable: !0 })
}
var v = "phrase-count",
  A = "separator",
  S = 6,
  T = 10,
  N = "random",
  O = 8
var d = {}
U(d, {
  combine_zip: () => q,
  count_fallback: () => c,
  count_key: () => P,
  count_max: () => g,
  count_min: () => M,
  make_wl_keys: () => b,
  nullable_to_option: () => m,
  parse_count_val: () => K,
  parse_qs_to_phrase_config: () => H,
  sep_fallback: () => B,
  sep_key: () => J,
  shuffle: () => D,
  str_to_int: () => p
})
var f = 2147483647,
  l = -2147483648
function h(n) {
  return n > f ? f : n < l ? l : Math.floor(n)
}
function C(n) {
  return n === void 0
    ? { BS_PRIVATE_NESTED_SOME_NONE: 0 }
    : n !== null && n.BS_PRIVATE_NESTED_SOME_NONE !== void 0
    ? { BS_PRIVATE_NESTED_SOME_NONE: (n.BS_PRIVATE_NESTED_SOME_NONE + 1) | 0 }
    : n
}
function R(n) {
  if (!(n !== null && n.BS_PRIVATE_NESTED_SOME_NONE !== void 0)) return n
  var e = n.BS_PRIVATE_NESTED_SOME_NONE
  if (e !== 0) return { BS_PRIVATE_NESTED_SOME_NONE: (e - 1) | 0 }
}
function y(n) {
  return C(n)
}
function s(n, e) {
  if (e !== void 0) return n(R(e))
}
function b(n, e) {
  var t = Math.imul(n, 5),
    r = new Uint32Array(t)
  e(r)
  for (var u = [], o = 0; ; ) {
    var i = o
    if (
      (i % 5 === 0 &&
        u.push(
          r
            .subarray(i, (i + 5) | 0)
            .map(function (_) {
              return ((_ % 6) + 1) | 0
            })
            .join("")
        ),
      ((i + 1) | 0) === t)
    )
      return u
    o = (i + 1) | 0
  }
}
function D(n) {
  for (var e = n, t = n.length, r = 0; t > 0; ) {
    t = (t - 1) | 0
    var u = Math.random()
    r = h(u * t)
    var o = e[t]
    ;(e[t] = e[r]), (e[r] = o)
  }
  return e
}
function q(n, e) {
  for (var t = n.length, r = [], u = 0; ; ) {
    var o = u
    if (o === t) return r
    var i = n[o]
    r.push(i)
    var _ = e[o]
    r.push(_), (u = (o + 1) | 0)
  }
}
function p(n) {
  var e = parseInt(n, 10),
    t = isNaN(e)
  if (!t) return e
}
var P = v,
  J = A,
  M = S,
  g = T,
  c = O,
  B = N
function m(n) {
  if (n !== null) return y(n)
}
function H(n) {
  var e = new URLSearchParams(n),
    t = m(e.get(P)),
    r = m(e.get(J)),
    u = s(function (i) {
      var _ = p(i)
      return s(function (E) {
        if (E >= M && E <= g) return _
      }, _)
    }, t),
    o = s(function (i) {
      if (/(random|\u00a0|-|\.|\$)/.test(i)) return i
    }, r)
  return u !== void 0 && o !== void 0
    ? { count: u, sep: o }
    : { count: c, sep: B }
}
function K(n) {
  var e = p(n)
  return e !== void 0 ? e : c
}
var a = d,
  z = a.make_wl_keys,
  Y = a.shuffle,
  $ = a.combine_zip,
  G = a.parse_qs_to_phrase_config,
  X = a.parse_count_val
export {
  O as PHRASE_COUNT_FALLBACK,
  v as PHRASE_COUNT_KEY,
  T as PHRASE_COUNT_MAX,
  S as PHRASE_COUNT_MIN,
  N as SEPARATOR_FALLBACK,
  A as SEPARATOR_KEY,
  $ as combine_zip,
  z as make_wl_keys,
  X as parse_count_val,
  G as parse_qs_to_phrase_config,
  Y as shuffle
}

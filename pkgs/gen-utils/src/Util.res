/* *************************************************************************** */
/* Bindings */
/* *************************************************************************** */
@scope("crypto")
external getRandomValuesU32: Js.TypedArray2.Uint32Array.t => Js.TypedArray2.Uint32Array.t =
  "getRandomValues"
@scope("crypto")
external getRandomValuesU8: Js.TypedArray2.Uint8Array.t => Js.TypedArray2.Uint8Array.t =
  "getRandomValues"

// Create fixed sized array with holes
@new external make_array_of_size: int => Js.Array2.t<'a> = "Array"

// Define `Array.fill`
@send external fill: (Js.Array2.t<'a>, 'a) => Js.Array2.t<'a> = "fill"

@val external parseInt: (string, int) => int = "parseInt"

@val external isNaN: int => bool = "isNaN"

type t_url_search = {get: (. string) => Js.null<string>}
@new external make_url_search: string => t_url_search = "URLSearchParams"

/* *************************************************************************** */
/* Helpers */
/* *************************************************************************** */

let str_to_int = s => {
  let nt = parseInt(s, 10)
  switch nt->isNaN {
  | false => Some(nt)
  | _ => None
  }
}

// Lighter Caml_option.nullable_to_opt
let nullable_to_option = n => {
  if Js.Null.empty != n {
    Js.Option.some(Js.Null.getUnsafe(n))
  } else {
    None
  }
}

// The built in `mod` function only works on ints
// which is not what we want
let remainder_float = (a: float, b: float): float => {
  // "use" the variables to prevent the warning
  let _ = a
  let _ = b
  %raw(`a % b`)
}

exception DivisionByZero({message: string})

let remainder_float_exn = (. ~dividend, ~divisor) => {
  if divisor == 0. {
    raise(DivisionByZero({message: "Attempting to divide by 0"}))
  } else {
    remainder_float(dividend, divisor)
  }
}

@genType
let random_int = (. ~min, ~max) => {
  let range = Js.Math.abs_float(max -. min) +. 1.
  let bit =
    Js.TypedArray2.Uint32Array.fromLength(1)
    ->getRandomValuesU32
    ->Js.TypedArray2.Uint32Array.unsafe_get(0)
    ->Belt.Float.fromInt

  min +. remainder_float_exn(. ~dividend=bit, ~divisor=range)
}

// https://stackoverflow.com/questions/51105055/shannon-entropy-of-an-array-in-typescript

let shannon_entropy = outcome_count => {
  let prob = 1. /. outcome_count
  let entropy = prob *. -1. *. Js.Math.log2(prob)

  entropy *. outcome_count
}

// Generates the amount of bit for a single word in the wordlist by "rolling" 5 6-sided die
@genType
let sum_shannon_for_word = (. ()) => {
  shannon_entropy(6.) *. 5.
}

let ms_per_year = 365.25 *. 24. *. 60. *. 60. *. 1000.

@genType
let crack_time_in_years = (. ~bits_of_entropy, ~attempts_per_second) => {
  let total_combos = Js.Math.pow_float(~base=2., ~exp=bits_of_entropy)
  total_combos /. attempts_per_second /. ms_per_year
}

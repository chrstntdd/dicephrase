/* *************************************************************************** */
/* Bindings */
/* *************************************************************************** */
@scope("crypto") @val
external getRandomValues: Js.TypedArray2.Uint32Array.t => unit = "getRandomValues"
@scope("crypto") @val
external getRandomValuesU8: Js.TypedArray2.Uint8Array.t => unit = "getRandomValues"

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

%%private(
  let sum_uint8_entries = t => {
    // Intentionally using floats to avoid ReScript from truncating the numbers
    // with `| 0` (similar to Math.floor).
    let len = Js.TypedArray2.Uint8Array.length(t)
    let get_from_index = Js.TypedArray2.Uint8Array.unsafe_get(t)

    let rec loop = (acc, i) => {
      if i == len {
        acc
      } else {
        let curr = i->get_from_index->Belt.Int.toFloat
        let acc = acc +. curr *. 256. ** Belt.Int.toFloat(i)

        loop(acc, i + 1)
      }
    }

    loop(0.0, 0)
  }
)

// The built in `mod` function only works on ints
// which is not what we want
%%private(
  let mod_float = (a: float, b: float): float => {
    %raw(`a % b`)
  }
)

@genType
let random_int = (min, max) => {
  module Int = Belt.Int
  open Js.Math
  // Note the use of floats, this is to avoid ReScript
  // casting the numbers to ints with `| 0` everywhere
  // This only really matters for a max near 100_000_000
  let range = Int.toFloat(max - min + 1)
  let bytes_needed = ceil_int(log2(range) /. 8.)
  let cutoff = floor_float(256. ** Int.toFloat(bytes_needed) /. range) *. range
  let bytes = Js.TypedArray2.Uint8Array.fromLength(bytes_needed)

  let rec loop = _ => {
    // Get new random values on each iteration
    bytes->getRandomValuesU8
    let value = sum_uint8_entries(bytes)

    if value >= cutoff {
      loop()
    } else {
      value
    }
  }

  let value = loop()
  Int.toFloat(min) +. mod_float(value, range)
}

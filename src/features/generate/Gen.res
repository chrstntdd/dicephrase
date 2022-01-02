// Binding to global crypto.getRandomValues
// Breaks in node testing...
// @scope("crypto") @val
// external getRandomValues: Js.TypedArray2.Uint32Array.t => unit = "getRandomValues"

/**
 * Generates a set of random keys for lookup in the wordlist.
 *
 * ex: fn(5) => ["11132", "41663", "34324", "43135", "41126"]
 */
@genType
let make_wl_keys = (. count, getRandomValues) => {
  open Js.TypedArray2
  let chunk_size = 5
  let key_count = count * chunk_size
  let raw_bits = Uint32Array.fromLength(key_count)

  // Fill (mutates the raw_bits in place)
  getRandomValues(. raw_bits)

  let min = 1
  let max = 6

  let rec bits_to_keys = (bits, acc, idx) => {
    if mod(idx, chunk_size) == 0 {
      acc
      ->Js.Array2.push(
        bits
        ->Uint32Array.subarray(~start=idx, ~end_=idx + chunk_size)
        ->Uint32Array.map((. x) => {
          let roll = mod(x, max) + min
          roll
        })
        ->Uint32Array.joinWith(""),
      )
      ->ignore
    }

    if idx + 1 === key_count {
      acc
    } else {
      bits_to_keys(bits, acc, idx + 1)
    }
  }

  bits_to_keys(raw_bits, [], 0)
}

@genType
let shuffle = arr => {
  open Js.Array2

  let items = ref(arr)
  let len = ref(length(arr))
  let idx = ref(0)

  while len.contents > 0 {
    len := len.contents - 1
    let rand = Js.Math.random()

    idx := Js.Math.floor_int(rand *. Belt.Float.fromInt(len.contents))

    let t = unsafe_get(items.contents, len.contents)

    unsafe_set(items.contents, len.contents, unsafe_get(items.contents, idx.contents))
    unsafe_set(items.contents, idx.contents, t)
  }

  items.contents
}

/**
 * Create fixed sized array with holes
 */
type t<'a> = Js.Array2.t<'a>
@new external make_array_of_size: int => t<'a> = "Array"

@genType
let combine_zip = (a1, a2) => {
  open Js.Array2

  let a_size = length(a1)
  let out = []

  let rec combine_inner = (idx, acc) => {
    if idx == a_size {
      acc
    } else {
      let a_item = unsafe_get(a1, idx)
      push(acc, a_item)->ignore

      let b_item = unsafe_get(a2, idx)
      push(acc, b_item)->ignore

      combine_inner(idx + 1, acc)
    }
  }

  combine_inner(0, out)
}

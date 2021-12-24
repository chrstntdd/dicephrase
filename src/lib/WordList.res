@scope("crypto") @val
external getRandomValues: Js.TypedArray2.Uint32Array.t => unit = "getRandomValues"

/**
 * Generates a set of random keys for lookup in the wordlist.
 *
 * ex: fn(5) => ["11132", "41663", "34324", "43135", "41126"]
 */
let make_wl_keys = (~count: int) => {
  open Js.TypedArray2
  let chunk_size = 5
  let key_count = count * chunk_size
  let raw_bits = Uint32Array.fromLength(key_count)

  // Fill (mutates the raw_bits in place)
  getRandomValues(raw_bits)

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

%%private(
  let rec make_key = (~acc, ~idx, ~data, ~len, ~min, ~max) => {
    if len == idx {
      acc
    } else {
      // Clamps the random bytes to a valid 6 sided die value (1-6)
      let rand_bytes = Js.TypedArray2.Uint32Array.unsafe_get(data, idx)
      let remainder = mod(rand_bytes, max)
      let roll = remainder + min
      let curr = acc ++ string_of_int(roll)
      let next_idx = idx + 1

      make_key(~acc=curr, ~idx=next_idx, ~data, ~len, ~min, ~max)
    }
  }
)

/**
 * Generates a set of random keys for lookup in the wordlist.
 *
 * ex: fn(5) => ["11132", "41663", "34324", "43135", "41126"]
 */
@genType
let make_wl_keys = count => {
  open Js.TypedArray2
  let chunk_size = 5
  let key_count = count * chunk_size
  let raw_bits = Uint32Array.fromLength(key_count)

  // Fill (mutates the raw_bits in place)
  Util.getRandomValues(raw_bits)

  let min = 1
  let max = 6

  let rec bits_to_keys = (acc, idx, out_idx) => {
    // Consume the next chunk
    let chunk_of_random_bytes = Uint32Array.subarray(raw_bits, ~start=idx, ~end_=idx + chunk_size)
    let wl_key = make_key(~acc="", ~idx=0, ~data=chunk_of_random_bytes, ~len=chunk_size, ~min, ~max)

    Js.Array2.unsafe_set(acc, out_idx, wl_key)

    // Skip intermediate steps (such as incrementing idx) and hop to next chunk
    let next = idx + chunk_size

    if next === key_count {
      acc
    } else {
      bits_to_keys(acc, next, out_idx + 1)
    }
  }

  bits_to_keys(Util.fill(Util.make_array_of_size(count), ""), 0, 0)
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

@genType
let combine_zip = (. a1, a2) => {
  open Js.Array2

  let a_size = length(a1)

  let rec combine_inner = (acc, idx) => {
    if idx == a_size {
      acc
    } else {
      let a_item = unsafe_get(a1, idx)
      push(acc, a_item)->ignore

      let b_item = unsafe_get(a2, idx)
      push(acc, b_item)->ignore

      combine_inner(acc, idx + 1)
    }
  }

  combine_inner([], 0)
}

@genType
type phase_cfg = {
  count: int,
  sep: string,
}

@genType
let parse_qs_to_phrase_config = qs => {
  open Js.Option
  let url_inst = Util.make_url_search(qs)
  let count_from_qs = Util.nullable_to_option(url_inst.get(. Const.count_key))
  let sep_from_qs = Util.nullable_to_option(url_inst.get(. Const.sep_key))

  let count = count_from_qs |> andThen((. x) => {
    let count_int = Util.str_to_int(x)

    count_int |> andThen((. x) => {
      if x >= Const.count_min && x <= Const.count_max {
        count_int
      } else {
        None
      }
    })
  })

  let sep = sep_from_qs |> andThen((. s) => {
    if Js.Re.test_(%re("/(random|\u00a0|-|\.|\$)/"), s) {
      Some(s)
    } else {
      None
    }
  })

  switch (count, sep) {
  | (Some(c), Some(s)) => {count: c, sep: s}
  | _ => {count: Const.count_fallback, sep: Const.sep_fallback}
  }
}

@genType
let parse_count_val = v => {
  switch Util.str_to_int(v) {
  | Some(vi) => vi
  | _ => Const.count_fallback
  }
}

@genType
let make_phrases = (. count, wlRecord) => {
  open Js.Array2
  let keys = make_wl_keys(count)
  let key_length = length(keys)
  let phrases = Util.fill(Util.make_array_of_size(key_length), "")

  let rec inner = (acc, idx) => {
    if idx == key_length {
      acc
    } else {
      let key = unsafe_get(keys, idx)
      unsafe_set(acc, idx, Js.Dict.unsafeGet(wlRecord, key))
      inner(acc, idx + 1)
    }
  }

  inner(phrases, 0)
}

@genType
let make_separators = (. separator_kind, count) => {
  open Js.Array2
  let sep_count = count - 1

  if separator_kind == Const.sep_fallback {
    let separators = []
    while length(separators) < sep_count {
      push(separators, unsafe_get(shuffle(copy(Const.random_sep_chars)), 0))->ignore
    }
    separators
  } else {
    Util.fill(Util.make_array_of_size(sep_count), separator_kind)
  }
}

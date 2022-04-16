@scope("crypto") @val
external getRandomValues: Js.TypedArray2.Uint32Array.t => unit = "getRandomValues"

/**
 * Create fixed sized array with holes
 */
@new external make_array_of_size: int => Js.Array2.t<'a> = "Array"

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
  getRandomValues(raw_bits)

  let min = 1
  let max = 6

  let rec bits_to_keys = (acc, idx, out_idx) => {
    // Consume the next chunk
    let chunk_of_random_bytes = raw_bits->Uint32Array.subarray(~start=idx, ~end_=idx + chunk_size)
    let collection_length = Uint32Array.length(chunk_of_random_bytes)
    let wl_key = make_key(
      ~acc="",
      ~idx=0,
      ~data=chunk_of_random_bytes,
      ~len=collection_length,
      ~min,
      ~max,
    )

    Js.Array2.unsafe_set(acc, out_idx, wl_key)

    // Skip intermediate steps (such as incrementing idx) and hop to next chunk
    let next = idx + chunk_size

    if next === key_count {
      acc
    } else {
      bits_to_keys(acc, next, out_idx + 1)
    }
  }

  bits_to_keys(make_array_of_size(count), 0, 0)
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

@val external parseInt: (string, int) => int = "parseInt"

@val external isNaN: int => bool = "isNaN"

%%private(
  let str_to_int = s => {
    let nt = parseInt(s, 10)
    switch nt->isNaN {
    | false => Some(nt)
    | _ => None
    }
  }
)

type t_url_search = {get: (. string) => Js.null<string>}
@new external make_url_search: string => t_url_search = "URLSearchParams"

%%private(@module("./constants") external count_key: string = "PHRASE_COUNT_KEY")
%%private(@module("./constants") external sep_key: string = "SEPARATOR_KEY")
%%private(@module("./constants") external count_min: int = "PHRASE_COUNT_MIN")
%%private(@module("./constants") external count_max: int = "PHRASE_COUNT_MAX")
%%private(@module("./constants") external count_fallback: int = "PHRASE_COUNT_FALLBACK")
%%private(@module("./constants") external sep_fallback: string = "SEPARATOR_FALLBACK")

type separator = [#"\u00a0" | #"-" | #"." | #"$" | #random]

@genType
type phase_cfg = {
  count: int,
  sep: string, // polymorphic ^^^?
}

// Lighter Caml_option.nullable_to_opt
%%private(
  let nullable_to_option = n => {
    if Js.Null.empty != n {
      Js.Option.some(Js.Null.getUnsafe(n))
    } else {
      None
    }
  }
)

@genType
let parse_qs_to_phrase_config = qs => {
  open Js.Option
  let url_inst = qs->make_url_search
  let count_from_qs = url_inst.get(. count_key)->nullable_to_option
  let sep_from_qs = url_inst.get(. sep_key)->nullable_to_option

  let count = count_from_qs |> andThen((. x) => {
    let count_int = str_to_int(x)

    andThen((. x) => {
      if x >= count_min && x <= count_max {
        count_int
      } else {
        None
      }
    }, count_int)
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
  | _ => {count: count_fallback, sep: sep_fallback}
  }
}

@genType
let parse_count_val = v => {
  switch str_to_int(v) {
  | Some(vi) => vi
  | _ => count_fallback
  }
}

@genType
let make_phrases = (. count, wlRecord) => {
  open Js.Array2
  let keys = count->make_wl_keys
  let key_length = keys->length
  let phrases = key_length->make_array_of_size

  let rec inner = (acc, idx) => {
    if idx == key_length {
      acc
    } else {
      let key = keys->unsafe_get(idx)
      acc->unsafe_set(idx, Js.Dict.unsafeGet(wlRecord, key))
      inner(acc, idx + 1)
    }
  }

  inner(phrases, 0)
}

%%private(
  @module("./constants") external random_sep_chars: Js.Array2.t<string> = "RANDOM_SEPARATOR_OPTS"
)

// Define `Array.fill`
@send external fill: (Js.Array2.t<'a>, 'a) => Js.Array2.t<'a> = "fill"

@genType
let make_separators = (. separator_kind, count) => {
  open Js.Array2
  let sep_count = count - 1

  if separator_kind == "random" {
    let separators = []
    while separators->length < sep_count {
      push(separators, shuffle(copy(random_sep_chars))->unsafe_get(0))->ignore
    }
    separators
  } else {
    fill(make_array_of_size(sep_count), separator_kind)
  }
}

external getRandomValuesU32 :
  Js.TypedArray2.Uint32Array.t -> Js.TypedArray2.Uint32Array.t
  = "getRandomValues"
[@@mel.scope "crypto"]

let remainder_float (a : float) (b : float) : float =
  let _ = a in
  let _ = b in
  [%mel.raw "a % b"]

module JSPlatform : Core.PlatformAdapter = struct
  module JSRandom = struct
    let init () = ()

    let get_random_int ~min ~max =
      let range = Js.Math.abs_int (max - min + 1) in
      let bit =
        Js.TypedArray2.Uint32Array.fromLength 1
        |. getRandomValuesU32
        |. Js.TypedArray2.Uint32Array.unsafe_get 0
      in

      min
      + int_of_float (remainder_float (float_of_int bit) (float_of_int range))
  end

  module EFFLargeWl2016 = struct
    type t = String.t Js.Dict.t

    let int_to_str n = Js.Int.toString n
    let get_word wl key = Js.Dict.get wl key |> Js.Option.getExn
    let load_list () : t = Js.Dict.empty ()
  end

  module Random = Core.MakeRandomGenerator (JSRandom)
  module WordList = EFFLargeWl2016
end

(* Creates the dicephrase module for the implied module created by this file *)
include Core.MakeDicephrase (JSPlatform)

let make_separator = Core.make_separator

type rng = X

let make_wl_keys ~(rng : rng) (count : int) =
  let _ = count in
  let _ = rng in
  [| "" |]

let make_rng () = X

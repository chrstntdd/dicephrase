external getRandomValuesU32 :
  Js.TypedArray2.Uint32Array.t -> Js.TypedArray2.Uint32Array.t
  = "getRandomValues"
[@@mel.scope "crypto"]

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

      min + (bit mod range)
  end

  module EFFLargeWl2016 = struct
    type t = String.t Js.Dict.t

    let get_word wl key = Js.Dict.get wl key |> Option.get
    let load_list () : t = failwith "Unimplemented"
  end

  module Random = Core.MakeRandomGenerator (JSRandom)
  module WordList = EFFLargeWl2016
end

(* Creates the dicephrase module for the implied module created by this file *)
include Core.MakeDicephrase (JSPlatform)

let make_separator = Core.make_separator

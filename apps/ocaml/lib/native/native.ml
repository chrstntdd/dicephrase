module NativePlatform : Core.PlatformAdapter = struct
  module NativeRandom = struct
    let init () = Random.self_init ()
    let get_random_int ~min ~max = min + Random.int (max - min + 1)
  end

  module EFFLargeWl2016 = struct
    type t = Yojson.Basic.t

    let get_word wl key =
      Yojson.Basic.Util.member key wl |> Yojson.Basic.Util.to_string

    let load_list () =
      (* Unable to use a path relative to this file due to issue in dune https://github.com/johnwhitington/ppx_blob/issues/23 *)
      let wl = [%blob "apps/ocaml/lib/native/wl-2016.json"] in
      Yojson.Basic.from_string wl
  end

  module Random = Core.MakeRandomGenerator (NativeRandom)
  module WordList = EFFLargeWl2016
end

(* Creates the dicephrase module for the implied module created by this file *)
include Core.MakeDicephrase (NativePlatform)

let make_separator = Core.make_separator

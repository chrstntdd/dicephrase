module NativePlatform : Core.PlatformAdapter = struct
  module NativeRandom = struct
    let init () = Random.self_init ()
    let get_random_int ~min ~max = min + Random.int (max - min + 1)
  end

  module EFFLargeWl2016 = struct
    type t = Yojson.Basic.t

    let int_to_str = Int.to_string

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

type rng = Cryptokit.Random.rng

let make_rng () = Cryptokit.Random.secure_rng

let generate_random_u32_array ~rng size =
  let buffer = Bytes.create (size * 4) in
  rng#random_bytes buffer 0 (size * 4);
  let array =
    Array.init size (fun i ->
        let base = i * 4 in
        let n1 = int_of_char (Bytes.get buffer base) in
        let n2 = int_of_char (Bytes.get buffer (base + 1)) in
        let n3 = int_of_char (Bytes.get buffer (base + 2)) in
        let n4 = int_of_char (Bytes.get buffer (base + 3)) in
        Int32.logor (Int32.of_int n1) (Int32.shift_left (Int32.of_int n2) 8)
        |> Int32.logor (Int32.shift_left (Int32.of_int n3) 16)
        |> Int32.logor (Int32.shift_left (Int32.of_int n4) 24))
  in
  array

let make_key ~acc ~idx ~data ~len =
  let rec helper acc idx =
    if idx = len then acc
    else
      let n = Int32.to_int (Array.get data idx) in
      let remainder = n land 0x7FFFFFFF mod 6 in
      (* Ensure positive *)
      let roll = remainder + 1 in
      let curr = acc ^ string_of_int roll in
      helper curr (idx + 1)
  in
  helper acc idx

let make_wl_keys ~rng count =
  let min = 1 in
  let max = 6 in
  let chunk_size = max - min in
  let key_count = count * chunk_size in
  let random_bits = generate_random_u32_array ~rng key_count in

  let rec bits_to_keys acc idx out_idx =
    let chunk_of_random_bytes = Array.sub random_bits idx chunk_size in
    let wl_key =
      make_key ~acc:"" ~idx:0 ~data:chunk_of_random_bytes ~len:chunk_size
    in
    Array.set acc out_idx wl_key;
    let next = idx + chunk_size in
    if next = key_count then acc else bits_to_keys acc next (out_idx + 1)
  in

  let acc = Array.make count "" in
  bits_to_keys acc 0 0

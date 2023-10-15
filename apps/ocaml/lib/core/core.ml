module type RandomGeneratorType = sig
  val init : unit -> unit
  val get_random_int : min:int -> max:int -> int
  val std_dice_roll : unit -> int
end

module type RandomSource = sig
  val init : unit -> unit
  val get_random_int : min:int -> max:int -> int
end

module MakeRandomGenerator (R : RandomSource) : RandomGeneratorType = struct
  let init = R.init
  let get_random_int = R.get_random_int
  let std_dice_roll () = R.get_random_int ~min:1 ~max:6
end

module type PlatformAdapter = sig
  module Random : RandomGeneratorType

  module WordList : sig
    type t

    val int_to_str : int -> string
    val get_word : t -> string -> string
    val load_list : unit -> t
  end
end

type t = string list
type separator = Char of string | Rand of string array

let make_separator ~randoms = function
  | str when str = "random" -> Rand randoms
  | str -> Char str

module MakeDicephrase (P : PlatformAdapter) = struct
  type wordlist = P.WordList.t

  let load_list = P.WordList.load_list
  let init = P.Random.init

  let join l1 l2 =
    let rec aux acc l1_rest l2_rest =
      match (l1_rest, l2_rest) with
      | hd1 :: tl1, hd2 :: tl2 -> aux (hd2 :: hd1 :: acc) tl1 tl2
      | hd1 :: _, [] -> List.rev (hd1 :: acc)
      | _, _ -> List.rev acc
    in
    aux [] l1 l2

  let make_wl_keys size =
    (* Generate a key by rolling 5 6-sided dice to get a key for 1 word in the wordlist *)
    let rand_key () =
      let rec aux = function
        | acc when String.length acc = 5 -> acc
        | acc ->
            let roll = P.Random.std_dice_roll () |> P.WordList.int_to_str in
            aux (roll ^ acc)
      in
      aux ""
    in
    let rec aux c acc =
      if c = 0 then acc else aux (c - 1) (rand_key () :: acc)
    in

    aux size []

  let repeat s c =
    let rec aux acc n = if n = 0 then acc else aux (s :: acc) (n - 1) in
    aux [] c

  let make_random_separators ~count ~separators =
    let max = Array.length separators in
    let rec aux acc i =
      if i = count then acc
      else
        let rand_separator_idx = P.Random.get_random_int ~min:0 ~max in
        let rand_separator = Array.get separators rand_separator_idx in
        aux (rand_separator :: acc) (i + 1)
    in
    aux [] 0

  let generate wl word_count sep keys : t =
    let get_from_wl = P.WordList.get_word wl in
    let words = keys |> Array.map get_from_wl |> Array.to_list in
    let separators =
      let separator_count = word_count - 1 in
      match sep with
      | Char x -> repeat x separator_count
      | Rand separators ->
          make_random_separators ~count:separator_count ~separators
    in
    let combined = join words separators in
    combined

  let to_string t = String.concat "" t
end

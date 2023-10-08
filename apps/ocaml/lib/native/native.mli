type t
type wordlist
type separator = [ `Char of string | `Rand of string array ]

val init : unit -> unit
val load_list : unit -> wordlist
val generate : wordlist -> int -> separator -> t
val to_string : t -> string

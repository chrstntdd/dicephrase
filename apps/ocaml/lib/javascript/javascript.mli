type wordlist

val init : unit -> unit
val make_separator : randoms:string array -> string -> Core.separator
val load_list : unit -> wordlist
val generate : wordlist -> int -> Core.separator -> Core.t
val to_string : Core.t -> string

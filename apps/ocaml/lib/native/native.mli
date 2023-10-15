type wordlist
type rng

val init : unit -> unit
val make_separator : randoms:string array -> string -> Core.separator
val load_list : unit -> wordlist
val generate : wordlist -> int -> Core.separator -> string array -> Core.t
val to_string : Core.t -> string
val make_wl_keys : rng:rng -> int -> string array
val make_rng : unit -> rng

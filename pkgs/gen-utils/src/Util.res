/* *************************************************************************** */
/* Bindings */
/* *************************************************************************** */
@scope("crypto") @val
external getRandomValues: Js.TypedArray2.Uint32Array.t => unit = "getRandomValues"

// Define `Array.fill`
@send external fill: (Js.Array2.t<'a>, 'a) => Js.Array2.t<'a> = "fill"

// Define `Array.from({length: int})``
type t_array_size = {length: int}
@scope("Array") @val
external array_from: t_array_size => Js.Array2.t<'a> = "from"

@val external parseInt: (string, int) => int = "parseInt"

@val external isNaN: int => bool = "isNaN"

type t_url_search = {get: (. string) => Js.null<string>}
@new external make_url_search: string => t_url_search = "URLSearchParams"

/* *************************************************************************** */
/* Helpers */
/* *************************************************************************** */

let str_to_int = s => {
  let nt = parseInt(s, 10)
  switch nt->isNaN {
  | false => Some(nt)
  | _ => None
  }
}

// Lighter Caml_option.nullable_to_opt
let nullable_to_option = n => {
  if Js.Null.empty != n {
    Js.Option.some(Js.Null.getUnsafe(n))
  } else {
    None
  }
}

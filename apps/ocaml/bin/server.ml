open Piaf
open Eio.Std

module ArgParser = struct
  type url_params = {
    word_count : int;
    separator : Core.separator;
    fmt : string;
  }

  let clamp ~min ~max x = if x < min then min else if x > max then max else x

  let detect qs key =
    match Uri.get_query_param qs key with
    | None -> Error (Printf.sprintf "Query parameter '%s' is missing" key)
    | Some value -> Ok value

  let to_reasonable_entropy x = Ok (clamp ~min:4 ~max:20 x)

  let to_int str =
    try Ok (int_of_string str) with Failure _ -> Error "is not an integer"

  let to_fmt str =
    if String.equal str "txt" then Ok str else Error "Format unsupported"

  let validate_separator ~randoms str = Ok (Core.make_separator ~randoms str)

  (* Custom operator to make chaining Results nicer *)
  let ( >>=? ) x f = match x with Error _ as e -> e | Ok v -> f v

  let parse_count read_param =
    read_param "c" >>=? to_int >>=? to_reasonable_entropy

  let parse_fmt read_param = read_param "fmt" >>=? to_fmt

  let parse_separator read_param =
    read_param "s"
    >>=? validate_separator ~randoms:[| "."; "-"; "~"; "*"; " " |]

  let parse_url_params query_string =
    let get_by_key = detect query_string in
    match
      (parse_count get_by_key, parse_separator get_by_key, parse_fmt get_by_key)
    with
    | Ok word_count, Ok separator, Ok fmt -> Ok { word_count; separator; fmt }
    (* Not great — swallows all the errors *)
    | _ -> Error "Invalid params"
end

let connection_handler ~wl ({ request; _ } : Request_info.t Server.ctx) =
  let url = Uri.of_string request.target in
  match (request, Uri.path url) with
  | { Request.meth = `GET; _ }, "/gen" -> (
      match ArgParser.parse_url_params url with
      | Error msg -> Response.of_string `Bad_request ~body:msg
      | Ok { word_count; separator; fmt = _fmt } ->
          let generated_dicephrase = Native.generate wl word_count separator in
          let body = generated_dicephrase |> Native.to_string in
          Response.of_string ~body `OK)
  | _ ->
      let headers = Headers.of_list [ ("connection", "close") ] in
      Response.of_string ~headers `Not_found ~body:""

let run ~sw ~host ~port env handler =
  let domains = Domain.recommended_domain_count () in
  let config =
    Server.Config.create ~buffer_size:0x1000 ~domains (`Tcp (host, port))
  in
  let server = Server.create ~config handler in
  let command = Server.Command.start ~sw env server in
  command

let start ~sw env =
  let host = Eio.Net.Ipaddr.V4.any in
  let _ = Native.init () in
  let wl = Native.load_list () in
  run ~sw ~host ~port:8080 env (connection_handler ~wl)

let setup_log ?style_renderer level =
  Logs_threaded.enable ();
  Fmt_tty.setup_std_outputs ?style_renderer ();
  Logs.set_level ~all:true level;
  Logs.set_reporter (Logs_fmt.reporter ())

let () =
  setup_log (Some Info);
  Eio_main.run (fun env ->
      Switch.run (fun sw ->
          let _command = start ~sw env in
          ()))

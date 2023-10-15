use actix_web::{get, http::KeepAlive, web, App, Either, HttpServer, Responder, Result};
use core_dicephrase::{combine_zip, make_separators, make_words, read_wl};
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

struct AppState {
    wl: HashMap<String, String>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let app = HttpServer::new(|| {
        let wl = read_wl().expect("Unable to read wordlist");
        let data = web::Data::new(AppState { wl });
        App::new().app_data(data).service(gen)
    })
    .keep_alive(KeepAlive::Os)
    .bind(("0.0.0.0", 8080))?
    .run();

    app.await
}

#[derive(Deserialize, Debug)]
enum OutputFmt {
    #[serde(rename = "txt")]
    Text,
    #[serde(rename = "parts")]
    Parts,
}

#[derive(Deserialize)]
struct DicephraseCfg {
    c: usize,
    s: Option<String>,
    fmt: OutputFmt,
}

#[derive(Serialize)]
struct PartsResp {
    words: Vec<String>,
    separators: Vec<String>,
}

#[get("/gen")]
async fn gen(
    cfg: web::Query<DicephraseCfg>,
    app_state: web::Data<AppState>,
) -> Either<Result<impl Responder>, Result<impl Responder>> {
    //  Limit to slightly over 256 bits of entropy
    let count = cfg.c.clamp(4, 20);
    let separators = make_separators(count, &cfg.s.as_deref().unwrap_or("🦀"));
    let words = make_words(count, &app_state.wl);

    match cfg.fmt {
        OutputFmt::Text => Either::Left(Ok(combine_zip(&words, &separators))),
        OutputFmt::Parts => Either::Right(Ok(web::Json(PartsResp { words, separators }))),
    }
}

use actix_web::{get, middleware, web, App, Either, HttpServer, Responder, Result};
use core_dicephrase::{make_full_phrase, make_separators, make_words, read_wl};
use dotenv::dotenv;
use serde::{Deserialize, Serialize};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let app = HttpServer::new(move || {
        App::new()
            .wrap(middleware::Compress::default())
            .service(gen)
    })
    .bind(("0.0.0.0", 8080))?
    .run();

    app.await
}

#[derive(Deserialize, Debug)]
enum OutputFmt {
    #[serde(rename = "text")]
    Text,
    #[serde(rename = "parts")]
    Parts,
}

#[derive(Deserialize)]
struct DicephraseCfg {
    count: usize,
    sep: String,
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
) -> Either<Result<impl Responder>, Result<impl Responder>> {
    let word_list = read_wl().expect("Unable to read wordlist");
    let separators = make_separators(cfg.count, &cfg.sep);
    let words = make_words(cfg.count, &word_list);

    match cfg.fmt {
        OutputFmt::Text => Either::Left(Ok(make_full_phrase(&words, &separators))),
        OutputFmt::Parts => Either::Right(Ok(web::Json(PartsResp { words, separators }))),
    }
}

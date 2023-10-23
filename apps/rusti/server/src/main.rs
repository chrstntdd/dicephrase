use actix_web::{
    body::BoxBody, get, http::header, http::KeepAlive, web, App, HttpRequest, HttpResponse,
    HttpServer, Responder, Result,
};
use core_dicephrase::{combine_zip, make_separators, make_words, read_wl, RandomBuffer};
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc};

struct AppState {
    wl: Arc<HashMap<[u8; 5], String>>,
    rand_buf: Arc<RandomBuffer>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let wl = Arc::new(read_wl().unwrap());
    let rand_buf = Arc::new(RandomBuffer::new());
    let app = HttpServer::new(move || {
        let data = web::Data::new(AppState {
            wl: wl.clone(),
            rand_buf: rand_buf.clone(),
        });
        App::new().app_data(data).service(gen)
    })
    .keep_alive(KeepAlive::Os)
    .bind(("0.0.0.0", 8080))?
    .run();

    app.await
}

fn default_separator() -> Option<String> {
    Some("🦀".to_string())
}

#[derive(Deserialize)]
struct DicephraseCfg {
    c: usize,
    #[serde(default = "default_separator")]
    s: Option<String>,
}

#[derive(Serialize)]
struct PartsResp {
    words: Vec<String>,
    separators: Vec<String>,
}

enum GenResponse {
    Html(String),
    Json(PartsResp),
}

impl Responder for GenResponse {
    type Body = BoxBody;
    fn respond_to(self, _: &HttpRequest) -> HttpResponse {
        match self {
            GenResponse::Html(html) => HttpResponse::Ok()
                .content_type("text/html; charset=utf-8")
                .body(html),
            GenResponse::Json(json) => HttpResponse::Ok().json(json),
        }
    }
}

const JSON_ACCEPT: &[u8; 16] = b"application/json";

#[get("/gen")]
async fn gen(
    req: HttpRequest,
    cfg: web::Query<DicephraseCfg>,
    app_state: web::Data<AppState>,
) -> Result<impl Responder> {
    //  Limit to slightly over 256 bits of entropy
    let count = cfg.c.clamp(4, 20);

    // Limit custom separators to 2 chars long
    let separator_chars: String = cfg.s.as_deref().unwrap().chars().take(2).collect();
    let separator_chars: &str = &separator_chars;

    let separators = make_separators(count, separator_chars);
    let words = make_words(count, &app_state.wl, &app_state.rand_buf);

    let resp = match req.headers().get(header::ACCEPT) {
        Some(header_value)
            if header_value
                .as_bytes()
                .windows(JSON_ACCEPT.len())
                .any(|window| window == JSON_ACCEPT) =>
        {
            GenResponse::Json(PartsResp { words, separators })
        }

        _ => {
            let v = combine_zip(&words, &separators);
            let html = "<code id=\"dicephrase\">".to_owned() + &v.to_owned() + "</code>";
            GenResponse::Html(html)
        }
    };

    Ok(resp)
}

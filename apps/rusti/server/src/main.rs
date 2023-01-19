use actix_web::{middleware, web, App, HttpServer, Responder};
use core_dicephrase::dicephrase;
use dotenv::dotenv;

async fn make_dicephrase() -> impl Responder {
    match dicephrase(11, "random".to_string()) {
        Ok((_, _, full)) => full,
        Err(x) => {
            println!("{}", x);
            "Whoops!".to_string()
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let app = HttpServer::new(move || {
        App::new()
            .wrap(middleware::Compress::default())
            .route("/gen", web::get().to(make_dicephrase))
    })
    .bind(("0.0.0.0", 8080))?
    .run();

    println!("Running");

    app.await
}

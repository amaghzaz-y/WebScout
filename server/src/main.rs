#![allow(unused)]
use axum::{extract::Path, routing::get, Router};
use tracing::{event, Level};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    event!(Level::INFO, "started server at http://0.0.0.0:3000");

    let app: Router = Router::new().route("/", get(|| async { "Hello, World!" }));

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

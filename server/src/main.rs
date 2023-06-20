#![allow(unused)]

use actix_web::{web, App, HttpServer};
use server::{api_count, api_index, api_search, hello, AppState};
use std::sync::{Arc, Mutex, RwLock};
use tracing::{event, Level};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let mut data = web::Data::new(AppState::new());
    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .service(hello)
            .service(api_index)
            .service(api_count)
            .service(api_search)
    })
    .bind(("127.0.0.1", 3000))?
    .run()
    .await
}

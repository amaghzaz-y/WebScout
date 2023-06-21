#![allow(unused)]
use actix_web::get;
use actix_web::post;
use actix_web::web;
use actix_web::HttpResponse;
use actix_web::Responder;
use serde::Deserialize;
use serde::Serialize;
use serde_json::{json, Value};
use std::collections::BTreeMap;
use std::collections::HashMap;
use std::sync::{Arc, Mutex, RwLock};
use tracing::{event, Level};
use webscout_core::index::{Document, Index, TextDocument};

#[get("/")]
pub async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}
#[post("/index")]
pub async fn api_index(json: web::Json<TextDocument>, data: web::Data<AppState>) -> impl Responder {
    let d = json.into_inner();
    let doc = data.index.lock().unwrap().index_text(&d);
    data.kv.lock().unwrap().put_document(&doc);
    HttpResponse::Ok().json(DocumentMeta {
        id: doc.id,
        title: doc.title,
        tokens: doc.token_count,
    })
}

#[get("/count")]
pub async fn api_count(data: web::Data<AppState>) -> impl Responder {
    let doc = data.index.lock().unwrap().document_count();
    format!("{}", doc)
}

#[derive(Deserialize)]
pub struct SearchQuery {
    query: String,
}
#[get("/search")]
pub async fn api_search(q: web::Query<SearchQuery>, data: web::Data<AppState>) -> impl Responder {
    let ids = data.index.lock().unwrap().relevant_documents(&q.query);
    let docs = data.kv.lock().unwrap().read_documents(&ids);
    let s = data.index.lock().unwrap().search_query(&q.query, &docs);
    HttpResponse::Accepted().json(s.len())
}

pub struct AppState {
    index: Mutex<Index>,
    kv: Mutex<KV>,
}

#[derive(Serialize, Deserialize)]
pub struct DocumentMeta {
    id: String,
    title: String,
    tokens: usize,
}
impl AppState {
    pub fn new() -> AppState {
        AppState {
            index: Mutex::new(Index::new()),
            kv: Mutex::new(KV::new()),
        }
    }
    // fn index_text(&mut self, document: &TextDocument) -> DocumentMeta {
    //     let doc = self.index.lock().unwrap().index_text(&document);
    //     self.kv.lock().unwrap().put_document(&doc);
    //     DocumentMeta {
    //         id: doc.id,
    //         title: doc.title,
    //         tokens: doc.token_count,
    //     }
    // }

    fn search_text(&mut self, query: &String) -> BTreeMap<(String, String), f32> {
        let doc_ids = self.index.lock().unwrap().relevant_documents(&query);
        let docs = self.kv.lock().unwrap().read_documents(&doc_ids);
        let s = self.index.lock().unwrap().search_query(&query, &docs);
        let mut map: BTreeMap<(String, String), f32> = BTreeMap::new();
        for doc in docs {
            map.insert((doc.id.clone(), doc.title.clone()), s[&doc.id]);
        }
        map
    }

    fn save_index(&self) {
        self.kv
            .lock()
            .unwrap()
            .put_index(&self.index.lock().unwrap());
    }
}

pub struct KV {
    db: sled::Db,
}

impl KV {
    pub fn new() -> KV {
        KV {
            db: sled::open("ws.db").unwrap(),
        }
    }
    pub fn read_documents(&self, document_ids: &Vec<String>) -> Vec<Document> {
        let mut docs: Vec<Document> = Vec::new();
        for id in document_ids {
            let bytes = self.db.get(id).unwrap().unwrap().to_vec();
            docs.push(Document::deserialize(bytes));
        }
        return docs;
    }

    pub fn read_index(&self, index_id: &str) -> Index {
        let bytes = self.db.get(index_id).unwrap().unwrap().to_vec();
        Index::deserialize(bytes)
    }

    pub fn put_document(&self, document: &Document) {
        let bytes = document.serialize();
        self.db.insert(document.id.clone(), bytes).unwrap();
    }

    pub fn put_index(&self, index: &Index) {
        let bytes = index.serialize();
        self.db.insert(index.id(), bytes).unwrap();
    }
}

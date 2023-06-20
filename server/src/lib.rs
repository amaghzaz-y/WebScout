#![allow(unused)]
use axum::extract::{Json, Path, Query};
use serde_json::{json, Value};
use std::collections::BTreeMap;
use std::collections::HashMap;
use tracing::{event, Level};
use webscout_core::index::{Document, Index, TextDocument};

struct App {
    index: Index,
    kv: KV,
}

impl App {
    fn new() -> App {
        App {
            index: Index::new(),
            kv: KV::new(),
        }
    }
    fn index_text(&mut self, document: TextDocument) {
        self.index.index_text(&document);
    }

    fn search_text(&mut self, query: String) -> BTreeMap<(String, String), f32> {
        let doc_ids = self.index.relevant_documents(&query);
        let docs = self.kv.read_documents(&doc_ids);
        let s = self.index.search_query(&query, &docs);
        let mut map: BTreeMap<(String, String), f32> = BTreeMap::new();
        for doc in docs {
            map.insert((doc.id.clone(), doc.title.clone()), s[&doc.id]);
        }
        map
    }

    fn save_document(&mut self, document: Document) {
        self.kv.put_document(&document);
    }

    fn save_index(&self) {
        self.kv.put_index(&self.index);
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
        self.db.insert(index.id.clone(), bytes).unwrap();
    }
}

pub struct Api {
    app: App,
}

impl Api {
    fn new() -> Api {
        Api { app: App::new() }
    }

    pub async fn index() {
		
	}
}

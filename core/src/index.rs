use alloc::borrow::ToOwned;
use alloc::collections::BTreeMap;
use alloc::string::{String, ToString};
use alloc::vec::Vec;
use bloomfilter::Bloom;
use nanoid::nanoid;
use serde::{Deserialize, Serialize};

use crate::parser::{self, FrequencyStats};
use crate::query::Query;

#[derive(Serialize, Deserialize, Clone)]
pub struct Index {
    id: String,
    filters: Vec<Filter>,
    token_count: usize,
    document_count: usize,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Document {
    pub id: String,
    pub title: String,
    pub url: String,
    pub metadata: String,
    pub index: BTreeMap<String, FrequencyStats>,
    pub token_count: usize,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Filter {
    pub id: String,
    pub filter: Bloom<String>,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct TextDocument {
    pub title: String,
    pub url: Option<String>,
    pub metadata: Option<String>,
    pub text: String,
}

impl Index {
    pub fn new() -> Index {
        Index {
            id: nanoid!(),
            filters: Vec::new(),
            token_count: 0,
            document_count: 0,
        }
    }

    pub fn index_text(&mut self, doc: &TextDocument) -> Document {
        // indexing + getting info
        let mut parser = parser::Parser::new();
        let stems = parser.parse_text(&doc.text);
        let index = parser.normalize(&stems);
        let filter = parser.get_filter();
        let id = nanoid!();
        // update indexer struct
        self.filters.push(Filter {
            id: id.clone(),
            filter,
        });
        self.document_count += 1;
        self.token_count += index.len();
        // return result
        Document {
            id,
            title: doc.title.to_string(),
            url: doc
                .url
                .to_owned()
                .unwrap_or("resource undefined".to_string()),
            metadata: doc
                .metadata
                .to_owned()
                .unwrap_or("metadata undefined".to_string()),
            token_count: index.len(),
            index,
        }
    }

    pub fn relevant_documents(&self, text: &str) -> Vec<String> {
        let query = Query::new(text);
        query.filter_query(&self.filters)
    }

    pub fn search_query(&mut self, text: &str, doc: &Vec<Document>) -> BTreeMap<String, f32> {
        let mut query = Query::new(text);
        for doc in doc {
            query.search_document(doc);
        }
        query.results()
    }

    pub fn serialize(&self) -> Vec<u8> {
        rmp_serde::to_vec(&self).unwrap()
    }

    pub fn deserialize(bytes: Vec<u8>) -> Index {
        rmp_serde::from_slice(&bytes).unwrap()
    }
    pub fn id(&self) -> String {
        self.id.to_owned()
    }

    pub fn token_count(&self) -> usize {
        self.token_count.to_owned()
    }

    pub fn document_count(&self) -> usize {
        self.document_count.to_owned()
    }

    pub fn filters(&self) -> Vec<Filter> {
        self.filters.clone()
    }
}

impl Document {
    pub fn new() -> Document {
        Document {
            id: nanoid!(),
            title: String::new(),
            url: String::new(),
            metadata: String::new(),
            index: BTreeMap::new(),
            token_count: 0,
        }
    }
    pub fn serialize(&self) -> Vec<u8> {
        rmp_serde::to_vec(&self).unwrap()
    }

    pub fn deserialize(bytes: Vec<u8>) -> Document {
        rmp_serde::from_slice(&bytes).unwrap()
    }
}

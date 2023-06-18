#![allow(unused)]

use alloc::borrow::ToOwned;
use alloc::collections::BTreeMap;
use alloc::string::{String, ToString};
use alloc::vec::Vec;
use hashbrown::HashMap;
use nanoid::nanoid;

use crate::parser::{self, FrequencyStats, Token};
pub struct Indexer {
    id: String,
    filters: Vec<Filter>,
    token_count: usize,
    document_count: usize,
}

pub struct Document {
    pub id: String,
    pub title: String,
    pub resource: String,
    pub metadata: String,
    pub index: BTreeMap<String, FrequencyStats>,
    pub token_count: usize,
}
pub struct Filter {
    pub id: String,
    pub filter: Vec<u8>,
}
#[derive(Clone)]
pub struct TextDocument {
    pub title: String,
    pub resource: Option<String>,
    pub metadata: Option<String>,
    pub text: String,
}

impl Indexer {
    pub fn new() -> Indexer {
        Indexer {
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
            id: id.to_owned(),
            filter: filter,
        });
        self.document_count += 1;
        self.token_count += index.len();
        // return result
        Document {
            id: id,
            title: doc.title.to_string(),
            resource: doc
                .resource
                .to_owned()
                .unwrap_or("resource undefined".to_string()),
            metadata: doc
                .metadata
                .to_owned()
                .unwrap_or("metadata undefined".to_string()),
            token_count: index.len(),
            index: index,
        }
    }
}

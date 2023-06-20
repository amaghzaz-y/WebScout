#![allow(unused)]

use alloc::borrow::ToOwned;
use alloc::collections::BTreeMap;
use alloc::rc::Rc;
use alloc::string::{String, ToString};
use alloc::sync::Arc;
use alloc::vec::Vec;
use bloomfilter::Bloom;
use hashbrown::HashMap;
use nanoid::nanoid;
use serde::{Deserialize, Serialize};

use crate::parser::{self, FrequencyStats, Token};
use crate::query::Query;

#[derive(Serialize, Deserialize)]
pub struct Index {
    id: String,
    filters: Vec<Filter>,
    token_count: usize,
    document_count: usize,
}

#[derive(Serialize, Deserialize)]
pub struct Document {
    pub id: String,
    pub title: String,
    pub resource: String,
    pub metadata: String,
    pub index: BTreeMap<String, FrequencyStats>,
    pub token_count: usize,
}

#[derive(Serialize, Deserialize)]
pub struct Filter {
    pub id: String,
    pub filter: Bloom<String>,
}

#[derive(Clone)]
pub struct TextDocument {
    pub title: String,
    pub resource: Option<String>,
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
            resource: doc
                .resource
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
        let mut query = Query::new(text);
        query.filter_query(&self.filters)
    }

    pub fn search_query(&mut self, text: &str, doc: &Vec<Document>) -> Vec<(String, f32)> {
        let mut query = Query::new(text);
        for doc in doc {
            query.search_document(doc);
        }
        query.results()
    }
}

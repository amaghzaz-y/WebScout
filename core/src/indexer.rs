#![allow(unused)]
use alloc::borrow::ToOwned;
use alloc::collections::BTreeMap;
use alloc::string::{String, ToString};
use alloc::vec::Vec;

use crate::parser::{self, Token};
pub struct Indexer {
    // key: Token , value: collection
    collections: BTreeMap<String, Collection>,
    //key: Resource Title, value: metadata
    metadata: BTreeMap<String, String>,
}

// a record consists of a resource title which is the origin of the token,
// frequency and mean posistion of the same token
#[derive(Clone)]
pub struct Record {
    pub resource: String,
    pub frequency: usize,
    pub mean: usize,
}

// a collection consists of a value which is the token and records
#[derive(Clone)]
pub struct Collection {
    pub token: String,
    pub records: Vec<Record>,
}

impl Indexer {
    pub fn new() -> Indexer {
        Indexer {
            collections: BTreeMap::new(),
            metadata: BTreeMap::new(),
        }
    }
    // title should be unique as its acting as an ID
    pub fn index_text(&mut self, title: &str, text: &str, metadata: Option<&str>) {
        let mut parser = parser::Parser::new();
        let stems = parser.parse_text(text);
        let tokens = parser.normalize(stems);
        self.collect(title, &tokens);
        self.insert_metadata(title, metadata.unwrap_or("no metadata"));
    }
    // collects the tokens
    pub fn collect(&mut self, resource: &str, tokens: &Vec<Token>) {
        for token in tokens {
            self.collections
                .entry(token.value.to_string())
                .or_insert(Collection {
                    token: token.value.to_string(),
                    records: Vec::from([Record {
                        resource: resource.to_string(),
                        frequency: token.frequency,
                        mean: token.mean_position,
                    }]),
                });
        }
    }

    pub fn import_collections(&mut self, collections: &mut Vec<Collection>) {
        for collection in collections {
            self.collections
                .entry(collection.token.to_owned())
                .or_insert(collection.to_owned());
        }
    }

    pub fn export_collections(&self) -> Vec<Collection> {
        self.collections
            .iter()
            .map(|(v, c)| (c.to_owned()))
            .collect()
    }

    pub fn insert_metadata(&mut self, title: &str, metadata: &str) {
        self.metadata.insert(title.to_owned(), metadata.to_owned());
    }
}

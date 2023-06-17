#![allow(unused)]
use alloc::borrow::ToOwned;
use alloc::collections::BTreeMap;
use alloc::string::{String, ToString};
use alloc::vec::Vec;

use crate::parser::Token;
pub struct Indexer {
    // key: Token , value: collection
    indices: BTreeMap<String, Collection>,
    metadata: BTreeMap<String, String>,
}

// a record consists of a resource title which is the origin of the token,
// frequency and mean posistion of the same token
struct Record {
    resource: String,
    frequency: usize,
    mean: usize,
}

// a collection consists of a value which is the token and records
pub struct Collection {
    value: String,
    records: Vec<Record>,
}

impl Indexer {
    // title should be unique as its acting an ID
    pub fn index(title: &str, text: &str, metadata: Option<&str>) {
        todo!();
    }

    pub fn collect(&mut self, resource: &str, tokens: &mut Vec<Token>) {
        for token in tokens {
            self.indices
                .entry(token.value.to_string())
                .or_insert(Collection {
                    value: token.value.to_string(),
                    records: Vec::from([Record {
                        resource: resource.to_string(),
                        frequency: token.frequency,
                        mean: token.mean_position,
                    }]),
                })
                .records
                .push(Record {
                    resource: resource.to_string(),
                    frequency: token.frequency,
                    mean: token.mean_position,
                })
        }
    }
    
    pub fn insert_metadata(&mut self, title: &str, metadata: &str) {
        self.metadata.insert(title.to_owned(), metadata.to_owned());
    }
}

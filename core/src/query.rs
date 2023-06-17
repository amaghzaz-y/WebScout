use alloc::{format, string::String, vec::Vec};

use crate::{indexer::Collection, parser::Stem};

pub struct Query {}

impl Query {
    pub fn new() -> Query {
        Query {}
    }

    pub fn upsert_collections(&self, cols: &Vec<Collection>) -> String {
        let mut tokens: String = String::from("");
        let mut records: String = String::from("");
        for c in cols {
            tokens.push_str(&format!("('{}'),", c.token));
            for r in &c.records {
                records.push_str(&format!(
                    "('{}', '{}', {}, {}),",
                    c.token, r.resource, r.frequency, r.mean
                ))
            }
        }
        tokens.pop();
        records.pop();
        format!(
            "INSERT OR IGNORE INTO collection (token)
			VALUES {};
			INSERT INTO record (collection_token, resource, frequency, mean)
			VALUES {};",
            tokens, records
        )
    }

    pub fn get_collections(&self, stems: &Vec<Stem>) -> String {
        let mut tokens: String = String::from("");
        for stem in stems {
            tokens.push_str(&format!("'{}',", stem.value()));
        }
        tokens.pop();
        format!(
            "SELECT * FROM record WHERE collection_token IN ({tokens});",
            tokens = tokens
        )
    }
}

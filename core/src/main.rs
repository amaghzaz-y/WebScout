#![allow(unused)]

use webscout::{
    indexer::Indexer,
    parser,
    query::{self, Query},
};

fn main() {
    let query = Query::new();
    let text = "representing a different record associated with a collection. The collection token, resource, frequency, and mean values are specified within the VALUES clause, allowing you to insert multiple records efficiently.";
    let mut indexer = Indexer::new();
    indexer.index_text("fuck off", text, None);
    let col = indexer.export_collections();
    let s = query.upsert_collections(&col);
    println!("{}", s);
}

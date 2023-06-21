#![allow(unused)]

use webscout_core::index::{Index, TextDocument};
use webscout_core::query::Query;
static TEXT_EN: &str = "I would suggest to do a side project in Rust first 
before jump right in (Some caveat is came from cf limitation 
in Rust, but it will worth it in the long run 
especially you can share logic/struct anywhere as wasm via npm).
Here's my proof that's Rust is easy to learn ";
static TEXT_FR: &str = "Le terme charcuterie désigne couramment de nombreuses préparations
alimentaires à base de viande et d'abats, crues ou cuites. 
Elles proviennent majoritairement,
mais pas exclusivement, du porc, dont presque toutes les 
parties peuvent être utilisées, 
et ont souvent le sel comme agent de conservation
(salage à sec ou par saumurage).";

fn main() {
    let mut idx = Index::new();
    let en_doc = TextDocument {
        title: "Why Rust is better ?".to_owned(),
        resource: None,
        metadata: None,
        text: TEXT_EN.to_owned(),
    };
    let fr_doc = TextDocument {
        title: "La charcuterie".to_owned(),
        resource: None,
        metadata: None,
        text: TEXT_FR.to_owned(),
    };
    let en_doc = idx.index_text(&en_doc);
    let fr_doc = idx.index_text(&fr_doc);
    let mut q1 = Query::new("Rust Viande");
    let r1 = q1.filter_query(&idx.filters());
    println!("{:?}", en_doc.id);
    println!("{:?}", r1);
}

#![allow(dead_code)]
extern crate rust_stemmers;
use webscout::parser;
fn main() {
    let tokens = parser::parse_text("your and i are flying tonight baby i love you");
    println!("{:?}", tokens)
}

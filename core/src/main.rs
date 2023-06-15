#![allow(dead_code)]
extern crate rust_stemmers;
use webscout::parser::Parser;
fn main() {
    let tokens = Parser::parse_text("hello from most worlds");
    println!("{:?}", tokens)
}

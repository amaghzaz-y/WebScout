#![allow(dead_code)]
extern crate rust_stemmers;
use webscout::parser::Parser;
fn main() {
    let tokens = Parser::parse_text("How can I effectively share JavaScript user inputs with a Bevy system via WASM so I can dynamically alter the game based on these inputs?");
    println!("{:?}", tokens)
}

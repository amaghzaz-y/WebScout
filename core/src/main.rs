#![allow(dead_code)]
extern crate rust_stemmers;
use webscout::stopwords::is_stopword;
fn main() {
    let status = is_stopword(&whatlang::Lang::Eng, "fly");
    println!("{:?}", status)
}

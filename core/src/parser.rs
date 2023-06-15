use alloc::{string::String, vec::Vec};

use crate::Stemmer::Stemmer;

pub struct Token {
    pub token: String,
    pub position: usize,
}
pub struct Parser {}
impl Parser {
    pub fn parse_text(&self, text: String) -> Vec<Token> {
        let mut tokens: Vec<Token> = Vec::new();
        let mut stemmer = Stemmer::new();
        stemmer.detect_lang(&text);
        let re = regex::Regex::new(r"[\w--[[:punct:]]]+").unwrap();
        for (pos, mat) in re.find_iter(&text).enumerate() {
            tokens.push(Token {
                token: stemmer.stem(mat.as_str()),
                position: pos,
            })
        }
        tokens
    }
}

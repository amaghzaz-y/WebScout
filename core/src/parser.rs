use alloc::{
    string::String,
    vec::{self, Vec},
};

use crate::tokenizer::{self, Tokenizer};

struct Token {
    token: String,
    position: usize,
}
pub struct Parser {
    tokens: Vec<Token>,
}
impl Parser {
    pub fn new() -> Parser {
        Parser { tokens: Vec::new() }
    }
    pub fn parse_text(&mut self, text: String) {
        //"[\w--[[:punct:]]]+"g
        let mut tokenizer = Tokenizer::new();
        tokenizer.detect_lang(&text);
        let re = regex::Regex::new(r"[\w--[[:punct:]]]+").unwrap();
        for (pos, mat) in re.find_iter(&text).enumerate() {
            self.tokens.push(Token {
                token: tokenizer.tokenize(mat.as_str()),
                position: pos,
            })
        }
    }
}

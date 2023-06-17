use crate::utils::mean;
use crate::{stemmer::Stemmer, stopwords::is_stopword};
use alloc::collections::BTreeMap;
use alloc::{string::String, vec::Vec};

#[derive(Debug)]
pub struct Stem {
    stem: String,
    position: usize,
}

pub struct Token {
    pub value: String,
    pub frequency: usize,
    pub mean_position: usize,
}
pub struct Parser {}
impl Parser {
    // parses text, stems the words, removes stopwords
    pub fn parse_text(text: &str) -> Vec<Stem> {
        let mut stems: Vec<Stem> = Vec::new();
        let mut stemmer = Stemmer::new();
        let lang = stemmer.detect_lang(text);
        let re = regex::Regex::new(r"[\w--[[:punct:]]]+").unwrap();
        for (pos, mat) in re.find_iter(text).enumerate() {
            let token = mat.as_str();
            if !is_stopword(&lang, token) {
                stems.push(Stem {
                    stem: stemmer.stem(mat.as_str()),
                    position: pos,
                })
            }
        }
        stems
    }
    // calculates mean average position and frequency for each token
    pub fn normalize(stems: Vec<Stem>) -> Vec<Token> {
        let mut frequency_map: BTreeMap<String, Vec<usize>> = BTreeMap::new();

        for stem in stems {
            frequency_map
                .entry(stem.stem)
                .or_insert_with(Vec::new)
                .push(stem.position);
        }

        frequency_map
            .into_iter()
            .map(|(value, positions)| {
                let freq = positions.len();
                let mean = mean(&positions);
                Token {
                    value,
                    frequency: freq,
                    mean_position: mean,
                }
            })
            .collect()
    }
}

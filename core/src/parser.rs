use crate::stemmer::Stemmer;
use crate::utils::mean;
use alloc::collections::BTreeMap;
use alloc::string::ToString;
use alloc::{string::String, vec::Vec};

#[derive(Debug)]
pub struct Stem {
    value: String,
    position: usize,
}
impl Stem {
    pub fn value(&self) -> String {
        self.value.to_string()
    }
}
pub struct Token {
    pub value: String,
    pub frequency: usize,
    pub mean_position: usize,
}

// parses text, stems the words, removes stopwords
pub fn parse_text(text: &str) -> Vec<Stem> {
    let mut stems: Vec<Stem> = Vec::new();
    let mut stemmer = Stemmer::new();
    stemmer.detect_lang(text);
    let re = regex::Regex::new(r"[\w--[[:punct:]]]+").unwrap();
    for (pos, mat) in re.find_iter(text).enumerate() {
        stems.push(Stem {
            value: stemmer.stem(mat.as_str()),
            position: pos,
        })
    }
    stems
}
// calculates mean average position and frequency for each token
pub fn normalize(stems: Vec<Stem>) -> Vec<Token> {
    // a map where the key is the token value, and the value is the a vector of its positions
    let mut frequency_map: BTreeMap<String, Vec<usize>> = BTreeMap::new();
    // construct the frequency map
    for stem in stems {
        frequency_map
            .entry(stem.value)
            .or_insert_with(Vec::new)
            .push(stem.position);
    }
    // calculates the mean and frequency for each token and collects it as a vector
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

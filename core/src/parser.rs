use crate::stemmer::Stemmer;
use crate::utils;
use alloc::borrow::ToOwned;
use alloc::collections::BTreeMap;
use alloc::string::ToString;
use alloc::{string::String, vec::Vec};
use bloomfilter::Bloom;
use hashbrown::HashMap;

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

pub struct FrequencyStats {
    pub frequency: usize,
    pub mean_position: usize,
}
pub struct Parser {
    bloom_filter: Bloom<String>,
}

impl Parser {
    pub fn new() -> Parser {
        Parser {
            bloom_filter: Bloom::new_for_fp_rate(1000000, 0.1),
        }
    }
    // parses text, stems the words, removes stopwords
    pub fn parse_text(&mut self, text: &str) -> Vec<Stem> {
        let mut stems: Vec<Stem> = Vec::new();
        let mut stemmer = Stemmer::new();
        stemmer.detect_lang(text);
        let re = regex::Regex::new(r"[\w--[[:punct:]]]+").unwrap();
        for (pos, mat) in re.find_iter(text).enumerate() {
            let stem = stemmer.stem(mat.as_str());
            self.bloom_filter.check_and_set(&stem);
            stems.push(Stem {
                value: stem,
                position: pos,
            })
        }
        stems
    }
    // calculates mean average position and frequency for each token
    pub fn normalize(&self, stems: &Vec<Stem>) -> BTreeMap<String, FrequencyStats> {
        // a map where the key is the token value, and the value is the a vector of its positions
        let mut frequency_map: BTreeMap<String, Vec<usize>> = BTreeMap::new();
        // construct the frequency map
        for stem in stems {
            frequency_map
                .entry(stem.value.to_string())
                .or_insert_with(Vec::new)
                .push(stem.position);
        }
        // calculates the mean and frequency for each token and collects it in a HashMap
        frequency_map
            .into_iter()
            .map(|(value, positions)| {
                let freq = positions.len();
                let mean = utils::mean(&positions);
                (
                    value,
                    FrequencyStats {
                        frequency: freq,
                        mean_position: mean,
                    },
                )
            })
            .collect()
    }

    pub fn get_filter(&self) -> Vec<u8> {
        self.bloom_filter.bitmap()
    }
}

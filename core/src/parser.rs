use crate::stemmer::Stemmer;
use crate::stopwords::is_stopword;
use crate::utils;
use alloc::borrow::ToOwned;
use alloc::collections::BTreeMap;
use alloc::rc::{self, Rc};
use alloc::string::ToString;
use alloc::{string::String, vec::Vec};
use bloomfilter::Bloom;
use hashbrown::HashMap;
use serde::{Deserialize, Serialize};
use whatlang::Lang;

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord)]
pub struct Stem {
    pub value: String,
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
#[derive(Serialize, Deserialize)]
pub struct FrequencyStats {
    pub frequency: usize,
    pub mean_position: usize,
}
pub struct Parser {
    bloom_filter: Option<Bloom<String>>,
    language: Lang,
}

impl Parser {
    pub fn new() -> Parser {
        Parser {
            bloom_filter: None,
            language: Lang::Eng,
        }
    }
    //Bloom::new_for_fp_rate(1000000, 0.1)
    // parses text, stems the words, removes stopwords
    pub fn parse_text(&mut self, text: &str) -> Vec<Stem> {
        let mut stems: Vec<Stem> = Vec::new();
        let mut stemmer = Stemmer::new();
        self.language = stemmer.detect_lang(text);
        let mut bloom_filter: Bloom<String> = Bloom::new_for_fp_rate(1000000, 0.1);
        let re = regex::Regex::new(r"[\w--[[:punct:]]]+").unwrap();
        for (pos, mat) in re.find_iter(text).enumerate() {
            // filter stopwords
            if !is_stopword(&self.language, mat.as_str()) {
                let stem = stemmer.stem(mat.as_str());
                bloom_filter.check_and_set(&stem.to_owned());
                stems.push(Stem {
                    value: stem,
                    position: pos,
                })
            }
        }
        // optimization shortcut, cuz i'm lazy :)
        self.bloom_filter = Some(bloom_filter);
        stems
    }

    pub fn parse_query(&mut self, query: &str) -> Vec<String> {
        let mut stems: Vec<String> = Vec::new();
        let mut stemmer = Stemmer::new();
        self.language = stemmer.detect_lang(query);
        let re = regex::Regex::new(r"[\w--[[:punct:]]]+").unwrap();
        for mat in re.find_iter(query) {
            if !is_stopword(&self.language, mat.as_str()) {
                let stem = stemmer.stem(mat.as_str());
                stems.push(stem.into())
            }
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
                .entry(stem.value.clone())
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

    pub fn get_filter(&self) -> Bloom<String> {
        self.bloom_filter
            .to_owned()
            .unwrap_or(Bloom::new_for_fp_rate(1000000, 0.1))
    }
    pub fn get_language(&self) -> Lang {
        self.language.to_owned()
    }
}

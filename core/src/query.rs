use alloc::{
    borrow::ToOwned,
    collections::BTreeMap,
    string::String,
    vec::{self, Vec},
};
use bloomfilter::Bloom;
use whatlang::Lang;

use crate::{
    index::{Document, Filter},
    parser::{FrequencyStats, Parser, Stem, Token},
    utils::standard_deviation,
};

pub struct Query {
    language: Lang,
    query: Vec<String>,
    search: BTreeMap<String, Vec<Token>>,
    deviation_map: BTreeMap<String, f32>,
    max_freq_map: BTreeMap<String, usize>,
}

impl Query {
    pub fn new(query: &str) -> Query {
        let mut parser = Parser::new();
        let mut tokens = parser.parse_query(query);
        tokens.sort();
        tokens.dedup();
        Query {
            language: parser.get_language(),
            query: tokens,
            search: BTreeMap::new(),
            deviation_map: BTreeMap::new(),
            max_freq_map: BTreeMap::new(),
        }
    }

    // checks the bloom filter of each document and returns the top 10 most relevant ones
    pub fn filter_query(&self, filters: &Vec<Filter>) -> Vec<String> {
        let mut freq_map: BTreeMap<String, usize> = BTreeMap::new();
        for token in &self.query {
            for filter in filters {
                if filter.filter.check(&token.to_owned().into()) {
                    freq_map.entry(filter.id.to_owned()).and_modify(|x| *x += 1);
                }
            }
        }

        let mut score_vec: Vec<(String, usize)> = freq_map.into_iter().collect();

        score_vec.sort_by(|(_, a_score), (_, b_score)| b_score.cmp(a_score));

        let result_len = score_vec.len().min(10);
        let result: Vec<String> = score_vec[..result_len]
            .iter()
            .map(|(x, _)| x.to_owned())
            .collect();
        result
    }

    // search individual document and merges it into the search collection
    pub fn search_document(&mut self, doc: &Document) {
        let mut stats: Vec<Token> = Vec::new();
        for token in &self.query {
            match doc.index.get_key_value(token) {
                Some((value, stat)) => stats.push(Token {
                    value: value.to_owned(),
                    frequency: stat.frequency.to_owned(),
                    mean_position: stat.mean_position.to_owned(),
                }),
                None => continue,
            }
        }
        self.search.insert(doc.id.clone(), stats);
    }
    // normalizes the search collection
    fn normalize(&mut self) {
        for (doc_id, stats) in &self.search {
            let mut means = Vec::with_capacity(stats.len());
            for stat in stats {
                means.push(stat.mean_position as f32);
                *self.max_freq_map.entry(stat.value.clone()).or_insert(0) += stat.frequency;
            }
            let deviation = standard_deviation(&means);
            self.deviation_map.insert(doc_id.clone(), deviation);
        }
    }
    // computes the scores for each document, returns the scores sorted
    pub fn results(&mut self) -> Vec<(String, f32)> {
        self.normalize();
        let mut scores: Vec<(String, f32)> = Vec::new();
        for (doc_id, stats) in &self.search {
            let mut freq_ratio = 0.0;
            // ratio of query terms found in the document to the total number of terms
            let query_ratio = stats.len() as f32 / self.query.len() as f32;
            // proximity of the term in the document
            let deviation: f32 = self.deviation_map[doc_id].clone();
            for stat in stats {
                freq_ratio += (stat.frequency) as f32 / (self.max_freq_map[&stat.value]) as f32;
            }
            let score = (query_ratio * 5.0 + freq_ratio * 3.0 + (1.0 / deviation) * 2.0) / 10.0;
            scores.push((doc_id.clone(), score));
        }
        scores.sort_by(|(_, a_score), (_, b_score)| b_score.partial_cmp(&a_score).unwrap());
        scores
    }
}

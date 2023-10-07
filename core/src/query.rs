use alloc::{borrow::ToOwned, collections::BTreeMap, string::String, vec::Vec};

use crate::{
    index::{Document, Filter},
    parser::{Parser, Token},
    utils::standard_deviation,
};

#[derive(Clone, Debug)]
pub struct Query {
    query: Vec<String>, // relevant stemmed tokens
    search: BTreeMap<String, Vec<Token>>,
    deviation_map: BTreeMap<String, f32>,
    max_freq_map: BTreeMap<String, usize>, // max freq for each token
}

impl Query {
    pub fn new(query: &str) -> Query {
        let mut parser = Parser::new();
        let mut tokens = parser.parse_query(query);
        tokens.sort();
        tokens.dedup();
        Query {
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
                if filter.filter.check(&token) {
                    freq_map
                        .entry(filter.id.to_owned())
                        .and_modify(|x| *x += 1)
                        .or_insert(1);
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
    pub fn results(&mut self) -> BTreeMap<String, f32> {
        self.normalize();
        let mut scores: BTreeMap<String, f32> = BTreeMap::new();
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
            scores.insert(doc_id.clone(), score);
        }
        scores
    }
}

#[allow(unused)]
#[cfg(test)]
mod tests {
    use crate::index::{Index, TextDocument};

    use super::*;
    static TEXT_EN: &str = "I would suggest to do a side project in Rust first 
                        before jump right in (Some caveat is came from cf limitation 
                        in Rust, but it will worth it in the long run 
                        especially you can share logic/struct anywhere as wasm via npm).
                        Here's my proof that's Rust is easy to learn ";
    static TEXT_FR: &str = "Le terme charcuterie désigne couramment de nombreuses préparations
                        alimentaires à base de viande et d'abats, crues ou cuites. 
                        Elles proviennent majoritairement,
                        mais pas exclusivement, du porc, dont presque toutes les 
                        parties peuvent être utilisées, 
                        et ont souvent le sel comme agent de conservation
                        (salage à sec ou par saumurage).";

    #[test]
    fn filter_query_en() {
        let mut idx = Index::new();
        let en_doc = TextDocument {
            title: "Why Rust is better ?".to_owned(),
            url: None,
            metadata: None,
            text: TEXT_EN.to_owned(),
        };
        let fr_doc = TextDocument {
            title: "La charcuterie".to_owned(),
            url: None,
            metadata: None,
            text: TEXT_FR.to_owned(),
        };
        idx.index_text(&en_doc);
        idx.index_text(&fr_doc);
        let mut q = Query::new("I Rust First");
        let r = q.filter_query(&idx.filters());
        assert_eq!(1, r.len());
    }
    #[test]
    fn filter_query_fr() {
        let mut idx = Index::new();
        let en_doc = TextDocument {
            title: "Why Rust is better ?".to_owned(),
            url: None,
            metadata: None,
            text: TEXT_EN.to_owned(),
        };
        let fr_doc = TextDocument {
            title: "La charcuterie".to_owned(),
            url: None,
            metadata: None,
            text: TEXT_FR.to_owned(),
        };
        let en_doc = idx.index_text(&en_doc);
        let fr_doc = idx.index_text(&fr_doc);
        let mut q = Query::new("Viande du porc");
        let r = q.filter_query(&idx.filters());
        assert_eq!(1, r.len());
    }

    #[test]
    fn filter_query_en_fr() {
        let mut idx = Index::new();
        let en_doc = TextDocument {
            title: "Why Rust is better ?".to_owned(),
            url: None,
            metadata: None,
            text: TEXT_EN.to_owned(),
        };
        let fr_doc = TextDocument {
            title: "La charcuterie".to_owned(),
            url: None,
            metadata: None,
            text: TEXT_FR.to_owned(),
        };
        let en_doc = idx.index_text(&en_doc);
        let fr_doc = idx.index_text(&fr_doc);
        let mut q = Query::new("Viande du porc, et Rust is the best");
        let r = q.filter_query(&idx.filters());
        assert_eq!(2, r.len());
    }
}

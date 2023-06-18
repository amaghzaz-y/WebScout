use alloc::{borrow::ToOwned, collections::BTreeMap, string::String, vec::Vec};
use bloomfilter::Bloom;
use whatlang::Lang;

use crate::{
    indexer::Filter,
    parser::{Parser, Stem},
};

pub struct Query {
    language: Lang,
    query: Vec<String>,
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
        }
    }

    // checks the bloom filter of each document and returns the top 10 most relevant ones
    pub fn filter_query(&self, query: &str, filters: &Vec<Filter>) -> Vec<String> {
        let mut freq_map: BTreeMap<String, usize> = BTreeMap::new();

        for token in &self.query {
            for filter in filters {
                if filter.filter.check(&token) {
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
}

//     fn score(
//         &self,
//         tokens: Vec<String>,
//         map: &HashMap<u32, Vec<(String, Weight)>>,
//     ) -> (HashMap<u32, u8>, u8) {
//         let mut deviations = HashMap::with_capacity(map.len());
//         let mut total_freqs: HashMap<String, u32> = HashMap::with_capacity(map.len());
//         let mut token_scores = HashMap::with_capacity(map.len());
//         let mut scores: u16 = 0;
//         let mut result: HashMap<u32, u8> = HashMap::new();
//         for (doc_id, doc) in map {
//             let count = doc.len() as u32;
//             let means: Vec<f32> = doc
//                 .iter()
//                 .map(|(t, w)| {
//                     *total_freqs.entry(t.to_owned()).or_default() += w.freq;
//                     w.mean as f32
//                 })
//                 .collect();
//             let deviation = standard_deviation(&means);
//             deviations.insert(*doc_id, (deviation, count));

//             let mut ratio_sum: f32 = 0.0;
//             for (token, w) in doc {
//                 ratio_sum +=
//                     w.freq as f32 / *total_freqs.entry(token.to_owned()).or_default() as f32;
//             }
//             token_scores.insert(*doc_id, ratio_sum / count as f32);
//         }

//         let num_tokens = tokens.len() as f32;

//         for (doc_id, _) in map {
//             let (devi, count) = *deviations.get(doc_id).unwrap();
//             let freq_ratio = *token_scores.get(doc_id).unwrap_or(&0.0);
//             let words_found_ratio = count as f32 / num_tokens;
//             let score = (((words_found_ratio * 6.0 + freq_ratio + ((1.0 / (devi + 1.0)) * 3.0))
//                 / 10.0)
//                 * 100.0)
//                 .floor() as u8;
//             scores += score as u16;
//             result.insert(*doc_id, score);
//         }
//         return (result, ((scores / map.len() as u16) as u8));
//     }

//     pub fn search(&mut self, query: &str) -> (HashMap<u32, u8>, u8) {
//         let mut tokens = self.tokenize_query(query.to_owned());
//         println!("{:?}", tokens);
//         let filter = self.filter(&mut tokens);
//         if filter.len() > 0 {
//             let map = self.transpose(&filter);
//             return self.score(tokens, &map);
//         }
//         return (HashMap::default(), 0);
//     }

//     pub fn above_average(&self, result: HashMap<u32, u8>, avg: u8) -> Vec<(String, u8)> {
//         result
//             .iter()
//             .filter(|(_, score)| score >= &&avg)
//             .map(|(id, score)| (self.index.get_title(id), *score))
//             .collect()
//     }

//     pub fn all(&mut self, result: HashMap<u32, u8>) -> Vec<(String, u8)> {
//         result
//             .iter()
//             .map(|(id, score)| (self.index.get_title(id), *score))
//             .collect()
//     }
// }

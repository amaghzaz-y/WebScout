extern crate alloc;
use alloc::string::{String, ToString};
use rust_stemmers::{Algorithm, Stemmer};
pub struct Tokenizer {
    stemmer: Stemmer,
}
// default language stemmeris English
// use detect_lang to set a new language stemmer
impl Tokenizer {
    pub fn new() -> Tokenizer {
        Tokenizer {
            stemmer: Stemmer::create(Algorithm::English),
        }
    }

    pub fn detect_lang(&mut self, text: &str) {
        let lang = whatlang::detect_lang(text).unwrap_or(whatlang::Lang::Eng);
        match lang {
            whatlang::Lang::Ara => self.stemmer = Stemmer::create(Algorithm::Arabic),
            whatlang::Lang::Dan => self.stemmer = Stemmer::create(Algorithm::Danish),
            whatlang::Lang::Nld => self.stemmer = Stemmer::create(Algorithm::Dutch),
            whatlang::Lang::Eng => self.stemmer = Stemmer::create(Algorithm::English),
            whatlang::Lang::Fin => self.stemmer = Stemmer::create(Algorithm::Finnish),
            whatlang::Lang::Fra => self.stemmer = Stemmer::create(Algorithm::French),
            whatlang::Lang::Deu => self.stemmer = Stemmer::create(Algorithm::German),
            whatlang::Lang::Ell => self.stemmer = Stemmer::create(Algorithm::Greek),
            whatlang::Lang::Hun => self.stemmer = Stemmer::create(Algorithm::Hungarian),
            whatlang::Lang::Ita => self.stemmer = Stemmer::create(Algorithm::Italian),
            whatlang::Lang::Por => self.stemmer = Stemmer::create(Algorithm::Portuguese),
            whatlang::Lang::Ron => self.stemmer = Stemmer::create(Algorithm::Romanian),
            whatlang::Lang::Rus => self.stemmer = Stemmer::create(Algorithm::Russian),
            whatlang::Lang::Spa => self.stemmer = Stemmer::create(Algorithm::Spanish),
            whatlang::Lang::Swe => self.stemmer = Stemmer::create(Algorithm::Swedish),
            whatlang::Lang::Tur => self.stemmer = Stemmer::create(Algorithm::Turkish),
            _ => self.stemmer = Stemmer::create(Algorithm::English),
        }
    }

    pub fn tokenize(&mut self, value: &str) -> String {
        self.stemmer.stem(&value.to_lowercase()).to_string()
    }
}

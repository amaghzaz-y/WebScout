extern crate alloc;
use alloc::string::{String, ToString};
use rust_stemmers::Algorithm;
pub struct Stemmer {
    stemmer: rust_stemmers::Stemmer,
}
// default language stemmeris English
// use detect_lang to set a new language stemmer
impl Stemmer {
    pub fn new() -> Stemmer {
        Stemmer {
            stemmer: rust_stemmers::Stemmer::create(Algorithm::English),
        }
    }

    pub fn detect_lang(&mut self, text: &str) {
        let lang = whatlang::detect_lang(text).unwrap_or(whatlang::Lang::Eng);
        match lang {
            whatlang::Lang::Ara => self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Arabic),
            whatlang::Lang::Dan => self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Danish),
            whatlang::Lang::Nld => self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Dutch),
            whatlang::Lang::Eng => {
                self.stemmer = rust_stemmers::Stemmer::create(Algorithm::English)
            }
            whatlang::Lang::Fin => {
                self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Finnish)
            }
            whatlang::Lang::Fra => self.stemmer = rust_stemmers::Stemmer::create(Algorithm::French),
            whatlang::Lang::Deu => self.stemmer = rust_stemmers::Stemmer::create(Algorithm::German),
            whatlang::Lang::Ell => self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Greek),
            whatlang::Lang::Hun => {
                self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Hungarian)
            }
            whatlang::Lang::Ita => {
                self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Italian)
            }
            whatlang::Lang::Por => {
                self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Portuguese)
            }
            whatlang::Lang::Ron => {
                self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Romanian)
            }
            whatlang::Lang::Rus => {
                self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Russian)
            }
            whatlang::Lang::Spa => {
                self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Spanish)
            }
            whatlang::Lang::Swe => {
                self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Swedish)
            }
            whatlang::Lang::Tur => {
                self.stemmer = rust_stemmers::Stemmer::create(Algorithm::Turkish)
            }
            _ => self.stemmer = rust_stemmers::Stemmer::create(Algorithm::English),
        }
    }

    pub fn stem(&mut self, value: &str) -> String {
        self.stemmer.stem(&value.to_lowercase()).to_string()
    }
}

use crate::utils::text_to_hashset;
use alloc::sync::Arc;
use hashbrown::HashSet;
use lazy_static::lazy_static;
mod arabic;
mod danish;
mod dutch;
mod english;
mod finnish;
mod french;
mod german;
mod greek;
mod hungarian;
mod italian;
mod portuguese;
mod romanian;
mod russian;
mod spanish;
mod swedish;
mod turkish;
lazy_static! {
    static ref ARABIC: HashSet<Arc<str>> = text_to_hashset(arabic::AR_STOPWORDS);
    static ref DANISH: HashSet<Arc<str>> = text_to_hashset(danish::DA_STOPWORDS);
    static ref DUTCH: HashSet<Arc<str>> = text_to_hashset(dutch::NL_STOPWORDS);
    static ref ENGLISH: HashSet<Arc<str>> = text_to_hashset(english::EN_STOPWORDS);
    static ref FINNISH: HashSet<Arc<str>> = text_to_hashset(finnish::FI_STOPWORDS);
    static ref FRENCH: HashSet<Arc<str>> = text_to_hashset(french::FR_STOPWORDS);
    static ref GERMAN: HashSet<Arc<str>> = text_to_hashset(german::DE_STOPWORDS);
    static ref GREEK: HashSet<Arc<str>> = text_to_hashset(greek::EL_STOPWORDS);
    static ref HUNGARIAN: HashSet<Arc<str>> = text_to_hashset(hungarian::HU_STOPWORDS);
    static ref ITALIAN: HashSet<Arc<str>> = text_to_hashset(italian::IT_STOPWORDS);
    static ref PORTUGUESE: HashSet<Arc<str>> = text_to_hashset(portuguese::PT_STOPWORDS);
    static ref ROMANIAN: HashSet<Arc<str>> = text_to_hashset(romanian::RO_STOPWORDS);
    static ref RUSSIAN: HashSet<Arc<str>> = text_to_hashset(russian::RU_STOPWORDS);
    static ref SPANISH: HashSet<Arc<str>> = text_to_hashset(spanish::ES_STOPWORDS);
    static ref SWEDISH: HashSet<Arc<str>> = text_to_hashset(swedish::SV_STOPWORDS);
    static ref TURKISH: HashSet<Arc<str>> = text_to_hashset(turkish::TR_STOPWORDS);
}

pub fn is_stopword(lang: &whatlang::Lang, value: &str) -> bool {
    match lang {
        whatlang::Lang::Ara => return ARABIC.contains(value),
        whatlang::Lang::Dan => return DANISH.contains(value),
        whatlang::Lang::Nld => return DUTCH.contains(value),
        whatlang::Lang::Eng => return ENGLISH.contains(value),
        whatlang::Lang::Fin => return FINNISH.contains(value),
        whatlang::Lang::Fra => return FRENCH.contains(value),
        whatlang::Lang::Deu => return GERMAN.contains(value),
        whatlang::Lang::Ell => return GREEK.contains(value),
        whatlang::Lang::Hun => return HUNGARIAN.contains(value),
        whatlang::Lang::Ita => return ITALIAN.contains(value),
        whatlang::Lang::Por => return PORTUGUESE.contains(value),
        whatlang::Lang::Ron => return ROMANIAN.contains(value),
        whatlang::Lang::Rus => return RUSSIAN.contains(value),
        whatlang::Lang::Spa => return SPANISH.contains(value),
        whatlang::Lang::Swe => return SWEDISH.contains(value),
        whatlang::Lang::Tur => return TURKISH.contains(value),
        _ => return ENGLISH.contains(value),
    }
}

#[cfg(test)]
mod tests {
    use super::is_stopword;

    #[test]
    fn english_true_stopword() {
        assert_eq!(true, is_stopword(&whatlang::Lang::Eng, "you"))
    }
    #[test]
    fn english_false_stopword() {
        assert_eq!(false, is_stopword(&whatlang::Lang::Eng, "flying"))
    }
    #[test]
    fn french_true_stopword() {
        assert_eq!(true, is_stopword(&whatlang::Lang::Fra, "mais"))
    }
    #[test]
    fn french_false_stopword() {
        assert_eq!(false, is_stopword(&whatlang::Lang::Eng, "voiture"))
    }
}

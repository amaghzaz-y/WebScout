use crate::utils::text_to_hashset;
use alloc::string::String;
use hashbrown::HashSet;
use lazy_static::lazy_static;
pub mod arabic;
pub mod french;
lazy_static! {
    pub static ref AR: HashSet<String> = text_to_hashset(arabic::AR_STOPWORDS);
}

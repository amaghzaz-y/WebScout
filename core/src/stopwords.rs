use alloc::string::{String, ToString};
use hashbrown::HashSet;
use lazy_static::lazy_static;

lazy_static! {
    pub static ref AR: HashSet<String> = ["gf".to_string()].into();
}

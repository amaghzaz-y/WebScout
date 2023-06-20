use alloc::{borrow::ToOwned, string::String};
use cfg_if::cfg_if;
use hashbrown::HashSet;
cfg_if! {
    if #[cfg(feature = "console_error_panic_hook")] {
        extern crate console_error_panic_hook;
        pub use self::console_error_panic_hook::set_once as set_panic_hook;
    } else {
        #[inline]
        pub fn set_panic_hook() {}
    }
}

pub fn mean(numbers: &[usize]) -> usize {
    let mean = numbers.iter().sum::<usize>() / numbers.len();
    return mean;
}

#[allow(dead_code)]
pub fn to_lower_alphanumeric(s: &str) -> String {
    const ASCII_LOOKUP: [u8; 128] = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 97, 98, 99, 100, 101,
        102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
        120, 121, 122, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107,
        108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125,
        126, 127,
    ];

    let mut result = String::with_capacity(s.len());

    for &b in s.as_bytes() {
        if ASCII_LOOKUP[b as usize] > 1 {
            result.push(ASCII_LOOKUP[b as usize] as char);
        }
    }
    result
}

pub fn text_to_hashset(text: &str) -> HashSet<String> {
    text.split_whitespace()
        .map(|word| word.to_owned())
        .collect()
}

pub fn standard_deviation(data: &[f32]) -> f32 {
    let n = data.len();
    if n < 2 {
        return 0.0;
    }
    let mean = data.iter().sum::<f32>() / n as f32;
    let variance = data.iter().map(|x| (x - mean).powi(2)).sum::<f32>() / (n - 1) as f32;
    variance.sqrt()
}

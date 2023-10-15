use rand::Rng;
use rand::RngCore;
use std::{collections::HashMap, io};

pub fn combine_zip(words: &[String], separators: &[String]) -> String {
    let mut result = String::with_capacity(
        // Pre-allocate since the size is known ahead of time
        words.iter().map(|x| x.len()).sum::<usize>()
            + separators.iter().map(|x| x.len()).sum::<usize>(),
    );

    for (i, word) in words.iter().enumerate() {
        result.push_str(word);
        if let Some(sep) = separators.get(i) {
            result.push_str(sep);
        }
    }
    result
}

pub fn make_words(count: usize, word_list: &HashMap<String, String>) -> Vec<String> {
    make_wl_keys(count)
        .into_iter()
        .filter_map(|k| word_list.get(&k).cloned())
        .collect()
}

fn make_wl_keys(count: usize) -> Vec<String> {
    const KEY_LENGTH: usize = 5;
    const DIGIT_RANGE: u8 = 6;

    let total_byte_count = count * KEY_LENGTH;
    let mut rng = rand::thread_rng();
    let mut bytes = vec![0u8; total_byte_count];
    rng.fill_bytes(&mut bytes);

    let mut keys: Vec<String> = Vec::with_capacity(count);
    let mut key = String::with_capacity(KEY_LENGTH);

    for chunk in bytes.chunks_exact(KEY_LENGTH) {
        for &byte in chunk {
            let digit = ((byte % DIGIT_RANGE) + 1) as u32;
            key.push(std::char::from_digit(digit, 10).unwrap());
        }
        keys.push(key.clone());
        key.clear();
    }
    keys
}

const SEPARATOR_OPTS: [&'static str; 12] =
    ["_", ",", "!", "@", "*", "&", "^", "~", "-", ".", "$", "|"];
const SEPARATOR_OPTS_LEN: usize = SEPARATOR_OPTS.len();

pub fn make_separators(count: usize, separator_kind: &str) -> Vec<String> {
    let sep_count = count.saturating_sub(1);
    match separator_kind {
        "random" => {
            let mut rng = rand::thread_rng();
            (0..sep_count)
                .map(|_| SEPARATOR_OPTS[rng.gen_range(0..SEPARATOR_OPTS_LEN)].to_owned())
                .collect()
        }
        ch => vec![ch.to_owned(); sep_count],
    }
}

pub fn read_wl() -> io::Result<HashMap<String, String>> {
    // Use the macro that way we "package" the JSON wordlist with the create
    Ok(serde_json::from_str(include_str!("wl-2016.json"))?)
}

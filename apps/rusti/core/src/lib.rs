use rand::{
    distributions::{Distribution, Uniform},
    rngs::ThreadRng,
    Rng,
};
use std::{collections::HashMap, io};

pub fn combine_zip(words: &[String], separators: &[String]) -> String {
    let mut i = 0;
    let separators_len = separators.len();
    let mut result = String::with_capacity(
        // Pre-allocate since the size is known ahead of time
        words.iter().map(|x| x.len()).sum::<usize>()
            + separators.iter().map(|x| x.len()).sum::<usize>(),
    );

    for word in words {
        result.push_str(word);
        if i < separators_len {
            result.push_str(&separators[i]);
        }
        i += 1;
    }
    result
}

pub fn make_words(count: usize, word_list: &HashMap<String, String>) -> Vec<String> {
    make_wl_keys(count)
        .iter()
        .flat_map(|k| match word_list.get(k) {
            Some(word) => Some(word.clone()),
            _ => None,
        })
        .collect()
}

struct WordListKeys {
    rng: ThreadRng,
}

impl Iterator for WordListKeys {
    type Item = Vec<String>;

    fn next(&mut self) -> Option<Self::Item> {
        let die = Uniform::new_inclusive(1, 6);
        let roll = die.sample_iter(&mut self.rng);
        let keys: Vec<String> = roll.take(5).map(|x| x.to_string()).collect();
        Some(keys)
    }
}

fn make_wl_keys(count: usize) -> Vec<String> {
    let rng = rand::thread_rng();
    WordListKeys { rng }
        .take(count)
        .map(|roll_result| roll_result.join(""))
        .collect()
}

const SEPARATOR_OPTS: [&'static str; 12] =
    ["_", ",", "!", "@", "*", "&", "^", "~", "-", ".", "$", "|"];
const SEPARATOR_OPTS_LEN: usize = SEPARATOR_OPTS.len();

pub fn make_separators(count: usize, separator_kind: &str) -> Vec<String> {
    let sep_count = count - 1;
    match separator_kind {
        "random" => {
            let mut rng = rand::thread_rng();
            (0..sep_count)
                .into_iter()
                .filter_map(|_| {
                    let random_index = rng.gen_range(0..SEPARATOR_OPTS_LEN);
                    match SEPARATOR_OPTS.get(random_index) {
                        Some(sep) => Some(sep.clone().to_owned()),
                        _ => None,
                    }
                })
                .collect()
        }
        ch => ch
            .repeat(sep_count)
            .split("")
            .filter_map(|x| if x != "" { Some(x.to_owned()) } else { None })
            .collect(),
    }
}

pub fn read_wl() -> io::Result<HashMap<String, String>> {
    // Use the macro that way we "package" the JSON wordlist with the create
    Ok(serde_json::from_str(include_str!("wl-2016.json"))?)
}

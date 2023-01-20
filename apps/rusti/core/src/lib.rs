use rand::{
    distributions::{Distribution, Uniform},
    rngs::ThreadRng,
    Rng,
};
use std::{collections::HashMap, io};

pub fn dicephrase(
    count: usize,
    separator_kind: String,
) -> io::Result<(Vec<String>, Vec<String>, String)> {
    let word_list = read_wl()?;
    let separators = make_separators(count, &separator_kind);
    let words = make_words(count, word_list);

    let full_phrase = make_full_phrase(words.clone(), separators.clone());

    Ok((words, separators, full_phrase))
}

pub fn make_full_phrase(words: Vec<String>, separators: Vec<String>) -> String {
    let final_index = words.len() - 1;
    words
        .iter()
        .zip(separators.iter())
        .enumerate()
        .map(|(i, (word, sep))| {
            let word = word.to_owned();
            // Drop the dangling separator at the end.
            if i == final_index {
                word
            } else {
                word + sep
            }
        })
        .collect::<Vec<String>>()
        .join("")
}

pub fn make_words(count: usize, word_list: HashMap<String, String>) -> Vec<String> {
    let keys = make_wl_keys(count);
    keys.iter()
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
    type Item = Vec<u8>;

    fn next(&mut self) -> Option<Self::Item> {
        let die = Uniform::new_inclusive(1, 6);
        let roll = die.sample_iter(&mut self.rng);
        let keys: Vec<u8> = roll.take(5).collect();
        Some(keys)
    }
}

fn make_wl_keys(count: usize) -> Vec<String> {
    let rng = rand::thread_rng();
    WordListKeys { rng }
        .take(count)
        .map(|e| e.iter().map(|x| x.to_string()).collect::<String>())
        .collect()
}

const SEPARATOR_OPTS: [&'static str; 12] =
    ["_", ",", "!", "@", "*", "&", "^", "~", "-", ".", "$", "|"];

pub fn make_separators(count: usize, separator_kind: &str) -> Vec<String> {
    // TODO: Figure out how to have count be `count - 1` and have the caller
    // zip the two uneven vectors - might be more work than just zipping the
    // two being equal by generating 1 extra element
    let separators = if separator_kind == "random" {
        let mut rng = rand::thread_rng();
        let separator_opts_len = SEPARATOR_OPTS.len();

        (0..count)
            .into_iter()
            .filter_map(|_| {
                let random_index = rng.gen_range(0..separator_opts_len);
                match SEPARATOR_OPTS.get(random_index) {
                    Some(sep) => Some(sep.clone().to_owned()),
                    _ => panic!("Unable to get random char"),
                }
            })
            .collect()
    } else {
        separator_kind
            .repeat(count)
            .split("")
            .map(|x| x.to_owned())
            .filter(|x| x.trim() != "")
            .collect()
    };

    separators
}

pub fn read_wl() -> io::Result<HashMap<String, String>> {
    // Use the macro that way we "package" the JSON wordlist with the create
    Ok(serde_json::from_str(include_str!("wl-2016.json"))?)
}

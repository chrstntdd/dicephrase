use rand::{
    distributions::{Distribution, Uniform},
    rngs::ThreadRng,
    Rng,
};
use std::{collections::HashMap, fs::read_to_string, io};

fn main() -> io::Result<()> {
    let word_list = read_wl()?;
    let count = 15;
    let keys = make_wl_keys(count);
    let separators = make_separators(count, "random");
    let words: Vec<String> = keys
        .iter()
        .flat_map(|k| match word_list.get(k) {
            Some(word) => Some(word.clone()),
            _ => None,
        })
        .collect();

    let final_index = words.len() - 1;

    let full_phrase = words
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
        .join("");

    println!("{:?} , {:?}", words, separators);
    println!("{:?}", full_phrase);

    Ok(())
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

fn dicephrase() -> WordListKeys {
    let rng = rand::thread_rng();
    WordListKeys { rng }
}

fn make_wl_keys(count: usize) -> Vec<String> {
    dicephrase()
        .take(count)
        .map(|e| e.iter().map(|x| x.to_string()).collect::<String>())
        .collect()
}

const SEPARATOR_OPTS: [&'static str; 12] =
    ["_", ",", "!", "@", "*", "&", "^", "~", "-", ".", "$", "|"];

fn make_separators(count: usize, separator_kind: &str) -> Vec<String> {
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

fn read_wl() -> io::Result<HashMap<String, String>> {
    let path = "./src/wl-2016.json";
    let data = read_to_string(path)?;
    let lookup: HashMap<String, String> = serde_json::from_str(&data)?;

    Ok(lookup)
}

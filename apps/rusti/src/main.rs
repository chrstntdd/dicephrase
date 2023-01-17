use rand::{
    distributions::{Distribution, Uniform},
    rngs::ThreadRng,
    Rng,
};
use std::{collections::HashMap, fs::read_to_string, io};

fn main() -> io::Result<()> {
    let wordlist = read_wl()?;
    let keys = make_wl_keys(8);
    let separators = make_separators(8, "random");
    let mut words = vec![];

    for k in keys {
        match wordlist.get(&k) {
            Some(word) => {
                words.push(word);
            }
            _ => (),
        }
    }

    println!("{:?} , {:?}", words, separators);

    Ok(())
}

struct DicephraseKeys {
    rng: ThreadRng,
}

impl Iterator for DicephraseKeys {
    type Item = Vec<u8>;

    fn next(&mut self) -> Option<Self::Item> {
        let die = Uniform::new_inclusive(1, 6);
        let roll = die.sample_iter(&mut self.rng);
        let keys: Vec<u8> = roll.take(5).collect();
        Some(keys)
    }
}

fn dicephrase() -> DicephraseKeys {
    let rng = rand::thread_rng();
    DicephraseKeys { rng }
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
    let separators = if separator_kind == "random" {
        let mut rng = rand::thread_rng();
        let count_of_separators = count - 1;
        let separator_opts_len = SEPARATOR_OPTS.len();

        (0..count_of_separators)
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

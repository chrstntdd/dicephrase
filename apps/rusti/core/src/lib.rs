use rand::Rng;
use rand::RngCore;
use std::sync::Mutex;
use std::{collections::HashMap, io};

const BUFFER_SIZE: usize = 2048;

pub struct RandomBuffer {
    buffer: Mutex<Vec<u8>>,
    index: Mutex<usize>,
}

impl RandomBuffer {
    pub fn new() -> Self {
        let mut initial_buffer = vec![0u8; BUFFER_SIZE];
        rand::thread_rng().fill_bytes(&mut initial_buffer);
        Self {
            buffer: Mutex::new(initial_buffer),
            index: Mutex::new(0),
        }
    }

    pub fn get_bytes(&self, size: usize) -> Vec<u8> {
        let mut index_guard = self.index.lock().unwrap();
        let mut end_index = *index_guard + size;

        if end_index > BUFFER_SIZE {
            let mut buffer_guard = self.buffer.lock().unwrap();
            rand::thread_rng().fill_bytes(&mut buffer_guard);
            *index_guard = 0;
            end_index = size;
        }

        let buffer_guard = self.buffer.lock().unwrap();
        let bytes = buffer_guard[*index_guard..end_index].to_vec();
        *index_guard = end_index;
        bytes
    }
}

impl Default for RandomBuffer {
    fn default() -> Self {
        Self::new()
    }
}

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

pub fn make_words(
    count: usize,
    word_list: &HashMap<[u8; 5], String>,
    rand_buf: &RandomBuffer,
) -> Vec<String> {
    make_wl_keys(count, rand_buf)
        .into_iter()
        .filter_map(|k| word_list.get(&k).cloned())
        .collect()
}

fn make_wl_keys(count: usize, rand_buf: &RandomBuffer) -> Vec<[u8; 5]> {
    const KEY_LENGTH: usize = 5;
    const DIGIT_RANGE: u8 = 6;

    let mut keys: Vec<[u8; KEY_LENGTH]> = Vec::with_capacity(count);
    let mut key: [u8; KEY_LENGTH] = [0; KEY_LENGTH];
    let random_bytes = rand_buf.get_bytes(count * KEY_LENGTH);

    for chunk in random_bytes.chunks_exact(KEY_LENGTH) {
        for (i, &byte) in chunk.iter().enumerate() {
            key[i] = (byte % DIGIT_RANGE) + 1;
        }
        keys.push(key);
    }
    keys
}

const SEPARATOR_OPTS: [&str; 12] = ["_", ",", "!", "@", "*", "&", "^", "~", "-", ".", "$", "|"];
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

pub fn read_wl() -> io::Result<HashMap<[u8; 5], String>> {
    let raw_map: HashMap<String, String> = serde_json::from_str(include_str!("wl-2016.json"))?;
    let mut converted_map = HashMap::new();

    for (k, v) in raw_map {
        let bytes: Vec<u8> = k.chars().map(|c| c.to_digit(10).unwrap() as u8).collect();
        if bytes.len() == 5 {
            let mut array = [0u8; 5];
            array.copy_from_slice(&bytes);
            converted_map.insert(array, v);
        }
    }

    Ok(converted_map)
}

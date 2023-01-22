use std::io;

use core_dicephrase::{make_full_phrase, make_separators, make_words, read_wl};

fn main() -> io::Result<()> {
    let word_list = read_wl().expect("Unable to read wordlist");
    let count = 11;
    let sep = "random";
    let separators = make_separators(count, &sep.to_string());
    let words = make_words(count, &word_list);
    let full = make_full_phrase(&words, &separators);

    // TODO: Integrate with CLI library (clap?)
    println!("{:?}", full);

    Ok(())
}

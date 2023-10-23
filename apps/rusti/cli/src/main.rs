use clap::Parser;
use core_dicephrase::{combine_zip, make_separators, make_words, read_wl, RandomBuffer};

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Single character or the string literal "random"
    #[arg(long)]
    sep: String,

    /// Number of times to greet
    #[arg(long, default_value_t = 11)]
    count: usize,
}

fn main() {
    let args = Args::parse();

    let word_list = read_wl().expect("Unable to read wordlist");
    let separators = make_separators(args.count, &args.sep);
    let rand_buf = RandomBuffer::new();
    let words = make_words(args.count, &word_list, &rand_buf);
    let full = combine_zip(&words, &separators);

    println!("{:?}", full)
}

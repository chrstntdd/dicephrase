use std::io;

use core_dicephrase::{self, dicephrase};

fn main() -> io::Result<()> {
    // TODO: Integrate with CLI library (clap?)
    println!("{:?}", dicephrase(11, "random".to_string()));

    Ok(())
}

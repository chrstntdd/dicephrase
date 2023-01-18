use std::io;

use dicephrase::dicephrase;

fn main() -> io::Result<()> {
    let (_, _, full_phrase) = dicephrase(11, "random".to_string())?;

    println!("{:?}", full_phrase);

    Ok(())
}

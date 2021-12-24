import { createReadStream, createWriteStream, existsSync, mkdirSync } from "fs"
import { resolve } from "path"
import { promisify } from "util"
import { pipeline } from "stream"

const asyncPipe = promisify(pipeline)

copyWordList("wl-2016.json")

async function copyWordList(name) {
  let destination = resolve("dist", "assets", name)
  if (!existsSync(destination)) {
    mkdirSync("dist", { recursive: true })
  }
  await asyncPipe(
    createReadStream(resolve("src", "assets", name)),
    createWriteStream(destination)
  )

  console.info("Copied the word list 🌐")
}

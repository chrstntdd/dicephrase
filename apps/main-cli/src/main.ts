import { cac, combine_zip, make_phrases, make_separators } from "./deps.ts"
import { CLI_VERSION } from "./cfg.ts"

import wl from "../../main/public/wl-2016.json" assert { type: "json" }

let cli = cac("dicephrase")
  .option("--separator <separator>", "Word separator", {
    default: "random"
  })
  .option("--count <count>", "Word count", {
    default: 8
  })
  .help()
  .version(CLI_VERSION)

let params = cli.parse().options

console.info(
  combine_zip(
    make_phrases(params.count, wl),
    make_separators(params.separator, params.count)
  ).join("")
)

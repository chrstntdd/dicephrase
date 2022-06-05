import { cac, combine_zip, make_phrases, make_separators } from "./deps/deps.ts"
import { CLI_VERSION } from "./cfg.ts"

import wl from "../../www/public/wl-2016.json" assert { type: "json" }

let cli = cac("dicephrase").help().version(CLI_VERSION)

cli
  .command("")
  .option("--separator <separator>", "Word separator", {
    default: "random"
  })
  .option("--count <count>", "Word count", {
    default: 8
  })
  .action((params) => {
    // TODO: add validators and fallbacks. When using fallbacks, notify user
    console.info(
      combine_zip(
        make_phrases(params.count, wl),
        make_separators(params.separator, params.count)
      ).join("")
    )
  })

cli.parse()

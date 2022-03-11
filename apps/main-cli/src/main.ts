import {
  cac,
  combine_zip,
  crypto,
  make_wl_keys,
  RANDOM_SEPARATOR_OPTS,
  shuffle
} from "./deps.ts"

import wl from "../../main/public/wl-2016.json" assert { type: "json" }

let cli = cac("dicephrase")
  .option("--separator <separator>", "Word separator", {
    default: "random"
  })
  .option("--count <count>", "Word count", {
    default: 8
  })
  .help()
  .version("0.0.1")

let params = cli.parse().options

console.info(
  combine_zip(
    makePhrases(params.count, wl),
    makeSeparators(params.separator, params.count)
  ).join("")
)

function makePhrases(
  count: number,
  wlRecord: Record<string, string>
): string[] {
  let keys = make_wl_keys(count, (b: Uint8Array) => crypto.getRandomValues(b))
  let phrases = new Array<string>(keys.length)

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    phrases[index] = wlRecord[key]
  }

  return phrases
}

function makeSeparators(separatorKind: string, count: number): string[] {
  let sepCount = count - 1
  let makeRandom = separatorKind === "random"
  let separators: string[]

  if (makeRandom) {
    separators = []
    while (separators.length < sepCount) {
      separators.push(shuffle([...RANDOM_SEPARATOR_OPTS])[0])
    }
  } else {
    separators = new Array(sepCount).fill(separatorKind)
  }

  return separators
}

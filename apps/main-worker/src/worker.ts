import { make_wl_keys, parse_qs_to_phrase_config, shuffle } from "gen-utils"

const RANDOM_SEPARATOR_OPTS = [
  "~",
  "-",
  "_",
  "!",
  "@",
  "$",
  "^",
  "&",
  "*",
  ".",
  ",",
  "\u00a0"
]

function makeSeparators(ctx: {
  separatorKind: string
  count: number
}): string[] {
  let sepCount = ctx.count - 1
  let makeRandom = ctx.separatorKind === "random"
  let separators: string[]

  if (makeRandom) {
    separators = []
    while (separators.length < sepCount) {
      separators.push(shuffle([...RANDOM_SEPARATOR_OPTS])[0])
    }
  } else {
    separators = new Array(sepCount).fill(ctx.separatorKind)
  }

  return separators
}

async function handleRequest(request: Request) {
  const { searchParams } = new URL(request.url)
  let wordListRecord: Record<string, string> = await (
    await fetch("https://dicephrase.xyz/wl-2016.json")
  ).json()

  let { count, sep } = parse_qs_to_phrase_config(`${searchParams}`)
  let keys = make_wl_keys(count, (b) => crypto.getRandomValues(b))
  let phrases = new Array<string>(keys.length)

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    phrases[index] = wordListRecord[key]
  }

  let separators = makeSeparators({ separatorKind: sep, count: count })

  // let res = new Response(JSON.stringify({ fullPhrase }))

  // res.headers.append("content-type", "application/json")

  // return res
  //
  let ogRes = await fetch(request.url)

  return new HTMLRewriter()
    .onDocument(new DocumentHandler(phrases, separators))
    .transform(ogRes)
}

class DocumentHandler {
  constructor(phrases: string[], separators: string[]) {
    this.phrases = phrases
    this.separators = separators
  }

  phrases: string[]
  separators: string[]

  async comments(comment: Comment) {
    // An incoming comment

    if (comment.text.trim() === "EDGE_DATA") {
      comment.replace(
        `<script>window.EDGE_DATA = '{ phrases: ${JSON.stringify(
          this.phrases
        )}, separators: ${JSON.stringify(this.separators)} }'</script>`,
        {
          html: true
        }
      )
    }
  }
}

export default {
  async fetch(request: Request) {
    // TODO: Filter to only run on valid URL with proper search params
    return handleRequest(request)
  }
}

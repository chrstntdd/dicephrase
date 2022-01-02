import * as v from "@badrap/valita"
import { PHRASE_COUNT_KEY, SEPARATOR_KEY } from "../features/generate/constants"

const phraseConfigSchema = v.object({
  count: v.number().assert((n) => n >= 6 && n <= 10),
  sep: v.union(
    v.literal("\u00a0"),
    v.literal("-"),
    v.literal("."),
    v.literal("$"),
    v.literal("random")
  )
})

type PhraseConfig = v.Infer<typeof phraseConfigSchema>

function parseParamsToPhraseConfig(target: string): PhraseConfig {
  let params = new URLSearchParams(target)
  // Being sneaky here with the unary operators
  // Note the non null (!)
  // which allows the prefix (+) type conversion to a number
  // Thankfully, the validator keeps it safe from untrusted input
  let count = +params.get(PHRASE_COUNT_KEY)!
  let sep = params.get(SEPARATOR_KEY)

  try {
    return phraseConfigSchema.parse({
      count,
      sep
    })
  } catch (error) {
    return {
      count: 8,
      sep: "random"
    }
  }
}

export { parseParamsToPhraseConfig }

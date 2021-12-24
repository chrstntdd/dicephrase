import * as v from "@badrap/valita"

const phraseConfigSchema = v.object({
  count: v
    .number()
    .assert((n) => n >= 6 && n <= 10)
    .default(8),
  sep: v
    .union(
      v.literal("\u00a0"),
      v.literal("-"),
      v.literal("."),
      v.literal("$"),
      v.literal("random")
    )
    .default("random")
})

type PhraseConfig = v.Infer<typeof phraseConfigSchema>

function parseParamsToPhraseConfig(
  target: string | HTMLFormElement
): PhraseConfig {
  let params =
    typeof target === "string"
      ? new URLSearchParams(target)
      : new FormData(target)
  // Being sneaky here with the unary operators
  // Note the non null (!)
  // which allows the prefix (+) type conversion to a number
  // Thankfully, the validator keeps it safe from untrusted input
  let count = +params.get("phrase-count")!
  let sep = params.get("separator")

  return phraseConfigSchema.parse({
    count,
    sep
  })
}

export { parseParamsToPhraseConfig }

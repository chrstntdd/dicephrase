import { copyTextToClipboard } from "../../lib/clippy"

import { combine_zip } from "gen-utils"

export async function copyPhraseToClipboard(ctx: {
  phrases: string[]
  separators: string[]
}) {
  let pw = combine_zip(ctx.phrases, ctx.separators)
  await copyTextToClipboard(pw.join(""))
}

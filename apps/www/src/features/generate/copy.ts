import { copyTextToClipboard } from "../../lib/clippy"

import { combine_zip } from "gen-utils"

export async function copyPhraseToClipboard(
	phrases: string[],
	separators: string[],
) {
	let pw = combine_zip(phrases, separators)
	await copyTextToClipboard(pw.join(""))
}

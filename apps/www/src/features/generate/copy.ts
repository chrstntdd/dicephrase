import { copyTextToClipboard } from "../../lib/clippy"

import { combine_zip } from "gen-utils"

export async function copyPhraseToClipboard(
	phrases: ReadonlyArray<string>,
	separators: ReadonlyArray<string>,
) {
	let pw = combine_zip(phrases as Array<string>, separators as Array<string>)
	await copyTextToClipboard(pw.join(""))
}

import { combine_zip } from "gen-utils"
import { makeToast, addToast, toastWrapper } from "~/lib/toast"

import { copyTextToClipboard } from "../../lib/clippy"
import { phrases, separators } from "./gen-behavior"

export async function copyPhraseToClipboard() {
	let p = phrases.value
	let s = separators.value
	let pw = combine_zip(p as Array<string>, s as Array<string>)
	await copyTextToClipboard(pw.join(""))
	await toastWrapper({ msg: "Copied to clipboard" })
}

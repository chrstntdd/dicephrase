import { copyBtn } from "~/lib/copy-btn.css"

import { ChangeCount, ChangeSeparator, Generate } from "./types"
/**
 * A mostly vanilla impl of the app to avoid the costs of solid's hydration
 * and the _entire_ reactive system.
 *
 * State is owned by a web worker.
 *
 * Other possible optimizations
 * - Have the web worker generate the updated HTML?
 */

let $ = (s: Parameters<typeof document["querySelector"]>[0]) =>
	document.querySelector(s)

let wordCountRad = $("fieldset:first-of-type") as HTMLFieldSetElement
let separatorRad = $("fieldset:nth-of-type(2)") as HTMLFieldSetElement
let genForm = $(`#gen-form`) as HTMLFormElement
let copyBtnEl = $(`.${copyBtn}`) as HTMLButtonElement

async function handleEventProxy(
	...args: Parameters<typeof import("./gen-behavior")["handleEvent"]>
) {
	let { handleEvent } = await import("./gen-behavior")

	handleEvent(...args)
}

wordCountRad.addEventListener("change", (e) => {
	handleEventProxy(ChangeCount, e)
})
separatorRad.addEventListener("change", (e) => {
	handleEventProxy(ChangeSeparator, e)
})
genForm.addEventListener("submit", (e) => {
	e.preventDefault()
	handleEventProxy(Generate, e)
})

copyBtnEl.addEventListener("click", async () => {
	let { copyPhraseToClipboard } = await import("./copy-behavior")
	copyPhraseToClipboard()
})

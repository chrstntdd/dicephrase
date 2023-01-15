/**
 * A mostly vanilla impl of the app to avoid the costs of solid's hydration
 * and the _entire_ reactive system.
 *
 * State is owned by a web worker.
 *
 * Other possible optimizations
 * - Have the web worker generate the updated HTML?
 */
import { makeWorker } from "@ct/tworker"
import { combine_zip } from "gen-utils"
import { batch, effect, signal } from "@preact/signals-core"
import type { Msg } from "./types"
import type { Actions } from "./generate.worker"
import {
	visuallyHiddenOutput,
	visualOutputContainer,
} from "./phrase-output.css"
import { outputContainer } from "~/pages/index.css"
import { copyBtn } from "~/lib/copy-btn.css"

type State = "empty" | "with-output"

type CopyState = "idle" | "copying" | "copied"

let $ = (s: Parameters<(typeof document)["querySelector"]>[0]) =>
	document.querySelector(s)

let generateWorker = makeWorker<Actions>(() =>
	import.meta.env.SSR
		? ({ addEventListener() {} } as unknown as Worker)
		: new Worker(new URL("./generate.worker.ts", import.meta.url), {
				type: "module",
		  }),
)

let state = signal<State>("empty")
export let copyState = signal<CopyState>("idle")
let phraseCount = signal(8)
let separatorKind = signal("")
export let separators = signal<ReadonlyArray<string>>([])
export let phrases = signal<ReadonlyArray<string>>([])

let outputContainerEl = $(`.${outputContainer}`) as HTMLFormElement

export async function handleEvent(kind: Msg, ogEvent: Event) {
	let nextState = await generateWorker.run("handleEvent", {
		kind,
		value: (ogEvent.target as HTMLInputElement).value,
	})

	batch(() => {
		state.value = "with-output"
		separatorKind.value = nextState.separatorKind
		phraseCount.value = nextState.phraseCount
		separators.value = nextState.separators
		phrases.value = nextState.phrases
	})
}

effect(() => {
	if (state.value === "with-output") {
		outputContainerEl.innerHTML = render()
	}
})

effect(() => {
	if (state.value === "with-output") {
		$(`.${copyBtn}`)!.setAttribute("vis", "")
	}
})

function render() {
	let p = phrases.value as Array<string>
	let s = separators.value as Array<string>
	let fullPhrase = combine_zip(p, s).join("")
	return `<output role="status" aria-live="polite" form="gen-form" class="${visuallyHiddenOutput}">${fullPhrase}</output><div class="${visualOutputContainer}">${animatedOutput(
		{
			phrases: p,
			separators: s,
		},
	)}</div>`
}

function animatedOutput({
	phrases,
	separators,
}: {
	phrases: ReadonlyArray<string>
	separators: ReadonlyArray<string>
}) {
	return phrases
		.map((phrase, index) => {
			let isLast = index === phrases.length - 1
			let sep = separators[index] || ""

			return `${word({ content: phrase })}${
				!isLast ? word({ content: sep, sep: true }) : ""
			}`
		})
		.join("")
}

function word(props: { content: string; sep?: boolean }) {
	return `<div>${props.content
		.split("")
		.map(
			(char, index) =>
				`<span ${props.sep ? `data-sep="${props.sep}"` : ""} style="--ad:${
					index * 22
				}">${char}</span>`,
		)
		.join("")}</div>`
}

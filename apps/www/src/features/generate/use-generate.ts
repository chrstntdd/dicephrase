import { batch, createSignal, onMount } from "solid-js"
import {
	make_phrases,
	make_separators,
	parse_count_val,
	parse_qs_to_phrase_config,
	PHRASE_COUNT_FALLBACK,
	PHRASE_COUNT_KEY,
	SEPARATOR_FALLBACK,
	SEPARATOR_KEY,
} from "gen-utils"

import { assert } from "../../lib/assert"

type State = "empty" | "idle-with-output"

type CopyState = "idle" | "copying" | "copied"

const enum Msg {
	ChangeCount,
	ChangeSeparator,
	Generate,
}

async function fetchWordList(): Promise<Record<string, string>> {
	let res = await fetch("/wl-2016.json")
	assert(res.ok)
	let wl = res.json()
	return wl
}

let wl: ReturnType<typeof fetchWordList>

export function useGenerate() {
	let [state, setState] = createSignal<State>("empty")
	let [copyState, setCopyState] = createSignal<CopyState>("idle")
	let [phraseCount, setPhraseCount] = createSignal(PHRASE_COUNT_FALLBACK)
	let [separatorKind, setSeparatorKind] = createSignal(SEPARATOR_FALLBACK)
	let [separators, setSeparators] = createSignal<Array<string>>([])
	let [phrases, setPhrases] = createSignal<Array<string>>([])

	onMount(function setInitialStateFromURL() {
		let cfg = parse_qs_to_phrase_config(globalThis.location?.search)

		batch(() => {
			setSeparatorKind(cfg.sep)
			setPhraseCount(cfg.count)
		})
	})

	function syncFormToURL() {
		let url = new URL(globalThis.location as unknown as string)
		url.searchParams.set(PHRASE_COUNT_KEY, `${phraseCount()}`)
		url.searchParams.set(SEPARATOR_KEY, separatorKind())

		history.pushState({}, "", url)
	}

	function handleEvent(kind: Msg, ogEvent: Event) {
		switch (kind) {
			case Msg.ChangeCount: {
				let value = parse_count_val((ogEvent.target as HTMLInputElement).value)
				setPhraseCount(value)
				break
			}
			case Msg.ChangeSeparator: {
				// TODO: validate here...?
				let value = (ogEvent.target as HTMLInputElement).value
				setSeparatorKind(value)
				break
			}

			case Msg.Generate: {
				ogEvent.preventDefault()
				break
			}
		}

		// Cache the promise to fetch only one time
		;(wl ??= fetchWordList()).then((wordList) => {
			batch(() => {
				setSeparators(make_separators(separatorKind(), phraseCount()))
				setPhrases(make_phrases(phraseCount(), wordList))

				syncFormToURL()
				setState("idle-with-output")
			})
		})
	}

	return {
		state,
		copyState,
		ctx: {
			phraseCount,
			separatorKind,
			separators,
			phrases,
		},
		async onCopyPress() {
			setCopyState("copying")
			let m = await import("./copy").then((m) => m.copyPhraseToClipboard)

			await m(phrases(), separators())
			setCopyState("copied")
			setCopyState("idle")
		},
		onCountChange(e: Event) {
			handleEvent(Msg.ChangeCount, e)
		},
		onSeparatorChange(e: Event) {
			handleEvent(Msg.ChangeSeparator, e)
		},
		onGeneratePress(e: Event) {
			handleEvent(Msg.Generate, e)
		},
	}
}

import { batch, createSignal, onMount } from "solid-js"
import {
	make_phrases,
	make_separators,
	parse_count_val,
	parse_qs_to_phrase_config,
	PHRASE_COUNT_FALLBACK,
	SEPARATOR_FALLBACK,
	PHRASE_COUNT_KEY,
	SEPARATOR_KEY,
	combine_zip,
} from "gen-utils"

import { assert } from "../../lib/assert"

type State = "empty" | "with-output"

type CopyState = "idle" | "copying" | "copied"

const enum Msg {
	ChangeCount,
	ChangeSeparator,
	Generate,
}

let wl: ReturnType<typeof fetchWordList>
let idleCallbackSupported, rIC, cIC

async function fetchWordList(): Promise<Record<string, string>> {
	let res = await fetch("/wl-2016.json")
	assert(res.ok)
	let wl = res.json()
	return wl
}

export function useGenerate() {
	let handle: ReturnType<typeof requestIdleCallback>
	let [state, setState] = createSignal<State>("empty")
	let [copyState, setCopyState] = createSignal<CopyState>("idle")
	let [phraseCount, setPhraseCount] = createSignal(PHRASE_COUNT_FALLBACK)
	let [separatorKind, setSeparatorKind] = createSignal(SEPARATOR_FALLBACK)
	let [separators, setSeparators] = createSignal<ReadonlyArray<string>>([])
	let [phrases, setPhrases] = createSignal<ReadonlyArray<string>>([])

	onMount(async function setInitialStateFromURL() {
		let cfg = parse_qs_to_phrase_config(globalThis.location.search)

		batch(() => {
			setSeparatorKind(cfg.sep)
			setPhraseCount(cfg.count)
		})
	})

	async function handleEvent(kind: Msg, ogEvent: Event) {
		let value = (ogEvent.target as HTMLInputElement).value
		switch (kind) {
			case Msg.ChangeCount: {
				setPhraseCount(parse_count_val(value))
				break
			}
			case Msg.ChangeSeparator: {
				setSeparatorKind(value)
				break
			}
		}

		// Cache the promise to fetch only one time
		let wordList = await (wl ||= fetchWordList())
		batch(() => {
			setSeparators(make_separators(separatorKind(), phraseCount()))
			setPhrases(make_phrases(phraseCount(), wordList))
		})

		setState("with-output")

		idleCallbackSupported ||= "requestIdleCallback" in globalThis
		rIC ||= idleCallbackSupported ? requestIdleCallback : requestAnimationFrame
		cIC ||= idleCallbackSupported ? cancelIdleCallback : cancelAnimationFrame

		if (handle) {
			cIC(handle)
		}

		handle = rIC(() => {
			let url = new URL(globalThis.location as unknown as string)
			url.searchParams.set(PHRASE_COUNT_KEY, `${phraseCount()}`)
			url.searchParams.set(SEPARATOR_KEY, separatorKind())

			history.pushState({}, "", url)
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
			await navigator.clipboard.writeText(
				combine_zip(
					phrases() as Array<string>,
					separators() as Array<string>,
				).join(""),
			)
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
			e.preventDefault()
			handleEvent(Msg.Generate, e)
		},
	}
}

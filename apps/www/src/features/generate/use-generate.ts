import {
	make_phrases,
	make_separators,
	parse_qs_to_phrase_config,
	PHRASE_COUNT_KEY,
	SEPARATOR_KEY,
} from "gen-utils"
import {
	batch,
	createEffect,
	createResource,
	createSignal,
	onMount,
} from "solid-js"

import { assert } from "../../lib/assert"

type Msg =
	| { type: "COPY_PHRASE" }
	| { type: "GENERATE" }
	| { type: "SET_COUNT"; value: number }
	| { type: "SET_SEP"; value: string }

type State = "empty" | "idle-with-output"

type CopyState = "idle" | "copying" | "copied"

async function fetchWordList(): Promise<Record<string, string>> {
	let res = await fetch("/wl-2016.json")
	assert(res.ok)
	let wl = res.json()
	return wl
}

export function useGenerate() {
	let [resourceKey, setResourceKey] = createSignal<string>()
	let [wlResource] = createResource(resourceKey, fetchWordList)
	let [state, setState] = createSignal<State>("empty")
	let [copyState, setCopyState] = createSignal<CopyState>("idle")
	let [c, sC] = createSignal(0)
	let [phraseCount, setPhraseCount] = createSignal(8)
	let [separatorKind, setSeparatorKind] = createSignal("random")
	let [separators, setSeparators] = createSignal<Array<string>>([])
	let [phrases, setPhrases] = createSignal<Array<string>>([])

	onMount(function setInitialStateFromURL() {
		let cfg = parse_qs_to_phrase_config(globalThis.location?.search)

		batch(() => {
			setSeparatorKind(cfg.sep)
			setPhraseCount(cfg.count)
		})
	})

	createEffect(() => {
		if (wlResource()) {
			batch(() => {
				c() // Need to also track when "generate" is pressed
				setSeparators(make_separators(separatorKind(), phraseCount()))
				setPhrases(make_phrases(phraseCount(), wlResource()))
				syncFormToURL()
				setState("idle-with-output")
			})
		}
	})

	function syncFormToURL() {
		const url = new URL(globalThis.location as unknown as string)
		url.searchParams.set(PHRASE_COUNT_KEY, `${phraseCount()}`)
		url.searchParams.set(SEPARATOR_KEY, separatorKind())

		history.pushState({}, "", url)
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
		async handleCopy() {
			setCopyState("copying")
			let m = await import("./copy").then((m) => m.copyPhraseToClipboard)

			await m(phrases(), separators())
			setCopyState("copied")
			setCopyState("idle")
		},
		send(msg: Msg) {
			// On first message, begin fetching the wordlist
			if (state() === "empty") {
				setResourceKey("wl-2016")
			}

			switch (msg.type) {
				case "SET_COUNT":
					setPhraseCount(msg.value)
					break

				case "SET_SEP":
					setSeparatorKind(msg.value)
					break

				case "GENERATE":
					sC((c) => c + 1)
					break
			}
		},
	}
}

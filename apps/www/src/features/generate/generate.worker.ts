import { batch, createSignal } from "solid-js"
import { handleActions } from "@ct/tworker"
import {
	make_phrases,
	make_separators,
	parse_count_val,
	parse_qs_to_phrase_config,
	PHRASE_COUNT_FALLBACK,
	SEPARATOR_FALLBACK,
} from "gen-utils"
import { assert } from "../../lib/assert"

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

let [phraseCount, setPhraseCount] = createSignal(PHRASE_COUNT_FALLBACK)
let [separatorKind, setSeparatorKind] = createSignal(SEPARATOR_FALLBACK)
let [separators, setSeparators] = createSignal<ReadonlyArray<string>>([])
let [phrases, setPhrases] = createSignal<ReadonlyArray<string>>([])

function getWorkerState() {
	return {
		phraseCount: phraseCount(),
		separatorKind: separatorKind(),
		phrases: phrases(),
		separators: separators(),
	}
}

const actions = {
	hydrateInitialStateFromURL(searchURL: string) {
		let cfg = parse_qs_to_phrase_config(searchURL)

		batch(() => {
			setSeparatorKind(cfg.sep)
			setPhraseCount(cfg.count)
		})

		return getWorkerState()
	},
	async handleEvent({ kind, value }: { kind: Msg; value: string }) {
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
		let wordList = await (wl ??= fetchWordList())
		batch(() => {
			setSeparators(make_separators(separatorKind(), phraseCount()))
			setPhrases(make_phrases(phraseCount(), wordList))
		})

		return getWorkerState()
	},
}

export type Actions = typeof actions

handleActions(actions)

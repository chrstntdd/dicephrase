import { batch, signal } from "@preact/signals-core"
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
import { ChangeCount, ChangeSeparator, Msg } from "./types"

async function fetchWordList(): Promise<Record<string, string>> {
	let res = await fetch("/wl-2016.json")
	assert(res.ok)
	let wl = res.json()
	return wl
}

let wl: ReturnType<typeof fetchWordList>

let phraseCount = signal(PHRASE_COUNT_FALLBACK)
let separatorKind = signal(SEPARATOR_FALLBACK)
let separators = signal<ReadonlyArray<string>>([])
let phrases = signal<ReadonlyArray<string>>([])

function getWorkerState() {
	return {
		phraseCount: phraseCount.value,
		separatorKind: separatorKind.value,
		phrases: phrases.value,
		separators: separators.value,
	}
}

const actions = {
	hydrateInitialStateFromURL(searchURL: string) {
		let cfg = parse_qs_to_phrase_config(searchURL)

		batch(() => {
			separatorKind.value = cfg.sep
			phraseCount.value = cfg.count
		})

		return getWorkerState()
	},
	async handleEvent({ kind, value }: { kind: Msg; value: string }) {
		switch (kind) {
			case ChangeCount: {
				phraseCount.value = parse_count_val(value)
				break
			}
			case ChangeSeparator: {
				separatorKind.value = value
				break
			}
		}

		// Cache the promise to fetch only one time
		let wordList = await (wl ??= fetchWordList())
		batch(() => {
			separators.value = make_separators(separatorKind.value, phraseCount.value)
			phrases.value = make_phrases(phraseCount.value, wordList)
		})

		return getWorkerState()
	},
}

export type Actions = typeof actions

handleActions(actions)

import { batch, createSignal, onMount } from "solid-js"
import { PHRASE_COUNT_KEY, SEPARATOR_KEY } from "gen-utils"
import { makeWorker } from "@ct/tworker"

import type { Actions } from "./generate.worker"

let generateWorker = makeWorker<Actions>(() =>
	// prettier-ignore
	import.meta.env.SSR
		? ({} as unknown as Worker)
		: new Worker(new URL("./generate.worker.ts", import.meta.url), {type: "module"}),
)

type State = "empty" | "with-output"

type CopyState = "idle" | "copying" | "copied"

const enum Msg {
	ChangeCount,
	ChangeSeparator,
	Generate,
}

let copy: typeof import("./copy")["copyPhraseToClipboard"] | undefined

export function useGenerate() {
	let handle: ReturnType<typeof requestIdleCallback>
	let [state, setState] = createSignal<State>("empty")
	let [copyState, setCopyState] = createSignal<CopyState>("idle")
	let [phraseCount, setPhraseCount] = createSignal()
	let [separatorKind, setSeparatorKind] = createSignal()
	let [separators, setSeparators] = createSignal<ReadonlyArray<string>>([])
	let [phrases, setPhrases] = createSignal<ReadonlyArray<string>>([])

	onMount(async function setInitialStateFromURL() {
		let workerState = await generateWorker.run(
			"hydrateInitialStateFromURL",
			globalThis.location?.search,
		)
		batch(() => {
			setSeparatorKind(workerState.separatorKind)
			setPhraseCount(workerState.phraseCount)
			setSeparators(workerState.separators)
			setPhrases(workerState.phrases)
		})
	})

	async function handleEvent(kind: Msg, ogEvent: Event) {
		let nextState = await generateWorker.run("handleEvent", {
			// @ts-expect-error Close enough
			kind,
			value: (ogEvent.target as HTMLInputElement).value,
		})

		setState("with-output")
		batch(() => {
			setSeparatorKind(nextState.separatorKind)
			setPhraseCount(nextState.phraseCount)
			setSeparators(nextState.separators)
			setPhrases(nextState.phrases)
		})

		if (handle) {
			cancelIdleCallback(handle)
		}

		handle = requestIdleCallback(() => {
			let url = new URL(globalThis.location as unknown as string)
			url.searchParams.set(PHRASE_COUNT_KEY, `${nextState.phraseCount}`)
			url.searchParams.set(SEPARATOR_KEY, nextState.separatorKind)

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
			copy ||= await import("./copy").then((m) => m.copyPhraseToClipboard)

			// @ts-expect-error It'll be here, i promise
			await copy(phrases(), separators())
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

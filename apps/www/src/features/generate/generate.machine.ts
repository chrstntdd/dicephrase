import { createMachine, assign, send } from "xstate"

import {
	parse_qs_to_phrase_config,
	make_phrases,
	make_separators,
	PHRASE_COUNT_KEY,
	SEPARATOR_KEY,
} from "gen-utils"

import { assert } from "../../lib/assert"

type Ctx = {
	ab?: AbortController
	attemptCount: number
	count: number
	phrases?: string[]
	separatorKind: string
	separators?: string[]
}

type Msg =
	| { type: "COPY_PHRASE" }
	| { type: "GENERATE" }
	| { type: "GENERATE_OK" }
	| { type: "GENERATE_ERR" }
	| { type: "SET_COUNT"; value: number }
	| { type: "SET_SEP"; value: string }

type Svc = {
	fetchWordList: { data: Record<string, string> }
	copyToClipboard: { data: void }
}

let wlRecord: Record<string, string> | undefined

let generateMachine = createMachine(
	{
		id: "dice-gen",
		tsTypes: {} as import("./generate.machine.typegen").Typegen0,
		schema: {
			context: {} as Ctx,
			events: {} as Msg,
			services: {} as Svc,
		},
		context: {
			attemptCount: 0,
			count: 8,
			separatorKind: "random",
		},
		entry: "assignParamsFromQueryString",
		type: "parallel",
		states: {
			ui: {
				initial: "empty",
				on: {
					GENERATE_ERR: ".error",
				},
				states: {
					empty: {
						on: {
							GENERATE_OK: "has_output",
						},
					},
					has_output: {
						on: { COPY_PHRASE: ".copying" },
						initial: "idle",
						states: {
							idle: {},
							copying: {
								invoke: {
									id: "copyToClipboard",
									src: "copyToClipboard",
									onDone: "idle",
									onError: "idle",
								},
							},
						},
					},
					error: {},
				},
			},

			generating: {
				initial: "idle",
				exit: "cancelPending",
				on: {
					/* external transitions to trigger the exit action above */
					GENERATE: { target: "generating.debouncing" },
					SET_COUNT: {
						target: "generating.debouncing",
						actions: "assignCount",
					},
					SET_SEP: {
						target: "generating.debouncing",
						actions: "assignSep",
					},
				},
				states: {
					idle: {},
					debouncing: {
						after: {
							100: [
								{ cond: "needsToFetchWl", target: "fetching_wl" },
								{ target: "combining" },
							],
						},
					},
					fetching_wl: {
						entry: "assignAb",
						invoke: {
							id: "fetchWordList",
							src: "fetchWordList",
							onDone: {
								target: "combining",
								actions: "assignWordList",
							},
							onError: [
								{ cond: "shouldRetry", target: "retrying" },
								{ target: "idle", actions: "notifyGenerationError" },
							],
						},
					},
					retrying: {
						after: {
							REQUEST_BACK_OFF_DELAY: {
								target: "fetching_wl",
								actions: "incrementRetry",
							},
						},
					},
					combining: {
						always: {
							target: "idle",
							actions: [
								"assignGeneratedPhrases",
								"syncToUrl",
								"resetRetries",
								"notifyGenerationSuccess",
							],
						},
					},
				},
			},
		},
	},
	{
		actions: {
			// Run assign to module variable with assign function form xstate but don't use ctx
			// Timing doesn't align when using a plain function with downstream asserts
			assignWordList: assign((ctx, event) => {
				wlRecord = event.data
				return ctx
			}),
			resetRetries: assign({ attemptCount: (_) => 0 }),
			assignParamsFromQueryString: assign((ctx) => {
				let x = parse_qs_to_phrase_config(globalThis.location?.search)
				return {
					...ctx,
					separatorKind: x.sep,
					count: x.count,
				}
			}),
			assignGeneratedPhrases: assign((ctx) => {
				assert(wlRecord)
				return {
					...ctx,
					separators: make_separators(ctx.separatorKind, ctx.count),
					phrases: make_phrases(ctx.count, wlRecord),
				}
			}),
			cancelPending: assign({
				ab: (ctx) => {
					ctx.ab?.abort()
					return ctx.ab
				},
			}),

			assignCount: assign({ count: (_, e) => e.value }),
			assignSep: assign({ separatorKind: (_, e) => e.value }),
			assignAb: assign({ ab: (_) => new AbortController() }),
			incrementRetry: assign({ attemptCount: (ctx) => ctx.attemptCount + 1 }),

			syncToUrl: (ctx) => {
				const url = new URL(globalThis.location as unknown as string)
				url.searchParams.set(PHRASE_COUNT_KEY, `${ctx.count}`)
				url.searchParams.set(SEPARATOR_KEY, ctx.separatorKind)

				history.pushState({}, "", url)
			},
			notifyGenerationSuccess: send("GENERATE_OK"),
			notifyGenerationError: send("GENERATE_ERROR"),
		},
		guards: {
			needsToFetchWl: () => !wlRecord,
			shouldRetry: (ctx) => ctx.attemptCount < 7,
		},
		services: {
			async fetchWordList(ctx) {
				let res = await fetch("/wl-2016.json", {
					signal: (ctx.ab as NonNullable<typeof ctx.ab>).signal,
				})
				assert(res.ok)
				return await res.json()
			},
			async copyToClipboard(ctx) {
				let m = await import("./copy").then((m) => m.copyPhraseToClipboard)
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				await m(ctx.phrases!, ctx.separators!)
			},
		},
		delays: {
			REQUEST_BACK_OFF_DELAY: (ctx) => {
				// From: https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
				const CAP = 2000
				const BASE = 10

				return randomBetween(0, Math.min(CAP, BASE * 2 ** ctx.attemptCount))
			},
		},
	},
)

function randomBetween(min: number, max: number) {
	return Math.random() * (max - min) + min
}

export { generateMachine }

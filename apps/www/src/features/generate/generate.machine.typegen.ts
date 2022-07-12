// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	"@@xstate/typegen": true
	eventsCausingActions: {
		assignParamsFromQueryString: ""
		assignCount: "SET_COUNT"
		assignSep: "SET_SEP"
		assignWordList: "done.invoke.fetchWordList"
		incrementRetry: "xstate.after(REQUEST_BACK_OFF_DELAY)#dice-gen.generating.retrying"
		cancelPending: "xstate.init"
		assignAb:
			| "xstate.after(100)#dice-gen.generating.debouncing"
			| "xstate.after(REQUEST_BACK_OFF_DELAY)#dice-gen.generating.retrying"
		resetRetries:
			| "error.platform.fetchWordList"
			| "xstate.after(100)#dice-gen.generating.debouncing"
			| "done.invoke.fetchWordList"
		assignGeneratedPhrases:
			| "xstate.after(100)#dice-gen.generating.debouncing"
			| "done.invoke.fetchWordList"
		syncToUrl:
			| "xstate.after(100)#dice-gen.generating.debouncing"
			| "done.invoke.fetchWordList"
	}
	internalEvents: {
		"": { type: "" }
		"done.invoke.fetchWordList": {
			type: "done.invoke.fetchWordList"
			data: unknown
			__tip: "See the XState TS docs to learn how to strongly type this."
		}
		"xstate.after(REQUEST_BACK_OFF_DELAY)#dice-gen.generating.retrying": {
			type: "xstate.after(REQUEST_BACK_OFF_DELAY)#dice-gen.generating.retrying"
		}
		"xstate.after(100)#dice-gen.generating.debouncing": {
			type: "xstate.after(100)#dice-gen.generating.debouncing"
		}
		"error.platform.fetchWordList": {
			type: "error.platform.fetchWordList"
			data: unknown
		}
		"xstate.init": { type: "xstate.init" }
		"done.invoke.copyToClipboard": {
			type: "done.invoke.copyToClipboard"
			data: unknown
			__tip: "See the XState TS docs to learn how to strongly type this."
		}
		"error.platform.copyToClipboard": {
			type: "error.platform.copyToClipboard"
			data: unknown
		}
	}
	invokeSrcNameMap: {
		copyToClipboard: "done.invoke.copyToClipboard"
		fetchWordList: "done.invoke.fetchWordList"
	}
	missingImplementations: {
		actions: never
		services: never
		guards: never
		delays: never
	}
	eventsCausingServices: {
		copyToClipboard: "COPY_PHRASE"
		fetchWordList:
			| "xstate.after(100)#dice-gen.generating.debouncing"
			| "xstate.after(REQUEST_BACK_OFF_DELAY)#dice-gen.generating.retrying"
	}
	eventsCausingGuards: {
		needsToFetchWl: "xstate.after(100)#dice-gen.generating.debouncing"
		shouldRetry: "error.platform.fetchWordList"
	}
	eventsCausingDelays: {
		REQUEST_BACK_OFF_DELAY: "xstate.init"
	}
	matchesStates:
		| "syncing_from_url"
		| "empty"
		| "idle"
		| "idle.idle"
		| "idle.copying"
		| "generating"
		| "generating.debouncing"
		| "generating.fetching_wl"
		| "generating.retrying"
		| "generating.error"
		| "generating.combining"
		| {
				idle?: "idle" | "copying"
				generating?:
					| "debouncing"
					| "fetching_wl"
					| "retrying"
					| "error"
					| "combining"
		  }
	tags: never
}

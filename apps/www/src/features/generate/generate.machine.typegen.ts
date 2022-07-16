// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	"@@xstate/typegen": true
	eventsCausingActions: {
		assignCount: "SET_COUNT"
		assignSep: "SET_SEP"
		assignWordList: "done.invoke.fetchWordList"
		notifyGenerationError: "error.platform.fetchWordList"
		incrementRetry: "xstate.after(REQUEST_BACK_OFF_DELAY)#dice-gen.generating.retrying"
		assignGeneratedPhrases: ""
		syncToUrl: ""
		resetRetries: ""
		notifyGenerationSuccess: ""
		assignParamsFromQueryString: "xstate.init"
		cancelPending: "xstate.init"
		assignAb:
			| "xstate.after(100)#dice-gen.generating.debouncing"
			| "xstate.after(REQUEST_BACK_OFF_DELAY)#dice-gen.generating.retrying"
	}
	internalEvents: {
		"done.invoke.fetchWordList": {
			type: "done.invoke.fetchWordList"
			data: unknown
			__tip: "See the XState TS docs to learn how to strongly type this."
		}
		"error.platform.fetchWordList": {
			type: "error.platform.fetchWordList"
			data: unknown
		}
		"xstate.after(REQUEST_BACK_OFF_DELAY)#dice-gen.generating.retrying": {
			type: "xstate.after(REQUEST_BACK_OFF_DELAY)#dice-gen.generating.retrying"
		}
		"": { type: "" }
		"xstate.after(100)#dice-gen.generating.debouncing": {
			type: "xstate.after(100)#dice-gen.generating.debouncing"
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
		| "ui"
		| "ui.empty"
		| "ui.has_output"
		| "ui.has_output.idle"
		| "ui.has_output.copying"
		| "ui.error"
		| "generating"
		| "generating.idle"
		| "generating.debouncing"
		| "generating.fetching_wl"
		| "generating.retrying"
		| "generating.combining"
		| {
				ui?:
					| "empty"
					| "has_output"
					| "error"
					| { has_output?: "idle" | "copying" }
				generating?:
					| "idle"
					| "debouncing"
					| "fetching_wl"
					| "retrying"
					| "combining"
		  }
	tags: never
}

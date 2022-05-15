import { createMachine, assign } from "xstate"

import {
  parse_qs_to_phrase_config,
  make_phrases,
  make_separators,
  PHRASE_COUNT_KEY,
  SEPARATOR_KEY
} from "gen-utils"

import { assert } from "../../lib/assert"

import { fetchWordList, retryDelay } from "./shared"

type Ctx = {
  ab?: AbortController
  attemptCount: number
  count: number
  phrases?: string[]
  separatorKind: string
  separators?: string[]
  wlRecord?: Record<string, string>
}

type Msg =
  | { type: "COPY_PHRASE" }
  | { type: "GENERATE" }
  | { type: "SET_COUNT"; value: number }
  | { type: "SET_SEP"; value: string }

type Svc = {
  fetchWordList: {
    data: Record<string, string>
  }
}

let generateMachine = createMachine(
  {
    id: "dice-gen",
    initial: "syncing_from_url",
    tsTypes: {} as import("./generate.machine.typegen").Typegen0,
    schema: {
      context: {} as Ctx,
      events: {} as Msg,
      services: {} as Svc
    },
    context: {
      attemptCount: 0,
      count: 8,
      separatorKind: "random"
    },
    states: {
      syncing_from_url: {
        always: { target: "empty", actions: "assignParamsFromQueryString" }
      },
      empty: {
        on: {
          GENERATE: "generating",
          SET_COUNT: { target: "generating", actions: "assignCount" },
          SET_SEP: { target: "generating", actions: "assignSep" }
        }
      },
      idle: {
        on: {
          GENERATE: "generating",
          SET_COUNT: { target: "generating", actions: "assignCount" },
          SET_SEP: { target: "generating", actions: "assignSep" }
        },
        initial: "idle",
        states: {
          idle: {
            on: { COPY_PHRASE: "copying" }
          },
          copying: {
            invoke: {
              id: "copyToClipboard",
              src: "copyToClipboard",
              onDone: "idle",
              onError: "idle"
            }
          }
        }
      },

      generating: {
        initial: "debouncing",
        onDone: "idle",
        // Handles exit+re-entry when new messages come in that interrupt the work
        // and reset the progress
        exit: "cancelPending",
        on: {
          GENERATE: "generating",
          SET_COUNT: {
            target: "generating",
            actions: "assignCount"
          },
          SET_SEP: {
            target: "generating",
            actions: "assignSep"
          }
        },
        states: {
          debouncing: {
            after: {
              100: [
                { cond: "needsToFetchWl", target: "fetching_wl" },
                { target: "combining" }
              ]
            }
          },
          fetching_wl: {
            entry: "assignAb",
            invoke: {
              id: "fetchWordList",
              src: "fetchWordList",
              onDone: {
                target: "combining",
                actions: "assignWordList"
              },
              onError: [
                { cond: "shouldRetry", target: "retrying" },
                { target: "error" }
              ]
            }
          },
          retrying: {
            after: {
              REQUEST_BACK_OFF_DELAY: {
                target: "fetching_wl",
                actions: "incrementRetry"
              }
            }
          },
          error: { entry: "resetRetries" },
          combining: {
            type: "final",
            exit: ["assignGeneratedPhrases", "syncToUrl", "resetRetries"]
          }
        }
      }
    }
  },
  {
    actions: {
      assignWordList: assign({ wlRecord: (_, event) => event.data }),
      resetRetries: assign({ attemptCount: (_) => 0 }),
      assignParamsFromQueryString: assign((ctx) => {
        let x = parse_qs_to_phrase_config(globalThis.location?.search)
        return {
          ...ctx,
          separatorKind: x.sep,
          count: x.count
        }
      }),
      assignGeneratedPhrases: assign((ctx) => {
        assert(ctx.wlRecord)
        return {
          ...ctx,
          separators: make_separators(ctx.separatorKind, ctx.count),
          phrases: make_phrases(ctx.count, ctx.wlRecord)
        }
      }),
      cancelPending: assign({
        ab: (ctx) => {
          ctx.ab?.abort()
          return ctx.ab
        }
      }),

      assignCount: assign({ count: (_, e) => e.value }),
      assignSep: assign({ separatorKind: (_, e) => e.value }),
      assignAb: assign({ ab: (_) => new AbortController() }),
      incrementRetry: assign({ attemptCount: (ctx) => ctx.attemptCount + 1 }),

      syncToUrl: (ctx) => {
        const url = new URL(globalThis.location as unknown as string)
        url.searchParams.set(PHRASE_COUNT_KEY, "" + ctx.count)
        url.searchParams.set(SEPARATOR_KEY, ctx.separatorKind)

        history.pushState({}, "", url)
      }
    },
    guards: {
      needsToFetchWl: (ctx) => !ctx.wlRecord,
      shouldRetry: (ctx) => ctx.attemptCount < 7
    },
    services: {
      fetchWordList,
      copyToClipboard: async (ctx) => {
        let m = await import("./copy").then((m) => m.copyPhraseToClipboard)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await m(ctx.phrases!, ctx.separators!)
      }
    },
    delays: {
      REQUEST_BACK_OFF_DELAY: retryDelay
    }
  }
)

export { generateMachine }

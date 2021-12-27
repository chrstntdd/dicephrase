import { assign } from "xstate"
import { createModel } from "xstate/lib/model"

import {
  copyPhraseToClipboard,
  fetchWordList,
  makePhrases,
  makeSeparators,
  msgWithoutPayload,
  retryDelay
} from "./shared"

let mod = createModel(
  {
    count: 8,
    separatorKind: "random",
    separators: undefined as unknown as string[],
    phrases: undefined as unknown as string[],
    ab: undefined as AbortController | undefined,
    attemptCount: 0,
    wlRecord: undefined as unknown as Record<string, string>
  },
  {
    events: {
      GENERATE: msgWithoutPayload,
      SET_COUNT: (value: number) => ({ value }),
      SET_SEP: (value: string) => ({ value }),
      COPY_PHRASE: msgWithoutPayload
    }
  }
)

/**
 * @description Defining actions here instead of the machine config to keep type safety
 *
 * @see https://github.com/statelyai/xstate/issues/2886
 */
let assignCount = mod.assign({ count: (_, e) => e.value }, "SET_COUNT")
let assignSep = mod.assign({ separatorKind: (_, e) => e.value }, "SET_SEP")
let assignAb = mod.assign({ ab: (_) => new AbortController() })
let incrementRetry = mod.assign({ attemptCount: (ctx) => ctx.attemptCount + 1 })
let cancelPending = mod.assign({
  ab: (ctx) => {
    ctx.ab?.abort()
    return ctx.ab
  }
})
let assignGeneratedPhrases = mod.assign((ctx) => {
  return {
    ...ctx,
    separators: makeSeparators(ctx),
    phrases: makePhrases(ctx)
  }
})

let generateMachine = mod.createMachine(
  {
    id: "dice-gen",
    initial: "empty",
    states: {
      empty: {
        on: {
          GENERATE: "generating",
          SET_COUNT: {
            target: "generating",
            actions: [assignCount]
          },
          SET_SEP: {
            target: "generating",
            actions: [assignSep]
          }
        }
      },
      idle: {
        on: {
          GENERATE: "generating",
          SET_COUNT: {
            target: "generating",
            actions: [assignCount]
          },
          SET_SEP: {
            target: "generating",
            actions: [assignSep]
          },
          COPY_PHRASE: "copying"
        }
      },

      generating: {
        initial: "debouncing",
        onDone: "idle",
        // Handles exit+re-entry when new messages come in that interrupt the work
        // and reset the progress
        exit: [cancelPending],
        on: {
          GENERATE: {
            target: "generating",
            internal: false
          },
          SET_COUNT: {
            target: "generating",
            internal: false,
            actions: [assignCount]
          },
          SET_SEP: {
            target: "generating",
            internal: false,
            actions: [assignSep]
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
            entry: assignAb,
            invoke: {
              src: "fetchWordList",
              onDone: {
                target: "combining",
                /* TODO: Figure out if we can use regular assign here */
                actions: [assign({ wlRecord: (_, event) => event.data })]
              },
              onError: [
                {
                  cond: (ctx) => ctx.attemptCount < 7,
                  target: "retrying"
                },
                { target: "error" }
              ]
            }
          },
          retrying: {
            after: {
              REQUEST_BACK_OFF_DELAY: {
                target: "fetching_wl",
                actions: [incrementRetry]
              }
            }
          },
          error: {},
          combining: { type: "final", exit: assignGeneratedPhrases }
        }
      },
      copying: {
        invoke: {
          src: copyPhraseToClipboard,
          onDone: "idle",
          // TODO: maybe notify?
          onError: "idle"
        }
      }
    }
  },
  {
    guards: {
      needsToFetchWl: (ctx) => !ctx.wlRecord
    },
    services: {
      fetchWordList
    },
    delays: {
      REQUEST_BACK_OFF_DELAY: retryDelay
    }
  }
)

export { generateMachine }

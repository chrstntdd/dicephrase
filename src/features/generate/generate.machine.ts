import { assign } from "xstate"
import { createModel } from "xstate/lib/model.js"
import type { ModelContextFrom } from "xstate/lib/model.types"

import { parseParamsToPhraseConfig } from "../../lib/decoders"
import { PHRASE_COUNT_KEY, SEPARATOR_KEY } from "./constants"

import {
  fetchWordList,
  makePhrases,
  makeSeparators,
  msgWithoutPayload,
  PHRASE_OUTPUT,
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
      COPY_PHRASE: msgWithoutPayload,
      FOCUS_OUTPUT: msgWithoutPayload,
      BLUR_OUTPUT: msgWithoutPayload
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
let assignParamsFromQueryString = mod.assign((ctx) => {
  let x = parseParamsToPhraseConfig(globalThis.location?.search)
  return {
    ...ctx,
    separatorKind: x.sep,
    count: x.count
  }
})
function syncToUrl(ctx: ModelContextFrom<typeof mod>) {
  const url = new URL(globalThis.location as unknown as string)
  url.searchParams.set(PHRASE_COUNT_KEY, "" + ctx.count)
  url.searchParams.set(SEPARATOR_KEY, ctx.separatorKind)

  history.pushState(msgWithoutPayload(), "", url)
}

let generateMachine = mod.createMachine(
  {
    id: "dice-gen",
    initial: "syncing_from_url",
    states: {
      syncing_from_url: {
        always: {
          actions: assignParamsFromQueryString,
          target: "empty"
        }
      },
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
        type: "parallel",
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
        },
        states: {
          main: {},
          phrase_output: PHRASE_OUTPUT
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
          combining: {
            type: "final",
            exit: [assignGeneratedPhrases, syncToUrl]
          }
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

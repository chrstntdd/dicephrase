import { assign } from "xstate"
import { createModel } from "xstate/lib/model"

import { parseParamsToPhraseConfig } from "../../lib/decoders"

import {
  fetchWordList,
  makePhrases,
  makeSeparators,
  msgWithoutPayload,
  retryDelay,
  shouldRetry,
  PHRASE_OUTPUT
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
      CANCEL: msgWithoutPayload,
      HYDRATE_FROM_URL_PARAMS: (value: string) => ({ value }),
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

let assignParamsFromURL = mod.assign((ctx, event) => {
  let x = parseParamsToPhraseConfig(event.value)
  return {
    ...ctx,
    separatorKind: x.sep,
    count: x.count
  }
}, "HYDRATE_FROM_URL_PARAMS")

let simpleGenerateMachine = mod.createMachine(
  {
    id: "dice-gen-simple",
    initial: "configuring",
    states: {
      configuring: {
        on: {
          HYDRATE_FROM_URL_PARAMS: {
            actions: assignParamsFromURL,
            target: "generating"
          }
        }
      },
      idle: {
        type: "parallel",
        states: {
          main: {},
          phrase_output: PHRASE_OUTPUT
        }
      },
      generating: {
        initial: "fetching_wl",
        onDone: "idle",
        // Handles exit+re-entry when new messages come in that interrupt the work
        // and reset the progress
        exit: [cancelPending],

        states: {
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
                { cond: shouldRetry, target: "retrying" },
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
      }
    }
  },
  {
    services: {
      fetchWordList
    },
    delays: {
      REQUEST_BACK_OFF_DELAY: retryDelay
    }
  }
)

export { simpleGenerateMachine }

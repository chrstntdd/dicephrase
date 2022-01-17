import type { ContextFrom } from "xstate"
import { assert } from "../../lib/assert"
import { setStatus } from "../../lib/a11y/aria-live-msg"
import type { generateMachine } from "./generate.machine"
import type { simpleGenerateMachine } from "./generate-simple.machine"

import { make_wl_keys, shuffle } from "gen-utils"

export function msgWithoutPayload(): Record<string, never> {
  return Object.create(null)
}

export const RANDOM_SEPARATOR_OPTS = [
  "~",
  "-",
  "_",
  "!",
  "@",
  "$",
  "^",
  "&",
  "*",
  ".",
  ",",
  "\u00a0"
]

export function retryDelay(ctx: { attemptCount: number }) {
  // From: https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
  const CAP = 2000
  const BASE = 10

  return randomBetween(0, Math.min(CAP, BASE * 2 ** ctx.attemptCount))
}

export async function fetchWordList(ctx: { ab?: AbortController }) {
  const r = await fetch("/wl-2016.json", {
    signal: (ctx.ab as NonNullable<typeof ctx.ab>).signal
  })
  assert(r.ok)
  return await r.json()
}

export function shouldRetry(ctx: { attemptCount: number }): boolean {
  return ctx.attemptCount < 7
}

export function makePhrases(ctx: {
  count: number
  wlRecord: Record<string, string>
}): string[] {
  let keys = make_wl_keys(ctx.count, (b) => crypto.getRandomValues(b))
  let phrases = new Array<string>(keys.length)

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    phrases[index] = ctx.wlRecord[key]
  }

  return phrases
}
export function makeSeparators(ctx: {
  separatorKind: string
  count: number
}): string[] {
  let sepCount = ctx.count - 1
  let makeRandom = ctx.separatorKind === "random"
  let separators: string[]

  if (makeRandom) {
    separators = []
    while (separators.length < sepCount) {
      separators.push(shuffle([...RANDOM_SEPARATOR_OPTS])[0])
    }
  } else {
    separators = new Array(sepCount).fill(ctx.separatorKind)
  }

  return separators
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export const PHRASE_OUTPUT = {
  initial: "unfocused",
  states: {
    unfocused: {
      on: {
        FOCUS_OUTPUT: "focused"
      }
    },
    focused: {
      initial: "idle",
      on: {
        BLUR_OUTPUT: "unfocused"
      },
      entry: [
        () => {
          setStatus("Copy to clipboard")
        }
      ],
      states: {
        idle: {
          on: { COPY_PHRASE: "copying" }
        },
        copying: {
          invoke: {
            src: async (
              ctx: ContextFrom<
                typeof generateMachine | typeof simpleGenerateMachine
              >
            ) => {
              let m = await import("./copy").then(
                (m) => m.copyPhraseToClipboard
              )
              return m(ctx)
            },
            onDone: "copied",
            onError: "idle"
          }
        },
        copied: {
          entry: [
            () => {
              setStatus("Copied to clipboard")
            }
          ],
          after: { 4000: "hidden" }
        },
        hidden: {
          on: { COPY_PHRASE: "copying" }
        }
      }
    }
  }
}

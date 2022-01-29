import { assert } from "../../lib/assert"

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

export async function fetchWordList(ctx: {
  ab?: AbortController
}): Promise<Record<string, string>> {
  const r = await fetch("/wl-2016.json", {
    signal: (ctx.ab as NonNullable<typeof ctx.ab>).signal
  })
  assert(r.ok)
  return await r.json()
}

export function shouldRetry(ctx: { attemptCount: number }): boolean {
  return ctx.attemptCount < 7
}

export function makePhrases(
  count: number,
  wlRecord: Record<string, string>
): string[] {
  let keys = make_wl_keys(count, (b) => crypto.getRandomValues(b))
  let phrases = new Array<string>(keys.length)

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    phrases[index] = wlRecord[key]
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

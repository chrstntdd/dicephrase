import { assert } from "../../lib/assert"

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

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

import { useCallback, useEffect, useRef, useState } from "react"

import { assert } from "./assert"
import { copyTextToClipboard } from "./clippy"
import { parseParamsToPhraseConfig } from "./decoders"
import { shuffle } from "./shuffle"
import { make_wl_keys } from "./WordList.bs.js"

const RANDOM_SEPARATOR_OPTS = [
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

function usePassphrase() {
  let aborter = useRef<AbortController>()
  let cancelled = useRef(false)
  let abort = () => aborter.current?.abort()

  let [phrases, setPhrases] = useState<string[]>()
  let [separators, setSeparators] = useState<string[]>()

  let generate = useCallback(function generate(
    x: Parameters<typeof parseParamsToPhraseConfig>[0]
  ) {
    let params = parseParamsToPhraseConfig(x)
    let ab = new AbortController()
    aborter.current = ab

    // TODO: Consider caching this, as a progressive enhancement
    // for folks who don't get have service worker.
    fetch("/wl-2016.json", { signal: ab.signal }).then((r) => {
      if (cancelled.current) {
        abort()
        return
      }

      assert(r.ok)

      return r.json().then((d) => {
        if (cancelled.current) return

        let keys = make_wl_keys(params.count)

        let phrases = new Array<string>(keys.length)
        for (let index = 0; index < keys.length; index++) {
          const key = keys[index]
          phrases[index] = d[key]
        }

        let sepCount = params.count - 1
        let makeRandom = params.sep === "random"
        let sepChars: string[]

        if (makeRandom) {
          sepChars = []
          while (sepChars.length < sepCount) {
            sepChars.push(shuffle([...RANDOM_SEPARATOR_OPTS])[0])
          }
        } else {
          sepChars = new Array(sepCount).fill(params.sep)
        }

        setSeparators(sepChars)
        setPhrases(phrases)
      })
    })
  },
  [])

  let saveToClipboard = useCallback(
    async function saveToClipboard() {
      assert(phrases)
      assert(separators)
      let pw = combineZip(phrases, separators)
      return copyTextToClipboard(pw.join(""))
    },
    [separators, phrases]
  )

  useEffect(() => {
    return () => {
      cancelled.current = true
    }
  }, [])

  return [
    {
      phrases,
      separators
    },
    { generate, saveToClipboard }
  ] as const
}

function combineZip<T>(a: T[], b: T[]): T[] {
  let c = []

  for (let index = 0; index < a.length; index++) {
    const element = a[index]

    c.push(element)
    let el = b[index]

    if (el) {
      c.push(el)
    }
  }

  return c
}

export { usePassphrase }

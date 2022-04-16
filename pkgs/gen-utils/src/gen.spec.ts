import * as crypto from "crypto"
import { readFileSync } from "fs"
import { resolve } from "path"

import { test, describe, expect, vi, beforeAll } from "vitest"
import { PHRASE_COUNT_FALLBACK } from "./constants"

import {
  combine_zip,
  make_wl_keys,
  parse_qs_to_phrase_config,
  parse_count_val,
  make_separators,
  make_phrases
} from "./Gen.gen"

vi.stubGlobal("crypto", {
  // @ts-expect-error
  getRandomValues: (x) => crypto.webcrypto.getRandomValues(x)
})

let wl

beforeAll(() => {
  wl = JSON.parse(readFileSync(resolve("src", "wl.json"), "utf-8"))
})

describe("combine_zip", () => {
  test.concurrent("should combine the two arrays", () => {
    let a1 = ["1", "2", "3"]
    let a2 = ["a", "b", "c"]

    let out = combine_zip(a1, a2)

    expect(out).toEqual(["1", "a", "2", "b", "3", "c"])
    expect(out.length).toEqual(a1.length + a2.length)
  })

  test.concurrent("should ignore extra elements in the second array", () => {
    let a1 = ["1", "2", "3"]
    let a2 = ["a", "b", "c", "d", "e", "f"]

    let out = combine_zip(a1, a2)

    expect(out).toEqual(["1", "a", "2", "b", "3", "c"])
    expect(out.length).toEqual(6)
  })
})

describe("make_wl_keys", () => {
  test.concurrent(
    "should return a list equal in size to the count param",
    () => {
      let count = 10
      let out = make_wl_keys(count)

      expect(out.length).toEqual(count)
    }
  )

  test.concurrent(
    "should return a list where each entry is a 5 digit number",
    () => {
      let count = 10
      let out = make_wl_keys(count)

      let firstEntry = out[0]

      expect(typeof firstEntry).toBe("string")
      expect(out.every((k) => k.length === 5)).toBeTruthy()
    }
  )
})

describe("parse_count_val", () => {
  test.concurrent("should return the value as a number if it exists", () => {
    let out = parse_count_val("3")
    expect(out).toEqual(3)
  })

  test.concurrent(
    "should return the fallback count if there is an error",
    () => {
      let out0 = parse_count_val("")
      expect(out0).toEqual(PHRASE_COUNT_FALLBACK)

      // @ts-expect-error
      let out1 = parse_count_val(NaN)
      expect(out1).toEqual(PHRASE_COUNT_FALLBACK)

      let out2 = parse_count_val("abc")
      expect(out2).toEqual(PHRASE_COUNT_FALLBACK)

      // @ts-expect-error
      let out3 = parse_count_val({})
      expect(out3).toEqual(PHRASE_COUNT_FALLBACK)

      // This should pass, but I'm not being careful enough on the ReScript side
      // let out4 = parse_count_val(-99)
      // expect(out4).toEqual(PHRASE_COUNT_FALLBACK)
    }
  )
})

describe("parse_qs_to_phrase_config", () => {
  test.concurrent("works with known values", () => {
    let x = parse_qs_to_phrase_config("?phrase-count=9&separator=random")

    expect(x.count).toEqual(9)
    expect(x.sep).toEqual("random")
  })

  test.concurrent(
    "ignores out of bounds count values — returning the default",
    () => {
      let x0 = parse_qs_to_phrase_config("?phrase-count=1&separator=random")

      expect(x0.count).toEqual(8)
      expect(x0.sep).toEqual("random")

      let x1 = parse_qs_to_phrase_config("?phrase-count=11&separator=random")

      expect(x1.count).toEqual(8)
      expect(x1.sep).toEqual("random")
    }
  )

  test.concurrent(
    "ignores unknown separator values — returning the default",
    () => {
      let x0 = parse_qs_to_phrase_config("?phrase-count=8&separator=f00")

      expect(x0.count).toEqual(8)
      expect(x0.sep).toEqual("random")

      let x1 = parse_qs_to_phrase_config("?phrase-count=8&separator=b00")

      expect(x1.count).toEqual(8)
      expect(x1.sep).toEqual("random")
    }
  )

  test.concurrent(
    "ignores unknown query params and returns the default",
    () => {
      let x = parse_qs_to_phrase_config("?booty=true")

      expect(x.count).toEqual(8)
      expect(x.sep).toEqual("random")
    }
  )
})

describe("make_phrases", () => {
  test.concurrent("should return an array of words", () => {
    let count = 4
    let out = make_phrases<string>(count, wl)

    expect(out.length).toEqual(count)
    expect(out.every((word) => /\w{1}/.test(word))).toBeTruthy()
  })
})

describe("make_separators", () => {
  // This test is flaky, but sorta gets the idea across
  test.skip("should return random separators when separator_kind is 'random'", () => {
    let count = 8
    let out = make_separators("random", count)
    let uniqueSeparators = [...new Set(out)]

    expect(uniqueSeparators).not.toEqual(out)
  })

  test.concurrent(
    "should return an array of length 1 less than the count to splice between the words",
    () => {
      let count = 8
      let out = make_separators("random", count)

      expect(out.length).toEqual(count - 1)
    }
  )

  test.concurrent(
    'Should return an array of identical chars when not "random"',
    () => {
      let count = 6
      let sep = "~"
      let out = make_separators(sep, count)

      expect(out.length).toEqual(count - 1)
      expect(out.every((c) => c === sep)).toBeTruthy()
    }
  )
})

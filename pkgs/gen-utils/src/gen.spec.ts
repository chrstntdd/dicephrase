import * as crypto from "crypto"
import { combine_zip, make_wl_keys, parse_qs_to_phrase_config } from "./Gen.gen"

import { test, describe, expect } from "vitest"

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
      // @ts-ignore
      let out = make_wl_keys(count, (x) => crypto.webcrypto.getRandomValues(x))

      expect(out.length).toEqual(count)
    }
  )

  test.concurrent(
    "should return a list where each entry is a 6 digit number",
    () => {
      let count = 10
      // @ts-ignore
      let out = make_wl_keys(count, (x) => crypto.webcrypto.getRandomValues(x))

      let firstEntry = out[0]

      expect(typeof firstEntry).toBe("string")
      expect(out.every((k) => k.length === 6))
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

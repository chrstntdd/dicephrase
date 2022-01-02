import * as crypto from "crypto"
import { combine_zip, make_wl_keys } from "./Gen.gen"

import { test, describe, expect } from "vitest"

describe("combine_zip", () => {
  test("should combine the two arrays", () => {
    let a1 = ["1", "2", "3"]
    let a2 = ["a", "b", "c"]

    let out = combine_zip(a1, a2)

    expect(out).toEqual(["1", "a", "2", "b", "3", "c"])
    expect(out.length).toEqual(a1.length + a2.length)
  })

  test("should ignore extra elements in the second array", () => {
    let a1 = ["1", "2", "3"]
    let a2 = ["a", "b", "c", "d", "e", "f"]

    let out = combine_zip(a1, a2)

    expect(out).toEqual(["1", "a", "2", "b", "3", "c"])
    expect(out.length).toEqual(6)
  })
})

describe("make_wl_keys", () => {
  test("should return a list equal in size to the count param", () => {
    let count = 10
    // @ts-ignore
    let out = make_wl_keys(count, (x) => crypto.webcrypto.getRandomValues(x))

    expect(out.length).toEqual(count)
  })

  test("should return a list where each entry is a 6 digit number", () => {
    let count = 10
    // @ts-ignore
    let out = make_wl_keys(count, (x) => crypto.webcrypto.getRandomValues(x))

    let firstEntry = out[0]

    expect(typeof firstEntry).toBe("string")
    expect(out.every((k) => k.length === 6))
  })
})

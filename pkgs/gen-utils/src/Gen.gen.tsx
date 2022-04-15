/* TypeScript file generated from Gen.res by genType. */
/* eslint-disable import/first */

// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from "rescript/lib/es6/curry.js"
const Curry: any = Curry__Es6Import

// @ts-ignore: Implicit any on import
import * as GenBS__Es6Import from "./Gen.bs"
const GenBS: any = GenBS__Es6Import

// @ts-ignore
import type { Dict_t as Js_Dict_t } from "./Js.gen"

// tslint:disable-next-line:interface-over-type-literal
export type phase_cfg = { readonly count: number; readonly sep: string }

// tslint:disable-next-line:interface-over-type-literal
export type t<a> = a[]

export const make_wl_keys: (count: number) => string[] = GenBS.make_wl_keys

export const shuffle: <T1>(arr: T1[]) => T1[] = GenBS.shuffle

export const combine_zip: <T1>(_1: T1[], _2: T1[]) => T1[] = GenBS.combine_zip

export const parse_qs_to_phrase_config: (qs: string) => phase_cfg =
  GenBS.parse_qs_to_phrase_config

export const parse_count_val: (v: string) => number = GenBS.parse_count_val

export const make_phrases: <T1>(
  count: number,
  wlRecord: Js_Dict_t<T1>
) => t<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(GenBS.make_phrases, Arg1, Arg2)
  return result
}

export const make_separators: (
  separator_kind: string,
  count: number
) => string[] = function (Arg1: any, Arg2: any) {
  const result = Curry._2(GenBS.make_separators, Arg1, Arg2)
  return result
}

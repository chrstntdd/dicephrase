/* TypeScript file generated from Gen.res by genType. */
/* eslint-disable import/first */


// @ts-ignore: Implicit any on import
import * as Curry__Es6Import from 'rescript/lib/es6/curry.js';
const Curry: any = Curry__Es6Import;

// @ts-ignore: Implicit any on import
import * as GenBS__Es6Import from './Gen.bs';
const GenBS: any = GenBS__Es6Import;

import type {TypedArray2_Uint32Array_t as Js_TypedArray2_Uint32Array_t} from './Js.gen';

export const make_wl_keys: (_1:number, _2:((_1:Js_TypedArray2_Uint32Array_t) => void)) => string[] = GenBS.make_wl_keys;

export const shuffle: <T1>(arr:T1[]) => T1[] = GenBS.shuffle;

export const combine_zip: <T1>(a1:T1[], a2:T1[]) => T1[] = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(GenBS.combine_zip, Arg1, Arg2);
  return result
};

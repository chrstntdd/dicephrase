import type { TypedArray2_Uint32Array_t as Js_TypedArray2_Uint32Array_t } from "./Js.gen";
export declare type phase_cfg = {
    readonly count: number;
    readonly sep: string;
};
export declare const make_wl_keys: (_1: number, _2: (_1: Js_TypedArray2_Uint32Array_t) => void) => string[];
export declare const shuffle: <T1>(arr: T1[]) => T1[];
export declare const combine_zip: <T1>(_1: T1[], _2: T1[]) => T1[];
export declare const parse_qs_to_phrase_config: (qs: string) => phase_cfg;
export declare const parse_count_val: (v: string) => number;

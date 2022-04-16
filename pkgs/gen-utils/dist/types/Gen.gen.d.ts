import type { Dict_t as Js_Dict_t } from "./Js.gen";
export declare type phase_cfg = {
    readonly count: number;
    readonly sep: string;
};
export declare const make_wl_keys: (count: number) => string[];
export declare const shuffle: <T1>(arr: T1[]) => T1[];
export declare const combine_zip: <T1>(_1: T1[], _2: T1[]) => T1[];
export declare const parse_qs_to_phrase_config: (qs: string) => phase_cfg;
export declare const parse_count_val: (v: string) => number;
export declare const make_phrases: <T1>(_1: number, _2: Js_Dict_t<T1>) => T1[];
export declare const make_separators: (_1: string, _2: number) => string[];

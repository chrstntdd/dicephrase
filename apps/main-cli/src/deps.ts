export * from "https://unpkg.com/cac@6.7.12/mod.ts"

export {
  combine_zip,
  make_phrases,
  make_separators,
  make_wl_keys,
  shuffle,
  RANDOM_SEPARATOR_OPTS
} from 
// Using the bundled assets instead of source bc the generated TS
// source would break deno since the imports lack extension specifiers
// Maybe import maps can help this?
"../../../pkgs/gen-utils/dist/gen-utils.mod.js"

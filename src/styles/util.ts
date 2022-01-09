import type { CSSProperties } from "@vanilla-extract/css"

export function supportsHover(v: CSSProperties) {
  return {
    "not all and (hover: none)": {
      selectors: {
        "&:hover": v
      }
    }
  }
}

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

export function iOSStandalone(v: CSSProperties) {
  return {
    "(-webkit-touch-callout: none)": {
      "@media": {
        "all and (display-mode: standalone)": v
      }
    }
  }
}

export function chromeStandalone(v: CSSProperties) {
  return {
    "not (-webkit-touch-callout: none)": {
      "@media": {
        "all and (display-mode: standalone)": v
      }
    }
  }
}

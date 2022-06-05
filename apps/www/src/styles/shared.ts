import type { StyleRule } from "@vanilla-extract/css"
import { supportsHover } from "./util"
import { vars } from "./vars.css"

export const PRESSABLE: StyleRule = {
  color: vars.color["primary-300"],
  borderWidth: vars.borderWidth["1x"],
  borderStyle: "solid",
  borderColor: vars.color["primary-800"],
  transition: "background 200ms ease-in-out, box-shadow 200ms ease",
  "@media": {
    ...supportsHover({
      background: vars.color["primary-900"]
    })
  },
  selectors: {
    "&:focus-visible": {
      background: vars.color["primary-900"],
      borderColor: vars.color["primary-900"]
    }
  }
}

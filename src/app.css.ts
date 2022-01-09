import { style } from "@vanilla-extract/css"
import { vars } from "./styles/vars.css"

export const pageTile = style({
  color: vars.color["primary-200"],
  fontFamily: vars.fontFamily.serif,
  margin: `0 0 ${vars.space["2x"]} 0`,
  fontSize: vars.fontSize["3x"]
})

export const appGutter = style({
  padding: `env(safe-area-inset-top) calc(env(safe-area-inset-right) + ${vars.space["2x"]}) env(safe-area-inset-bottom) calc(env(safe-area-inset-left) + ${vars.space["2x"]})`
})

import { style } from "@vanilla-extract/css"
import { HEADER_HEIGHT, vars } from "./styles/vars.css"

export const pageTile = style({
  color: vars.color["primary-200"],
  fontFamily: vars.fontFamily.serif,
  margin: `0 0 ${vars.space["2x"]} 0`,
  fontSize: vars.fontSize["3x"]
})

export const appGutter = style({
  padding: `env(safe-area-inset-top) calc(env(safe-area-inset-right) + ${vars.space["2x"]}) env(safe-area-inset-bottom) calc(env(safe-area-inset-left) + ${vars.space["2x"]})`
})

export const header = style({
  height: HEADER_HEIGHT,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
})

export const appFooter = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingBlock: vars.space["2x"],
  color: vars.color["primary-200"]
})

export const sourceLink = style({
  whiteSpace: "nowrap",
  display: "flex",
  gap: vars.space["1x"],
  alignItems: "center"
})

export const ghLogo = style({
  height: "24px",
  width: "24px"
})

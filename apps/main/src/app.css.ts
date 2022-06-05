import { style } from "@vanilla-extract/css"

import { HEADER_HEIGHT, vars } from "./styles/vars.css"

export const pageTile = style({
  color: vars.color["primary-200"],
  fontFamily: vars.fontFamily.serif,
  margin: `0 0 ${vars.space["2x"]} 0`,
  fontSize: vars.fontSize["3x"]
})

export const main = style({
  // Remove the block end padding of the footer
  minHeight: `calc(100vh - ${HEADER_HEIGHT} - ${vars.space["2x"]})`,
  paddingBlockStart: HEADER_HEIGHT
})

export const header = style({
  height: HEADER_HEIGHT,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: vars.color["primary-1000"],
  position: "fixed",
  width: "100%",
  padding: "inherit",
  top: 0,
  left: 0,
  zIndex: 2
})

export const appFooter = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingBlockEnd: vars.space["2x"],
  color: vars.color["primary-200"]
})

export const sourceLink = style({
  whiteSpace: "nowrap",
  display: "flex",
  gap: vars.space["1x"],
  alignItems: "center"
})

export const ghLogo = style({
  height: vars.space["7x"],
  width: vars.space["7x"]
})

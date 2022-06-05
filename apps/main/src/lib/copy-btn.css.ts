import { style } from "@vanilla-extract/css"
import { PRESSABLE } from "../styles/shared"

import { vars } from "../styles/vars.css"

export const copyBtn = style({
  ...PRESSABLE,
  margin: 0,
  zIndex: 1,
  background: vars.color["primary-1000"],
  borderRadius: vars.borderRadius["2x"],
  position: "fixed",
  bottom: vars.space["3x"],
  right: vars.space["3x"],
  padding: vars.space["3x"],
  display: "grid",
  placeItems: "center"
})

export const copyIcon = style({
  height: vars.fontSize["1x"],
  width: vars.fontSize["1x"]
})

import { style } from "@vanilla-extract/css"
import { vars } from "./styles/vars.css"

export const pageTile = style({
  color: vars.color["teal-100"],
  fontFamily: vars.fontFamily.headingSerif,
  margin: 0,
  fontSize: vars.fontSize["3x"]
})

export const appGutter = style({
  paddingLeft: vars.space["1x"],
  paddingRight: vars.space["1x"]
})

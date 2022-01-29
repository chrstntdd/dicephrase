import { globalStyle, style } from "@vanilla-extract/css"

import { vars } from "../styles/vars.css"

export const aboutPage = style({
  maxWidth: "80ch",
  marginInlineStart: "auto",
  marginInlineEnd: "auto",
  paddingBlockEnd: vars.space["8x"]
})

export const tagline = style({
  margin: 0,
  fontWeight: "600",
  color: vars.color["primary-200"],
  fontSize: vars.fontSize["1x"],
  background: vars.color["primary-900"],
  padding: vars.space["1x"],
  borderRadius: vars.borderRadius["2x"]
})

globalStyle(`${aboutPage} ul`, {
  paddingInlineStart: vars.space["5x"]
})

globalStyle(`${aboutPage} h2`, {
  fontSize: vars.fontSize["1x"]
})

globalStyle(`${aboutPage} a abbr`, {
  background: "inherit",
  textDecoration: "none"
})

globalStyle(`${aboutPage} *`, {
  fontWeight: "600",
  color: vars.color["primary-200"]
})

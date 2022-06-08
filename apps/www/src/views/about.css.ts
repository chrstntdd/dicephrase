import { globalStyle, style } from "@vanilla-extract/css"

import { vars } from "../styles/vars.css"

export const aboutPage = style({
  maxWidth: "80ch",
  marginInlineStart: "auto",
  marginInlineEnd: "auto",
  paddingBlockEnd: vars.space["6x"]
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

export const inlineCode = style({
  paddingBlock: vars.space["0x"],
  paddingInline: vars.space["1x"],
  background: vars.color["primary-900"],
  borderRadius: vars.borderRadius["1x"]
})

export const appFooter = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
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

globalStyle(`${aboutPage} p`, {
  fontSize: vars.fontSize["0x"]
})

globalStyle(`${aboutPage} *`, {
  fontWeight: "600",
  color: vars.color["primary-200"]
})

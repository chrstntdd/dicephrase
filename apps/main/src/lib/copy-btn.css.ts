import { style } from "@vanilla-extract/css"

import { supportsHover } from "../styles/util"
import { vars } from "../styles/vars.css"

export const copyBtn = style({
  margin: 0,
  padding: 0,
  zIndex: 1,
  color: vars.color["primary-300"],
  borderStyle: "solid",
  borderWidth: vars.space["0x"],
  background: vars.color["primary-1000"],
  borderColor: vars.color["primary-800"],
  borderRadius: vars.borderRadius.full,
  transition: "background 200ms ease-in-out",
  position: "fixed",
  bottom: vars.space["3x"],
  right: vars.space["3x"],
  height: "52px",
  width: "52px",
  display: "grid",
  placeItems: "center",
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
})

export const copyIcon = style({
  height: vars.fontSize["1x"],
  width: vars.fontSize["1x"]
})

export const copiedEmoji = style({
  aspectRatio: "1 / 1"
})

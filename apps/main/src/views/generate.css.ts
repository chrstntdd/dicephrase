import { style, globalStyle } from "@vanilla-extract/css"
import { vars } from "../styles/vars.css"

import { supportsHover } from "../styles/util"

const CONTENT_MAX_WIDTH = 768

export const generateBtn = style({
  fontSize: vars.fontSize["1x"],
  borderColor: vars.color["primary-800"],
  borderRadius: vars.borderRadius["full"],
  borderStyle: "solid",
  borderWidth: vars.space["0x"],
  color: vars.color["primary-300"],
  fontWeight: 600,
  padding: vars.space["4x"],
  transition: "background 200ms ease-in-out",
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

export const formEl = style({
  display: "flex",
  flexDirection: "column",

  gap: vars.space["2x"],
  color: vars.color["primary-200"]
})

export const baseRadioGroupContainer = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderStyle: "solid",
  borderWidth: vars.space["0x"],
  borderColor: vars.color["primary-800"],
  borderRadius: vars.borderRadius.full,
  padding: vars.space["0x"],
  color: vars.color["primary-300"]
})

globalStyle(`${baseRadioGroupContainer} > div`, {
  display: "flex",
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  position: "relative"
})

globalStyle(`${baseRadioGroupContainer} input[type='radio']`, {
  margin: "0",
  appearance: "none",
  WebkitAppearance: "none",
  position: "absolute",
  display: "block",
  height: "100%",
  width: "100%",
  borderStyle: "solid",
  borderWidth: vars.space["0x"],
  borderColor: vars.color["primary-800"],
  borderRadius: vars.borderRadius.full,
  padding: vars.space["3x"],
  transition: "background 200ms ease-in-out"
})

globalStyle(`${baseRadioGroupContainer} label`, {
  width: "100%",
  textAlign: "center",
  background: "transparent",
  borderColor: vars.color["primary-800"],
  borderRadius: vars.borderRadius["full"],
  borderStyle: "solid",
  borderWidth: vars.space["0x"],
  zIndex: 1,
  padding: vars.space["3x"]
})

/* Cant use supports hover here since using globals :/ */
globalStyle(`${baseRadioGroupContainer} input[type='radio']:hover`, {
  "@media": {
    "not all and (hover: none)": {
      background: vars.color["primary-900"]
    }
  }
})

globalStyle(`${baseRadioGroupContainer} > *`, {
  borderRadius: vars.borderRadius["full"],
  borderStyle: "solid",
  borderColor: "transparent",
  borderWidth: "0"
})

globalStyle(`${baseRadioGroupContainer} > *:not(:last-child)`, {
  marginRight: vars.space["1x"]
})

globalStyle(`${baseRadioGroupContainer} input[type='radio']:checked`, {
  background: vars.color["primary-800"],
  color: vars.color["primary-200"]
})

export const generatePage = style({
  // Attempt to enough space for phrase output to show up
  margin: "0 auto",
  maxWidth: CONTENT_MAX_WIDTH
})

export const outputContainer = style({
  marginBlock: vars.space["4x"]
})

export const fieldset = style({
  padding: 0,
  marginLeft: 0,
  marginRight: 0,
  border: "none",
  fontSize: vars.fontSize["0x"],
  fontWeight: 600
})

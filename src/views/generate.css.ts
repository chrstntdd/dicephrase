import { style, globalStyle } from "@vanilla-extract/css"
import { vars } from "../styles/vars.css"
import { between, remToPx } from "polished"

export const generateBtn = style({
  fontSize: vars.fontSize["1x"],
  borderColor: vars.color["teal-800"],
  borderRadius: vars.borderRadius["full"],
  borderStyle: "solid",
  borderWidth: vars.space["0x"],
  color: vars.color["teal-300"],
  fontWeight: 600,

  padding: vars.space["4x"],
  transition: "background 200ms ease-in-out",
  "@media": {
    "not all and (hover: none)": {
      selectors: {
        "&:hover": {
          background: vars.color["teal-900"]
        }
      }
    }
  },
  selectors: {
    "&:focus": {
      background: vars.color["teal-900"],
      borderColor: vars.color["teal-900"]
    }
  }
})

export const formEl = style({
  display: "flex",
  flexDirection: "column",
  maxWidth: "768px",
  margin: "0 auto"
})

globalStyle(`${formEl} fieldset`, {
  marginBottom: between(remToPx("0.2rem"), remToPx("0.4rem"), "320px", "768px"),
  marginLeft: 0,
  marginRight: 0,
  border: "none",
  fontSize: vars.fontSize["0x"],
  fontWeight: 600,
  padding: vars.space["1x"]
})

globalStyle(`${formEl} > div:last-child`, {
  marginTop: between(remToPx("0.4rem"), remToPx("0.6rem"), "320px", "768px")
})

export const baseRadioGroupContainer = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderStyle: "solid",
  borderWidth: vars.space["0x"],
  borderColor: vars.color["teal-800"],
  borderRadius: vars.borderRadius.full,
  padding: vars.space["0x"],
  color: vars.color["teal-300"]
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
  // TODO: autoprefixer?
  WebkitAppearance: "none",
  position: "absolute",
  display: "block",
  height: "100%",
  width: "100%",
  borderStyle: "solid",
  borderWidth: vars.space["0x"],
  borderColor: vars.color["teal-800"],
  borderRadius: vars.borderRadius.full,
  padding: vars.space["3x"]
})

globalStyle(`${baseRadioGroupContainer} input[type='radio']:checked`, {
  background: vars.color["teal-800"],
  color: vars.color["teal-100"]
})

globalStyle(`${baseRadioGroupContainer} label`, {
  width: "100%",
  textAlign: "center",
  background: "transparent",
  borderColor: vars.color["teal-800"],
  borderRadius: vars.borderRadius["full"],
  borderStyle: "solid",
  borderWidth: vars.space["0x"],
  zIndex: 1,
  padding: vars.space["3x"]
})

globalStyle(`${baseRadioGroupContainer} input[type='radio']:hover`, {
  "@media": {
    "not all and (hover: none)": {
      background: vars.color["teal-900"]
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

globalStyle(`${baseRadioGroupContainer} *:checked `, {
  background: vars.color["teal-800"],
  color: vars.color["teal-100"]
})

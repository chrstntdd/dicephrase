import { style } from "@vanilla-extract/css"
import { vars } from "../styles/vars.css"

export const pressable = style({
  borderRadius: vars.borderRadius["3x"],
  borderStyle: "solid",
  borderWidth: vars.space["1x"],
  borderColor: vars.color["teal-800"],
  color: "inherit",
  fontSize: vars.fontSize["3x"],
  overflow: "hidden",
  padding: vars.space["1x"],
  width: "100%"
})

export const phrases = style({
  display: "flex",
  flexWrap: "wrap",
  overflow: "hidden",
  color: vars.color["teal-300"]
})

export const phraseContainer = style({
  selectors: {
    "&:hidden": {
      opacity: 0
    }
  }
})

export const phraseChar = style({
  display: "inline-block",
  transition: "opacity 200ms ease-in-out, translate 300ms ease-in-out"
})

export const word = style({
  overflow: "hidden",
  whiteSpace: "nowrap"
})

export const helpText = style({
  fontSize: vars.fontSize["1x"],
  position: "absolute",
  left: "50%",
  bottom: `calc(-1.2 * ${vars.fontSize["2x"]})`,
  whiteSpace: "nowrap",
  willChange: "transform",
  transition: "transform 200ms ease-in-out"
})

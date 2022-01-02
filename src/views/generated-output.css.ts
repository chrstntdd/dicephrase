import { style } from "@vanilla-extract/css"
import { vars } from "../styles/vars.css"

export const backToGenerateLink = style({
  textAlign: "center",
  position: "fixed",
  bottom: vars.space["8x"],
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: vars.fontSize["1x"]
})

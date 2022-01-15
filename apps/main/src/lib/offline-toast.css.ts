import { style } from "@vanilla-extract/css"

export const backdrop = style({
  position: "fixed",
  bottom: "1rem",
  zIndex: "-1",
  left: "50%",
  transition: "transform 200ms ease-in-out"
})

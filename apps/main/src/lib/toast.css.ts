import { globalStyle, keyframes, style } from "@vanilla-extract/css"

import { vars } from "../styles/vars.css"

export const TOAST_DURATION_VAR = "--app-toast-dur"

globalStyle("#app-toast-group", {
  position: "fixed",
  bottom: 0,
  zIndex: 1,
  insetBlockEnd: 0,
  insetInline: 0,
  paddingBlockEnd: vars.space["3x"],
  display: "grid",
  justifyItems: "center",
  justifyContent: "center",
  gap: vars.space["2x"],
  pointerEvents: "none"
})

const fadeIn = keyframes({
  from: {
    opacity: 0
  }
})
const fadeOut = keyframes({
  to: {
    opacity: 0
  }
})

const slideIn = keyframes({
  from: {
    transform: "translateY(var(5vh, 10px))"
  }
})

export const toastItem = style({
  borderRadius: vars.borderRadius["2x"],
  background: vars.color["primary-900"],
  paddingInline: vars.space["3x"],
  paddingBlock: vars.space["2x"],
  willChange: "transform",

  animation: `${fadeIn} 200ms ease,${slideIn} 200ms ease,${fadeOut} 200ms ease var(${TOAST_DURATION_VAR})`
})

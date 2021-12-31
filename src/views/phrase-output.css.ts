import { keyframes, style } from "@vanilla-extract/css"
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

/**
 * @from https://medium.com/@dtinth/spring-animation-in-css-2039de6e1a03
 *
 * Spring-like keyframe animation pre-evaluated
 */

// ////////////////////////////////////////////////////////////////////////////

function springWobbly(t: number) {
  return (
    -0.5 *
    2.71828 ** (-6 * t) *
    (-2 * 2.71828 ** (6 * t) + Math.sin(12 * t) + 2 * Math.cos(12 * t))
  )
}

function lerp(a, b, p) {
  return a + p * (b - a)
}

function makeKeyframes() {
  let out = Object.create(null) as Record<string, any>
  const stops = 100

  for (let i = 0; i <= stops; i++) {
    let t = i / stops
    let p = springWobbly(t)

    out[i + "%"] = { transform: `translateY(${lerp(36, 0, p)}px)` }
  }

  return out
}

const springLike = keyframes(makeKeyframes())

export const phraseChar = style({
  display: "inline-block",
  transition: "opacity 200ms ease-in-out",
  animation: `0.7s ${springLike} linear`,
  animationFillMode: "both"
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

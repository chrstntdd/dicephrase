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

function lerp(a: number, b: number, p: number) {
  return a + p * (b - a)
}

function makeKeyframes(from: number, to: number) {
  let out = Object.create(null) as Record<string, any>
  const stops = 100

  for (let i = 0; i <= stops; i++) {
    let t = i / stops
    let p = springWobbly(t)

    out[i + "%"] = { transform: `translateY(${lerp(from, to, p)}px)` }
  }

  return out
}

const springLike = keyframes(makeKeyframes(36, 0))

export const phraseChar = style({
  animation: `0.7s ${springLike} linear`,
  animationFillMode: "both",
  display: "inline-block"
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
  transition: "transform 200ms ease-in-out",
  transform: `translate(-50%, -0.6rem)`,
  selectors: {
    '&[data-hide="false"]': {
      transform: `translate(-50%, ${vars.space["2x"]})`
    }
  }
})

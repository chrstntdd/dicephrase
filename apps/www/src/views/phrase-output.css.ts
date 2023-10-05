import { type CSSProperties, globalStyle } from "@vanilla-extract/css"
import { keyframes, style } from "@vanilla-extract/css"
import { LIST_RESET } from "../styles/shared.css"

import { vars } from "../styles/vars.css"

export const outputEl = style({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: "1px",
	overflow: "hidden",
	position: "absolute",
	whiteSpace: "nowrap",
	width: "1px",
})

export const phrases = style({
	...LIST_RESET,
	display: "flex",
	flexWrap: "wrap",
	overflow: "hidden",
	borderRadius: vars.borderRadius["3x"],
	color: vars.color["primary-1"],
	fontWeight: 900,
	fontSize: vars.fontSize["3x"],
	paddingInline: vars.space["1x"],
	paddingBlock: vars.space["5x"],
	width: "100%",
	transition: "background 200ms ease-in-out",
	background: vars.color["primary-12"],
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
	let out = {} as Record<string, CSSProperties>
	const stops = 100

	for (let i = 0; i <= stops; i++) {
		let t = i / stops
		let p = springWobbly(t)

		out[i + "%"] = { transform: `translateY(${lerp(from, to, p)}px)` }
	}

	return out
}

const springLike = keyframes(makeKeyframes(36, 0))

globalStyle(`${phrases} > *`, {
	overflow: "hidden",
	whiteSpace: "nowrap",
})
globalStyle(`${phrases} > * > *`, {
	animation: `0.7s ${springLike} linear`,
	willChange: "transform, opacity",
	animationFillMode: "both",
	display: "inline-block",
	animationDelay: `calc(var(--ad) * 1ms)`,
})
globalStyle(`${phrases} > * > *[data-sep]`, {
	color: vars.color["primary-7"],
})

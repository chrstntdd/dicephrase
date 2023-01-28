import { style } from "@vanilla-extract/css"
import { makeResponsiveMq } from "../styles/breakpoints"
import { PRESSABLE } from "../styles/shared.css"
import {
	chromeStandalone,
	iOSStandalone,
	mediaSupportsHover,
} from "../styles/util"

import { vars } from "../styles/vars.css"

export const copyBtn = style({
	...PRESSABLE,
	margin: 0,
	zIndex: 1,
	background: vars.color["primary-10"],
	borderRadius: vars.borderRadius["2x"],
	alignSelf: "end",
	position: "fixed",
	bottom: vars.space["3x"],
	right: vars.space["3x"],
	padding: vars.space["3x"],
	display: "grid",
	placeItems: "center",
	"@media": {
		...makeResponsiveMq("tablet", {
			position: "unset",
			transform: `translate(${vars.space["1x"]}, calc(-1 * ${vars.space["6x"]}))`,
		}),
		...mediaSupportsHover({
			background: vars.color["primary-9"],
		}),
	},
	"@supports": {
		...chromeStandalone({
			bottom: vars.space["4x"],
			right: vars.space["4x"],
		}),
		...iOSStandalone({
			bottom: `env(safe-area-inset-bottom)`,
			right: `env(safe-area-inset-bottom)`,
		}),
	},
})

export const copyIcon = style({
	height: vars.fontSize["1x"],
	width: vars.fontSize["1x"],
})

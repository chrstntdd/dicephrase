import { style, globalStyle } from "@vanilla-extract/css"
import { vars } from "../styles/vars.css"

import { FOCUS_RING_Z_INDEX } from "../styles/constants"
import { LIST_RESET, PRESSABLE } from "../styles/shared.css"
import { mediaSupportsHover } from "../styles/util"

const CONTENT_MAX_WIDTH = 768

export const generateBtn = style({
	...PRESSABLE,
	fontSize: vars.fontSize["1x"],
	borderRadius: vars.borderRadius["2x"],
	fontWeight: 600,
	padding: vars.space["3x"],
})

export const formEl = style({
	display: "flex",
	flexDirection: "column",
	gap: vars.space["3x"],
	color: vars.color["primary-1"],
})

export const baseRadioGroupContainer = style({
	...LIST_RESET,
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	paddingBlock: vars.space["0x"],
})

globalStyle(`${baseRadioGroupContainer} > li`, {
	display: "flex",
	flex: 1,
	alignItems: "center",
	justifyContent: "center",
	flexDirection: "column",
	position: "relative",
})

globalStyle(`${baseRadioGroupContainer} input[type='radio']`, {
	margin: "0",
	appearance: "none",
	WebkitAppearance: "none",
	position: "absolute",
	height: "100%",
	width: "100%",
	transition: PRESSABLE.transition,
	borderRadius: "initial", // iOS fix
	borderBlock: `${vars.borderWidth["1x"]} solid ${vars.color["primary-7"]}`,
})

globalStyle(
	`${baseRadioGroupContainer} > li:first-child > input[type='radio']`,
	{
		borderInline: `${vars.borderWidth["1x"]} solid ${vars.color["primary-7"]}`,
	},
)
globalStyle(
	`${baseRadioGroupContainer} > li:not(:first-child) > input[type='radio']`,
	{
		borderInlineEnd: `${vars.borderWidth["1x"]} solid ${vars.color["primary-7"]}`,
	},
)

globalStyle(
	`${baseRadioGroupContainer} > li:last-child > input[type='radio']`,
	{
		borderEndEndRadius: vars.borderRadius["2x"],
		borderStartEndRadius: vars.borderRadius["2x"],
	},
)
globalStyle(
	`${baseRadioGroupContainer} > li:first-child > input[type='radio']`,
	{
		borderEndStartRadius: vars.borderRadius["2x"],
		borderStartStartRadius: vars.borderRadius["2x"],
	},
)

globalStyle(`${baseRadioGroupContainer} label`, {
	zIndex: FOCUS_RING_Z_INDEX + 1,
	background: "transparent",
	paddingBlock: vars.space["3x"],
	textAlign: "center",
	width: "100%",
})

/* Cant use supports hover here since using globals :/ */
globalStyle(`${baseRadioGroupContainer} input[type='radio']:hover`, {
	// @ts-expect-error Meh, this does work tho!
	"@media": {
		...mediaSupportsHover({ background: vars.color["primary-9"] }, true),
	},
})

globalStyle(`${baseRadioGroupContainer} input[type='radio']:checked`, {
	background: vars.color["primary-7"],
	color: vars.color["primary-12"],
})

globalStyle(`${baseRadioGroupContainer} input[type='radio']:checked + label`, {
	color: vars.color["primary-13"],
})

export const generatePage = style({
	margin: "0 auto",
	maxWidth: CONTENT_MAX_WIDTH,
	display: "flex",
	flexDirection: "column",
	gap: vars.space["4x"],
})

export const fieldset = style({
	padding: 0,
	margin: 0,
	border: "none",
	fontSize: vars.fontSize["0x"],
	fontWeight: 600,
})

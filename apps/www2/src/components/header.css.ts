import { style } from "@vanilla-extract/css"

import { FOCUS_RING_Z_INDEX } from "~/styles/constants"
import { vars } from "~/styles/vars.css"

export const header = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	background: vars.color["primary-10"],
	position: "fixed",
	width: "100%",
	paddingInline: "inherit",
	paddingBlockStart: `env(safe-area-inset-top)`,
	top: 0,
	left: 0,
	zIndex: FOCUS_RING_Z_INDEX + 2,
})

export const pageTile = style({
	color: vars.color["primary-2"],
	fontFamily: vars.fontFamily.serif,
	margin: 0,
	fontSize: vars.fontSize["3x"],
})

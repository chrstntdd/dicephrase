import { style } from "@vanilla-extract/css"
import { FOCUS_RING_Z_INDEX } from "./styles/constants"
import { chromeStandalone, iOSStandalone } from "./styles/util"

import { vars } from "./styles/vars.css"

export const pageTile = style({
	color: vars.color["primary-2"],
	fontFamily: vars.fontFamily.serif,
	margin: 0,
	fontSize: vars.fontSize["3x"],
})

export const main = style({
	// Pad the main area down the page from under the fixed header
	"@media": {
		"all and (display-mode: browser)": {
			paddingBlockStart: vars.space["7x"],
		},
	},
	"@supports": {
		...chromeStandalone({
			paddingBlockStart: `calc(env(safe-area-inset-top) + ${vars.space["7x"]})`,
		}),
		...iOSStandalone({
			paddingBlockStart: "env(safe-area-inset-top)",
		}),
	},
})

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

export const buildMetadataContainer = style({
	display: "flex",
	position: "absolute",
	bottom: 0,
	left: 0,
	width: "100%",
	alignItems: "center",
	gap: vars.space["2x"],
	padding: vars.space["1x"],
})

export const buildMetadataToggle = style({
	width: 42,
	height: 42,
	aspectRatio: "1/1",
	border: 0,
	background: "transparent",
	borderRadius: vars.borderRadius["2x"],
})

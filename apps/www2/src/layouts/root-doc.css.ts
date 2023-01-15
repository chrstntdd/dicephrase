import { style } from "@vanilla-extract/css"
import { chromeStandalone, iOSStandalone } from "~/styles/util"

import { vars } from "~/styles/vars.css"

export const root = style({
	isolation: "isolate",
	minHeight: "100%",
	padding: [
		`calc(env(safe-area-inset-top) + ${vars.space["2x"]})`,
		`calc(env(safe-area-inset-right) + ${vars.space["2x"]})`,
		"env(safe-area-inset-bottom)",
		`calc(env(safe-area-inset-left) + ${vars.space["2x"]})`,
	].join(" "),
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

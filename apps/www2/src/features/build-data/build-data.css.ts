import { style } from "@vanilla-extract/css"

import { vars } from "~/styles/vars.css"

export const buildDataContainer = style({
	color: vars.color["primary-1"],
	fontSize: "1rem",
	display: "flex",
	gap: vars.space["1x"],
	overflow: "hidden",
})

export const releaseTime = style({
	whiteSpace: "nowrap",
})

export const gitHash = style({
	whiteSpace: "nowrap",
	textOverflow: "ellipsis",
	overflow: "hidden",
})

export const codeContainer = style({
	margin: 0,
})

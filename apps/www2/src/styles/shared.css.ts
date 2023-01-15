import type { StyleRule } from "@vanilla-extract/css"
import { mediaSupportsHover } from "./util"
import { vars } from "./vars.css"

export const PRESSABLE: StyleRule = {
	color: vars.color["primary-3"],
	borderWidth: vars.borderWidth["1x"],
	borderStyle: "solid",
	borderColor: vars.color["primary-8"],
	transition: "background 50ms ease",
	"@media": {
		...mediaSupportsHover({
			background: vars.color["primary-9"],
		}),
	},
	selectors: {
		"&:focus-visible": {
			background: vars.color["primary-9"],
			borderColor: vars.color["primary-9"],
		},
	},
}

export const LIST_RESET: StyleRule = {
	padding: 0,
	margin: 0,
	listStyle: "none",
}

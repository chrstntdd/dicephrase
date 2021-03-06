import type { StyleRule } from "@vanilla-extract/css"
import { supportsHover } from "./util"
import { vars } from "./vars.css"

export const PRESSABLE: StyleRule = {
	color: vars.color["primary-300"],
	borderWidth: vars.borderWidth["1x"],
	borderStyle: "solid",
	borderColor: vars.color["primary-800"],
	transition: "background 50ms ease",
	"@media": {
		...supportsHover({
			background: vars.color["primary-900"],
		}),
	},
	selectors: {
		"&:focus-visible": {
			background: vars.color["primary-900"],
			borderColor: vars.color["primary-900"],
		},
	},
}

export const LIST_RESET: StyleRule = {
	padding: 0,
	margin: 0,
	listStyle: "none",
}

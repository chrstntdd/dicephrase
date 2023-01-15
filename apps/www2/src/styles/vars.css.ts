import { createGlobalTheme } from "@vanilla-extract/css"
import { modularScale, rem } from "polished"

const createScale =
	(ratio: number, base: number, remUnits?: boolean) => (steps: number) => {
		let valInPx = `${modularScale(steps, base, ratio)}px`

		return remUnits ? rem(valInPx) : valInPx
	}

const spaceScale = createScale(1.4, 4)
const fontSizeScale = createScale(1.3, 16, true)
const borderRadiusScale = createScale(1.5, 4)

const color = {
	"primary-1": "hsl(200,13.04%,4.51%)",
	"primary-2": "hsl(204,23.81%,8.24%)",
	"primary-3": "hsl(201,33.33%,11.76%)",
	"primary-4": "hsl(200.57,44.3%,15.49%)",
	"primary-5": "hsl(200.38,52.48%,19.8%)",
	"primary-6": "hsl(200.8,59.06%,24.9%)",
	"primary-7": "hsl(201.43,61.25%,31.37%)",
	"primary-8": "hsl(201.03,58.79%,39.02%)",
	"primary-9": "hsl(201.09,52.46%,47.84%)",
	"primary-10": "hsl(200.84,43.78%,57.45%)",
	"primary-11": "hsl(200.73,33.33%,67.65%)",
	"primary-12": "hsl(201.6,22.52%,78.24%)",
	"primary-13": "hsl(200,10.34%,88.63%)",
} as const

export const vars = createGlobalTheme(":root", {
	space: {
		none: "0",
		"0x": spaceScale(0),
		"1x": spaceScale(1),
		"2x": spaceScale(2),
		"3x": spaceScale(3),
		"4x": spaceScale(4),
		"5x": spaceScale(5),
		"6x": spaceScale(6),
		"7x": spaceScale(7),
		"8x": spaceScale(8),
	},
	color,
	borderRadius: {
		"1x": borderRadiusScale(1),
		"2x": borderRadiusScale(2),
		"3x": borderRadiusScale(3),
		full: "99999px",
	},
	borderWidth: {
		"1x": "2px",
	},
	fontFamily: {
		body: 'manrope, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
		serif: "DMSerif",
	},
	fontSize: {
		"0x": fontSizeScale(0),
		"1x": fontSizeScale(1),
		"2x": fontSizeScale(2),
		"3x": fontSizeScale(3),
	},
})

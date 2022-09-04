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
	color: {
		"primary-50": "#07100c",
		"primary-100": "#13261c",
		"primary-200": "#1c3c2c",
		"primary-300": "#1d533e",
		"primary-400": "#117156",
		"primary-500": "#039474",
		"primary-600": "#11b495",
		"primary-700": "#2bc3a7",
		"primary-800": "#51d1b9",
		"primary-900": "#7fdecc",
		"primary-1000": "#b4ebdf",
		"primary-1100": "#ecf8f2",
	},
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

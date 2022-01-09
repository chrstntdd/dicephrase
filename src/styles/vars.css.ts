import { createGlobalTheme } from "@vanilla-extract/css"
import { modularScale } from "polished"

const createScale = (ratio: number, base: number) => (steps: number) =>
  `${modularScale(steps, base, ratio)}px`

const spaceScale = createScale(1.4, 4)
const fontSizeScale = createScale(1.3, 16)
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
    "8x": spaceScale(8)
  },
  color: {
    "teal-50": "#07100c",
    "teal-100": "#13261c",
    "teal-200": "#1c3c2c",
    "teal-300": "#1d533e",
    "teal-400": "#117156",
    "teal-500": "#039474",
    "teal-600": "#11b495",
    "teal-700": "#2bc3a7",
    "teal-800": "#51d1b9",
    "teal-900": "#7fdecc",
    "teal-1000": "#b4ebdf",
    "teal-1100": "#ecf8f2"
  },
  borderRadius: {
    "3x": borderRadiusScale(3),
    full: "99999px"
  },
  fontFamily: {
    body: 'manrope, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    serif: "DMSeric"
  },
  fontSize: {
    "0x": fontSizeScale(0),
    "1x": fontSizeScale(1),
    "2x": fontSizeScale(2),
    "3x": fontSizeScale(3)
  }
})

import { createGlobalTheme } from "@vanilla-extract/css"
import { modularScale } from "polished"

const createScale = (ratio: number, base: number) => (steps: number) =>
  `${modularScale(steps, base, ratio)}px`

const spaceScale = createScale(1.4, 4)
const fontSizeScale = createScale(1.3, 16)
const lineHeightScale = createScale(1.25, 24)
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
    brand: "#fff",
    brandAccent: "#fff",
    brandAccentActive: "#fff",
    brandAccentHover: "#fff",
    brandAccentSoft: "#fff",
    brandAccentSoftActive: "#fff",
    brandAccentSoftHover: "#fff",

    white: "#fff",

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
    "0x": borderRadiusScale(0),
    "1x": borderRadiusScale(1),
    "2x": borderRadiusScale(2),
    "3x": borderRadiusScale(3),
    "4x": borderRadiusScale(4),
    "5x": borderRadiusScale(5),
    full: "99999px"
  },
  fontFamily: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    headingSerif: "Bakersville"
  },
  fontSize: {
    "0x": fontSizeScale(0),
    "1x": fontSizeScale(1),
    "2x": fontSizeScale(2),
    "3x": fontSizeScale(3),
    "4x": fontSizeScale(4),
    "5x": fontSizeScale(5)
  },
  lineHeight: {
    "0x": lineHeightScale(0),
    "1x": lineHeightScale(1),
    "2x": lineHeightScale(2),
    "3x": lineHeightScale(3),
    "4x": lineHeightScale(4),
    "5x": lineHeightScale(5)
  }
})

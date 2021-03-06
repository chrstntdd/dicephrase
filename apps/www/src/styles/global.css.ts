import { globalStyle, globalFontFace } from "@vanilla-extract/css"
import { FOCUS_RING_Z_INDEX } from "./constants"
import { vars } from "./vars.css"

globalFontFace("manrope", {
	src: [
		'url(/fonts/manrope/Manrope-Regular.otf) format("otf")',
		'url(/fonts/manrope/Manrope-Regular.woff2) format("woff2")',
		'url(/fonts/manrope/Manrope-Regular.ttf) format("truetype")',
	],
	fontWeight: 400,
	fontDisplay: "swap",
})

globalFontFace("DMSerif", {
	src: [
		'url(/fonts/DM_Serif_Display/DMSerifDisplay-Regular.ttf) format("truetype")',
	],
	fontWeight: 400,
	fontDisplay: "swap",
})

globalStyle("*", {
	MozOsxFontSmoothing: "grayscale",
	WebkitFontSmoothing: "antialiased",
	WebkitTapHighlightColor: "rgba(0, 0, 0 0)",
	WebkitTouchCallout: "none",
	backgroundColor: "transparent",
	fontSmooth: "antialiased",
	position: "relative",
})

globalStyle("*, *:after, *:before", {
	boxSizing: "border-box",
})

globalStyle("html", {
	height: "100%",
	width: "100%",
})

globalStyle("html:focus-within", {
	scrollBehavior: "smooth",
})

globalStyle("html, body", {
	margin: 0,
	padding: 0,
	WebkitTextSizeAdjust: "100%",
	background: vars.color["primary-1000"],
})

globalStyle("body", {
	fontFamily: vars.fontFamily.body,
	height: "100vh",
	lineHeight: 1.4,
	minWidth: "100%",
	overflowX: "hidden",
	textRendering: "optimizeSpeed",
	// To prevent FOUC
	visibility: "hidden",
})

globalStyle("p, h1, h2, h3, h4, h5, h6", {
	overflowWrap: "break-word",
})

globalStyle("input, button, textarea, select", {
	font: "inherit",
})

globalStyle("img, picture, video, canvas, svg", {
	display: "block",
	maxWidth: "100%",
})

globalStyle("#root", {
	isolation: "isolate",
	minHeight: "100vh",
	width: "100vw",
	padding: [
		`calc(env(safe-area-inset-top) + ${vars.space["2x"]})`,
		`calc(env(safe-area-inset-right) + ${vars.space["2x"]})`,
		"env(safe-area-inset-bottom)",
		`calc(env(safe-area-inset-left) + ${vars.space["2x"]})`,
	].join(" "),
})

globalStyle("a, a:active", {
	color: "inherit",
	background: "inherit",
})

globalStyle("input,button,a", {
	// Faster interactions? https://webplatform.news/issues/2017-10-17
	touchAction: "manipulation",
})

globalStyle("*:focus,*:focus-visible", {
	outline: 0,
	zIndex: FOCUS_RING_Z_INDEX,
	boxShadow: `0 0 0 2px ${vars.color["primary-400"]}`,
})

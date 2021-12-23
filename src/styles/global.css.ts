import { globalStyle, globalFontFace } from "@vanilla-extract/css"
import { vars } from "./vars.css"

globalFontFace("Bakersville", {
  src: [
    'url(/fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf) format("truetype")'
  ],
  fontWeight: 400,
  fontDisplay: "swap"
})

globalStyle("*", {
  MozOsxFontSmoothing: "grayscale",
  WebkitFontSmoothing: "antialiased",
  WebkitTapHighlightColor: "rgba(0, 0, 0 0)",
  WebkitTouchCallout: "none",
  backgroundColor: "transparent",
  fontSmooth: "antialiased",
  position: "relative"
})

globalStyle("*, *:after, *:before", {
  boxSizing: "border-box"
})

globalStyle("html", {
  height: "100%",
  width: "100%"
})

globalStyle("html:focus-within", {
  scrollBehavior: "smooth"
})

globalStyle("html, body", {
  margin: 0,
  padding: 0,
  WebkitTextSizeAdjust: "100%"
})

globalStyle("body", {
  fontFamily: vars.fontFamily.body,
  height: "100vh",
  lineHeight: 1.4,
  minWidth: "100%",
  overflowX: "hidden",
  textRendering: "optimizeSpeed"
})

globalStyle("p, h1, h2, h3, h4, h5, h6", {
  overflowWrap: "break-word"
})

globalStyle("input, button, textarea, select", {
  font: "inherit"
})

globalStyle("img, picture, video, canvas, svg", {
  display: "block",
  maxWidth: "100%"
})

globalStyle("#root", {
  isolation: "isolate",
  height: "100vh",
  width: "100vw"
})

globalStyle("a, a:active", {
  color: "inherit"
})

// Disable default focus styles, we apply this as needed with <FocusRing/>
globalStyle("input[type='text']*:focus", {
  outline: "none"
})

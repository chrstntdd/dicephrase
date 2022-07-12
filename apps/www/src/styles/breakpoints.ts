// CREDIT: https:github.com/seek-oss/braid-design-system/blob/master/lib/css/breakpoints.ts

export const breakpointNames = ["mobile", "tablet", "desktop", "wide"] as const

export const breakpoints = {
	mobile: 0,
	tablet: 740,
	desktop: 992,
	wide: 1200,
} as const

export type Breakpoint = keyof typeof breakpoints

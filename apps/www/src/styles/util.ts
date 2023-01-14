import type { CSSProperties, GlobalStyleRule } from "@vanilla-extract/css"

type ValueOf<T> = T[keyof T]

export function mediaSupportsHover(v: CSSProperties, isGlobalStyle?: boolean) {
	return {
		"not all and (hover: none)": isGlobalStyle
			? v
			: {
					selectors: {
						"&:hover": v,
					},
			  },
	} as const
}

export function iOSStandalone(v: CSSProperties) {
	return {
		"(-webkit-touch-callout: none)": {
			"@media": {
				"all and (display-mode: standalone)": v,
			},
		},
	}
}

export function chromeStandalone(v: CSSProperties) {
	return {
		"not (-webkit-touch-callout: none)": {
			"@media": {
				"all and (display-mode: standalone)": v,
			},
		},
	}
}

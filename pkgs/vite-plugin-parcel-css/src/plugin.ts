import { browserslistToTargets, transform } from "@parcel/css"
import browserslist from "browserslist"
import type { Plugin } from "vite"

type ParcelCSSPluginOpts = {
	browserslist: Parameters<typeof browserslistToTargets>[0]
	minify: boolean
}

export function parcelCSSPlugin(opts: ParcelCSSPluginOpts): Plugin {
	return {
		name: "vite-plugin-parcel-css",
		enforce: "post",
		generateBundle(_, bundle) {
			for (let filename in bundle) {
				let element = bundle[filename]
				if (
					element &&
					element.type === "asset" &&
					element.name?.includes(".css")
				) {
					/* Prevent vite from further processing the CSS file — we'll handle this ourselves with parcel's css plugin */
					delete bundle[filename]

					let { code } = transform({
						code: Buffer.from(element.source),
						filename,
						minify: opts.minify,
						targets: browserslistToTargets(browserslist(opts.browserslist)),
					})

					this.emitFile({
						name: element.name,
						fileName: filename,
						type: "asset",
						source: code.toString("utf-8"),
					})
				}
			}
		},
	}
}

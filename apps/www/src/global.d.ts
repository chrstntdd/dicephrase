/**
 * @description
 * Cache key generated by service worker build script
 */
declare const __SW_CACHE_KEY__: string

/**
 * @description
 * string JSON array of all the build assets to precache
 * to support offline usage
 */
declare const __PRECACHE_BUILD_ASSETS__: string

declare module "virtual:build-info" {
	const nowISO: string
	const gitHash: string
	const version: string
}

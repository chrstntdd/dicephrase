import { spawnSync } from "node:child_process"
import type { Plugin } from "vite"

type BuildInfoPluginOpts = {
	version?: string
}

export function buildPlugin(opts: BuildInfoPluginOpts): Plugin {
	let virtualModuleId = "virtual:build-info"
	let resolvedVirtualModuleId = "\0" + virtualModuleId

	return {
		name: "@ct/vite-plugin-build-info",
		resolveId(id) {
			if (id === virtualModuleId) return resolvedVirtualModuleId
		},
		load(id) {
			if (id === resolvedVirtualModuleId) {
				let now = new Date().toISOString()
				let fullGitHash = spawnSync("git rev-parse HEAD").toString().trim()
				let version = opts.version || "--"
				return `export const nowISO = "${now}", gitHash = "${fullGitHash}", version="${version}"`
			}
		},
	}
}

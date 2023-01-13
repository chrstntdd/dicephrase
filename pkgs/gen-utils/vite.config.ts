import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		coverage: {
			all: true,
			exclude: ["src/**/*.spec.ts", "src/**/*.test.ts"],
			include: ["src"],
			reporter: ["lcov"],
		},
	},
})

import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
			all: true,
			exclude: ["src/**/*.spec.ts", "src/**/*.test.ts"],
			include: ["src"],
			reporter: ["lcov"],
		},
	},
})

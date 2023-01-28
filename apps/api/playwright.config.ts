import { PlaywrightTestConfig } from "@playwright/test"

const config: PlaywrightTestConfig = {
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	fullyParallel: true,
	testDir: "tests",
	use: {
		headless: true,
		baseURL: process.env.BASE_URL || "http://0.0.0.0:3000",
		trace: "on-first-retry",
		ignoreHTTPSErrors: true,
	},
}
export default config

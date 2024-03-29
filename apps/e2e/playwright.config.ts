import { PlaywrightTestConfig, devices } from "@playwright/test"

const config: PlaywrightTestConfig = {
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	timeout: 10_000, // 10 sec
	fullyParallel: true,
	reporter: [["html"], ["list"]],
	use: {
		baseURL: process.env.BASE_URL || "https://localhost:3001/",
		// permissions: ["clipboard-write", "clipboard-read"],
		trace: "on-first-retry",
		ignoreHTTPSErrors: true,
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
}
export default config

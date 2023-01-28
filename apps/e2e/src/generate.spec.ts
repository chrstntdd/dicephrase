import { resolve } from "node:path"
import { test, expect, type Page } from "@playwright/test"

import { E2E_SCREENSHOT_DIR } from "../config"

async function setupPage(page: Page, baseURL: string) {
	await page.goto(baseURL, { waitUntil: "networkidle" })
}

test.describe.parallel("App e2e", () => {
	test("shows the heading", async ({ page, baseURL }) => {
		await setupPage(page, baseURL!)
		let heading = page.locator("h1")

		expect(await heading.textContent()).toEqual("Dicephrase")
	})

	test("shows the default values checked", async ({ page, baseURL }) => {
		await setupPage(page, baseURL!)
		let defaultWordCount = page.locator("input[type='radio'][value='8']")

		expect(await defaultWordCount.isChecked()).toBeTruthy()

		let defaultSep = page.locator("input[type='radio'][value='random']")

		expect(await defaultSep.isChecked()).toBeTruthy()
	})

	test("should show the results after pressing the generate button", async ({
		page,
		baseURL,
		browserName,
	}) => {
		await setupPage(page, baseURL!)
		await page.screenshot({
			path: resolve(E2E_SCREENSHOT_DIR, `${browserName}-empty.png`),
		})
		let genBtn = page.locator("button[type='submit']")

		await genBtn.click()

		await page.waitForSelector("button")

		await page.waitForTimeout(400)

		await page.screenshot({
			path: resolve(E2E_SCREENSHOT_DIR, `${browserName}-generated.png`),
		})
	})

	test("should copy the results to the clipboard after the press of the copy button", async ({
		page,
		browserName,
		browser,
		contextOptions,
		baseURL,
	}) => {
		// Only chrome has nice support for verifying the copy functionality works
		if (browserName !== "chromium") return

		let ctx = await browser.newContext({
			...contextOptions,
			permissions: ["clipboard-write", "clipboard-read"],
		})
		page = await ctx.newPage()
		await setupPage(page, baseURL!)

		await page.click("button[type='submit']")

		let outputEl = await page.waitForSelector(
			"output[role='status'][form='gen-form']",
		)

		let visualPassword = await outputEl.innerText()

		let copyBtn = await page.waitForSelector(
			'button[aria-label="Copy to clipboard"]',
		)

		await copyBtn.click()

		let passwordInClipboard = await (
			await page.evaluateHandle(() => navigator.clipboard.readText())
		).jsonValue()

		expect(visualPassword).toEqual(passwordInClipboard)
	})

	test("should update the URL on change of form inputs", async ({
		page,
		baseURL,
	}) => {
		await setupPage(page, baseURL!)

		await Promise.all([
			page.locator("button[type='submit']").click(),
			page.waitForURL("**/?phrase-count=8&separator=random"),
		])

		expect(new URL(page.url()).searchParams.toString()).toEqual(
			"phrase-count=8&separator=random",
		)

		await Promise.all([
			page
				.getByRole("group", { name: "Word separator" })
				.getByText(".")
				.click(),
			page.waitForURL("**/?phrase-count=8&separator=."),
		])

		expect(new URL(page.url()).searchParams.toString()).toEqual(
			"phrase-count=8&separator=.",
		)

		await Promise.all([
			page.getByRole("group", { name: "Word count" }).getByText("9").click(),
			page.waitForURL("**/?phrase-count=9&separator=."),
		])

		expect(new URL(page.url()).searchParams.toString()).toEqual(
			"phrase-count=9&separator=.",
		)
	})

	test("should handle space character properly", async ({ page, baseURL }) => {
		await setupPage(page, baseURL!)

		await page.locator("text=Space").click()

		let outputEl = await page.waitForSelector(
			"output[role='status'][form='gen-form']",
		)

		let visualPassword = await outputEl.innerText()

		expect(visualPassword).toMatch(/\w*\ */g)
	})
})

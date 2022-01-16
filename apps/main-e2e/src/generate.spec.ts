import { test, expect } from "@playwright/test"
import type { Page } from "@playwright/test"
import { resolve } from "path"

import { E2E_SCREENSHOT_DIR } from "../config"

async function setupPage(page: Page, baseURL: string) {
  await page.goto(baseURL + "generate", { waitUntil: "networkidle" })
}

test.describe("App e2e", () => {
  test.afterAll(async ({ browser }) => {
    await browser.close()
  })

  test("shows the heading", async ({ page, baseURL }) => {
    await setupPage(page, baseURL!)
    let heading = await page.$("h1")

    expect(await heading.textContent()).toEqual("Dicephrase")
  })

  test("shows the default values checked", async ({ page, baseURL }) => {
    await setupPage(page, baseURL!)
    let defaultWordCount = await page.$("input[type='radio'][value='8']")

    expect(await defaultWordCount.isChecked()).toBeTruthy()

    let defaultSep = await page.$("input[type='radio'][value='random']")

    expect(await defaultSep.isChecked()).toBeTruthy()
  })

  test("should show the results after pressing the generate button", async ({
    page,
    baseURL
  }) => {
    await setupPage(page, baseURL!)
    let genBtn = await page.$("button[type='submit']")

    await genBtn.click()

    await page.waitForSelector("*[role='button']")

    // let output = await page.$("button[type='button']")
    // Wait for animation to play
    await page.waitForTimeout(400)

    await page.screenshot({
      path: resolve(E2E_SCREENSHOT_DIR, "generated.png")
    })
  })

  test("should copy the results to the clipboard after the press of the output", async ({
    page,
    browserName,
    browser,
    contextOptions,
    baseURL
  }) => {
    // Only chrome has nice support for verifying the copy functionality works
    if (browserName !== "chromium") return

    let ctx = await browser.newContext({
      ...contextOptions,
      permissions: ["clipboard-write", "clipboard-read"]
    })
    page = await ctx.newPage()
    await setupPage(page, baseURL!)
    let genBtn = await page.$("button[type='submit']")

    await genBtn.click()

    let outputBtn = await page.waitForSelector("*[role='button']")

    // Wait for animation to play
    await page.waitForTimeout(400)

    let visualPassword = (
      await page.locator("*[role='button'] > *").innerText()
    ).replace(/\n/g, "")

    await outputBtn.click()

    let passwordInClipboard = await (
      await page.evaluateHandle(() => navigator.clipboard.readText())
    ).jsonValue()

    expect(visualPassword).toEqual(passwordInClipboard)
  })

  test("should update the URL on change of form inputs", async ({
    page,
    baseURL
  }) => {
    await setupPage(page, baseURL!)
    let genBtn = await page.$("button[type='submit']")

    await genBtn.click()
    await page.waitForNavigation()

    let searchParams = await (
      await page.evaluateHandle(() => Promise.resolve(location.search))
    ).jsonValue()

    expect(searchParams).toEqual("?phrase-count=8&separator=random")
  })
})

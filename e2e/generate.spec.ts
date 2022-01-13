import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest"

import { chromium, devices } from "playwright"
import type { Page, ChromiumBrowser } from "playwright"
import { resolve } from "path"

import { E2E_SCREENSHOT_DIR } from "../scripts/mod"

describe("App e2e", () => {
  let browser: ChromiumBrowser, page: Page

  beforeAll(async () => {
    let iPhone = devices["iPhone SE"]

    let b = await chromium.launch({ headless: false })

    let context = await b.newContext({
      ...iPhone,
      permissions: ["clipboard-write", "clipboard-read"],
      ignoreHTTPSErrors: true,
      colorScheme: "dark"
    })

    let p = await context.newPage()

    await p.goto("https://localhost:3001/generate")

    page = p
    browser = b
  })

  beforeEach(async () => {
    await page.reload()
    await page.goto("https://localhost:3001/generate")
  })

  afterAll(async () => {
    await browser.close()
  })

  it("shows the heading", async () => {
    let heading = await page.$("h1")

    expect(await heading.textContent()).toEqual("Dicephrase")
  })

  it("shows the default values checked", async () => {
    let defaultWordCount = await page.$("input[type='radio'][value='8']")

    expect(await defaultWordCount.isChecked()).toBeTruthy()

    let defaultSep = await page.$("input[type='radio'][value='random']")

    expect(await defaultSep.isChecked()).toBeTruthy()
  })

  it("should show the results after pressing the generate button", async () => {
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

  it("should copy the results to the clipboard after the press of the output", async () => {
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

  it("should update the URL on change of form inputs", async () => {
    let genBtn = await page.$("button[type='submit']")

    await genBtn.click()
    await page.waitForNavigation()

    let searchParams = await (
      await page.evaluateHandle(() => Promise.resolve(location.search))
    ).jsonValue()

    expect(searchParams).toEqual("?phrase-count=8&separator=random")
  })
})

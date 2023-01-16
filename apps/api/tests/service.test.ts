import test, { expect } from "@playwright/test"

test("Happy path text", async ({ request, baseURL }) => {
	let u = new URL("/gen", baseURL)
	u.searchParams.set("count", "11")
	u.searchParams.set("sep", "random")

	let r = await request.get(u.toString())
	expect(r.ok()).toBe(true)
	let responseText = await r.text()
	expect(responseText.trim().length).not.toBe(0)
})

test("Too many phrases", async ({ request, baseURL }) => {
	let u = new URL("/gen", baseURL)
	u.searchParams.set("count", "51")
	u.searchParams.set("sep", "random")

	let r = await request.get(u.toString())

	expect(r.ok()).not.toBe(true)
	expect(await r.json()).toEqual({ issues: ["Count is too large"] })
})

test("Count number not integer", async ({ request, baseURL }) => {
	let u = new URL("/gen", baseURL)
	u.searchParams.set("count", "1.1")
	u.searchParams.set("sep", "random")

	let r = await request.get(u.toString())

	expect(r.ok()).not.toBe(true)
	expect(await r.json()).toEqual({ issues: ["Count must be a whole number"] })
})

test("Count number not valid", async ({ request, baseURL }) => {
	let u = new URL("/gen", baseURL)
	u.searchParams.set("count", ":)")
	u.searchParams.set("sep", "random")

	let r = await request.get(u.toString())

	expect(r.ok()).not.toBe(true)
	expect(await r.json()).toEqual({
		issues: ["Count must be valid whole number"],
	})
})

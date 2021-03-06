async function copyTextToClipboard(text: string) {
	if (!navigator.clipboard?.writeText) {
		let fallbackCopy = await import("./clippy-fallback").then((m) => m.default)
		fallbackCopy(text)
		return
	}
	await navigator.clipboard.writeText(text)
}

export { copyTextToClipboard }

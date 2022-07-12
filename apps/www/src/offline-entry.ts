setupOffline()

async function setupOffline() {
	if (import.meta.env.DEV) return
	if ("serviceWorker" in navigator) {
		addEventListener("load", () => {
			navigator.serviceWorker.register("/sw.js").then(null, (err) => {
				console.error("ServiceWorker registration failed: ", err)
			})
		})
	}
}

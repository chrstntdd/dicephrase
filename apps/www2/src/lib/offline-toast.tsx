import { toastWrapper } from "./toast"

export function OfflineToast() {
	if (!import.meta.env.SSR && "serviceWorker" in navigator) {
		let msgHandler = async (swEvent: MessageEvent) => {
			let msg = swEvent?.data?.type

			switch (msg) {
				case "PRECACHE_SUCCESS": {
					await toastWrapper({ msg: "Ready to work offline" })
				}
			}
		}

		navigator.serviceWorker.addEventListener("message", msgHandler)
	}
}

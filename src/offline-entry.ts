setupOffline()

async function setupOffline() {
  if ("serviceWorker" in navigator) {
    addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").then(null, (err) => {
        console.error("ServiceWorker registration failed: ", err)
      })
    })
  }

  addEventListener("load", () => {
    function handleNetworkChange() {
      navigator.onLine
        ? document.body.classList.remove("offline")
        : document.body.classList.add("offline")
    }
    addEventListener("online", handleNetworkChange)
    addEventListener("offline", handleNetworkChange)
  })

  // if (navigator.storage && navigator.storage.persist) {
  //   const isPersisted = await navigator.storage.persist()
  //   console.log(`Persisted storage granted: ${isPersisted}`)
  // }
}

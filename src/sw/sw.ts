import { handleRequest } from "./network"

const sw: ServiceWorkerGlobalScope & typeof globalThis = self as any

const buildAssets = JSON.parse(__PRECACHE_BUILD_ASSETS__)

sw.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(__SW_CACHE_KEY__)
      .then((cache) => cache.addAll(buildAssets))
      .then(async () => {
        const clients = await sw.clients.matchAll({
          includeUncontrolled: true,
          type: "window"
        })
        clients.forEach((client) => {
          client.postMessage({ type: "PRECACHE_SUCCESS" })
        })
      })
      .catch((reason) => {
        console.error({ reason })
      })
  )
})

sw.addEventListener("activate", (event) => {
  event.waitUntil(sw.clients.claim())

  // cleanup old cached files
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== __SW_CACHE_KEY__) {
            return caches.delete(key)
          }
        })
      )
    })
  )
})

sw.addEventListener("upgrade", () => {
  //
})

sw.addEventListener("fetch", (event) => event.respondWith(handleRequest(event)))

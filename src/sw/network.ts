async function handleRequest(event: FetchEvent): Promise<Response> {
  if (
    event.request.cache === "only-if-cached" &&
    event.request.mode !== "same-origin"
  ) {
    // @ts-ignore
    return
  }

  const request = event.request

  switch (true) {
    case request.method === "GET" &&
      (request.url === "/" ||
        request.headers.get("accept")?.includes("text/html")): {
      return (
        /**
         * @description
         * Treat errors when requesting static assets as if we're offline
         * and serve back the main index html file
         */
        fetch(request).catch((error) => {
          console.error(
            "[onfetch] Failed. Serving cached offline fallback " + error
          )

          return caches.match("/index.html") as Promise<Response>
        })
      )
    }

    // Let the network handle it!
    default:
      return caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
        .catch(async () => {
          const cache = await caches.open(__SW_CACHE_KEY__)
          const cachedResponse = await cache.match("/index.html")

          return cachedResponse!
        })
  }
}

export { handleRequest }

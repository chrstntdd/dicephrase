async function handleRequest(event: FetchEvent): Promise<Response> {
  if (
    event.request.cache === "only-if-cached" &&
    event.request.mode !== "same-origin"
  ) {
    // Ooooof
    return undefined as unknown as Promise<Response>
  }

  let request = event.request
  let reqUrl = new URL(request.url)

  switch (true) {
    case request.method === "GET" &&
      (reqUrl.pathname === "/" || reqUrl.pathname === "/generate") &&
      request.headers.get("accept")?.includes("text/html"): {
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

          return caches.match("/generate.html") as Promise<Response>
        })
      )
    }

    // Let the network handle it!
    default:
      return caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
        .catch(async () => {
          let cache = await caches.open(__SW_CACHE_KEY__)
          let cachedResponse = await cache.match("/index.html")

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return cachedResponse!
        })
  }
}

export { handleRequest }

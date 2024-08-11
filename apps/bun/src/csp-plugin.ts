import { type Elysia } from "elysia"

function genNonce(length = 12) {
  return [...crypto.getRandomValues(new Uint8Array(length))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export default function cspPlugin(app: Elysia) {
  app.onRequest(({ set, request }) => {
    if (request.url.includes("/_/swagger")) return

    set.headers[
      "Content-Security-Policy"
    ] = `default-src 'self'; style-src 'self'; script-src 'strict-dynamic'; img-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'`
    set.headers["Permissions-Policy"] =
      "camera=(), microphone=(), geolocation=()"
    set.headers["Referrer-Policy"] = "no-referrer"
    set.headers["Strict-Transport-Security"] =
      "max-age=31536000; includeSubdomains; preload"
    set.headers["X-Content-Type-Options"] = "nosniff"
    set.headers["X-Frame-Options"] = "SAMEORIGIN"
    set.headers["X-XSS-Protection"] = "1; mode=block"

    return undefined
  })

  return app
}

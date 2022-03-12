/**
 * @description
 *
 * Simple static file server
 */
import { resolve } from "path"
import { readFileSync } from "fs"

import fastify from "fastify"
import Static from "fastify-static"
import Compress from "fastify-compress"

const IS_PRODUCTION = process.env.NODE_ENV === "production"
const PORT = parseInt(process.env.PORT || "3001", 10)
const ADDR = IS_PRODUCTION ? "0.0.0.0" : "localhost"

const server = fastify({
  logger: true,
  http2: true,
  https: {
    key: readFileSync(resolve("localhost-key.pem"), "utf-8"),
    cert: readFileSync(resolve("localhost.pem"), "utf-8")
  },
  connectionTimeout: 1000 * 30
})

await server.register(Static, {
  root: resolve("dist")
})

await server.register(Compress)

server.get("/about", (_, reply) => {
  reply.sendFile("about.html")
})

server.get("/", (_, reply) => {
  reply.sendFile("index.html")
})

await server.listen(PORT, ADDR)

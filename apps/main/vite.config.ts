import { readFileSync } from "fs"
import { sep } from "path"
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"

let IS_NET = process.env.IS_NET === "true"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vanillaExtractPlugin(),
      solid(
        mode === "ssg"
          ? { ssr: true, solid: { hydratable: true, generate: "ssr" } }
          : {}
      )
    ],
    build:
      mode === "ssg"
        ? undefined
        : {
            rollupOptions: {
              output: {
                inlineDynamicImports: false,
                manualChunks(id) {
                  if (!id.endsWith(".css") && id.includes("node_modules")) {
                    let directories = id.split(sep)
                    let name =
                      directories[directories.lastIndexOf("node_modules") + 1]

                    if (name.includes("solid-js")) {
                      return "vend-fw"
                    }

                    if (name === "xstate") {
                      return "vend-xstate"
                    }

                    // Defer to default behavior
                  }
                }
              }
            }
          },
    // Prevent build failures during cloudflare deployment
    server: IS_NET
      ? undefined
      : {
          https: {
            key: readFileSync("localhost-key.pem"),
            cert: readFileSync("localhost.pem")
          }
        }
  }
})

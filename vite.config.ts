import { readFileSync } from "fs"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"

let IS_NET = process.env.IS_NET === "true"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  // Prevent build failures during cloudflare deployment
  server: IS_NET
    ? undefined
    : {
        https: {
          key: readFileSync("localhost-key.pem"),
          cert: readFileSync("localhost.pem")
        }
      }
})

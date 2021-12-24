import { readFileSync } from "fs"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"

let PROD = process.env.NODE_ENV === "production"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vanillaExtractPlugin(), react()],
  server: PROD
    ? undefined
    : {
        https: {
          key: readFileSync("localhost-key.pem"),
          cert: readFileSync("localhost.pem")
        }
      }
})

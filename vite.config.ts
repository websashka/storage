import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import * as path from "path"

export default defineConfig({
  plugins: [react(), svgr()],
  base: "",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

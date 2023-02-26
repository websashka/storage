import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import * as path from "path"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  base: "",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

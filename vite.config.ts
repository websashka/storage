import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inject from "@rollup/plugin-inject";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [inject(
        {
          include: ['node_modules/@ledgerhq/**'],
          modules: { Buffer: ['buffer', 'Buffer'], }
        }
      )]
    }
  }
})

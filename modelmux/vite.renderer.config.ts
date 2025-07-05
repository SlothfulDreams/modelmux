import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks")
    },
  }
})
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: path.join(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: "main.js",
    },
  },
});

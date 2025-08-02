import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: path.join(__dirname, "src/preload.mts"),
      formats: ["es"],
    },
  },
});

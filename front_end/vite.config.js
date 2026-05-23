import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Cho phép Vite parse JSX trong cả .js lẫn .jsx
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
      },
    },
  },

  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:9999",
        changeOrigin: true,
      },
    },
  },
});
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
      // Proxy API calls → backend port 9999
      "/api": {
        target: "http://127.0.0.1:9999",
        changeOrigin: true,
      },
      // BUG FIX: Proxy /uploads → backend port 9999
      // Backend lưu ảnh tại uploads/ và serve qua /uploads
      // Nếu không có dòng này, ảnh sẽ 404 trên Vite dev server
      "/uploads": {
        target: "http://127.0.0.1:9999",
        changeOrigin: true,
      },
    },
  },
});

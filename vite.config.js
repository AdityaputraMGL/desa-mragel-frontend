import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Artinya: Semua request yang diawali '/api' akan diteruskan ke backend
      "/api": {
        target: "http://localhost:5000", // GANTI 5000 SESUAI PORT BACKEND ANDA
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

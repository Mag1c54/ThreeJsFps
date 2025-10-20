import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import path from "path";

export default defineConfig({
  plugins: [wasm()],

  resolve: {
    alias: {
      // Алиас для общих файлов (shared) между клиентом и сервером
      "@shared": path.resolve(__dirname, "./shared"),
      "@client": path.resolve(__dirname, "./client/src"),
      "@server": path.resolve(__dirname, "./server/src"),
    },
  },

  server: {
    // Настройки для dev сервера Vite
    port: 5173,
    hmr: {
      port: 24678, // HMR на отдельном порту, чтобы не конфликтовать с игровым сервером
    },
  },
});

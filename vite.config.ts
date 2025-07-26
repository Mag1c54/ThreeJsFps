import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [wasm()],
  
  server: {
    // Явно указываем Vite, чтобы он не конфликтовал с нашим игровым сервером
    hmr: {
      port: 24678, // Можно использовать любой другой свободный порт
    },
    // Можно также настроить прокси, но для начала попробуем без него
  },
});
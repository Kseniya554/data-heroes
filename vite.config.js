import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: 'data-heroes',
  plugins: [vue()],
  server: {
    port: 5173,
    root: './src'
  }
});

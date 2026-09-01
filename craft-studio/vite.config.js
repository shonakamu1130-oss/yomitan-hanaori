import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // GitHub Pagesでのパス解決を容易にする設定
  server: {
    port: 3000,
    open: false
  }
});

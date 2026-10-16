import { defineConfig } from 'vite';

// base relativa: funciona em qualquer subcaminho do GitHub Pages (ex.: /luiz-filipe-portfolio/).
export default defineConfig({
  base: './',
  build: { outDir: 'dist', emptyOutDir: true },
});

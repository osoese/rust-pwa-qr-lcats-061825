import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: '../static',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})

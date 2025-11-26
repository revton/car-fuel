import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração apenas para Vite (build/dev server).
// A configuração de testes (Vitest) fica em `vitest.config.ts`.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})

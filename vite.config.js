import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Necessário para expor para fora do container Docker
    port: 5173,
    watch: {
      usePolling: true, // Garante que o hot reload funcione em volumes no Windows
    },
  },
})

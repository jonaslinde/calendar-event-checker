import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
    proxy: {
      '/ics-api': {
        target: 'https://api.innebandy.se',
        changeOrigin: true,
        secure: true,
        rewrite: p => p.replace(/^\/ics-api/, ''),
      },
      '/sportadmin': {
        target: 'https://publicweb.sportadmin.se',
        changeOrigin: true,
        secure: true,
        rewrite: p => p.replace(/^\/sportadmin/, ''),
      },
    },
  },
})
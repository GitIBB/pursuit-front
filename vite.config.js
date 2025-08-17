import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('.certs/localhost-key.pem'),
      cert: fs.readFileSync('.certs/localhost.pem'),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:8080', // Backend server url (use https if your backend uses https)
        changeOrigin: true,
        secure: false,
      },
    },
    host: 'localhost',
    port: 5173,
  },
})
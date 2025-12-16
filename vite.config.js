import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  base: process.env.NODE_ENV === 'production' ? '/universal-pet-care' : '/',
  server: {
    https: true,
    port: 5173
  }
})

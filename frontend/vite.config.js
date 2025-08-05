import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), Inspect()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true, // ensures consistent port
    allowedHosts: process.env.VITE_ALLOWED_HOSTS
      ? process.env.VITE_ALLOWED_HOSTS.split(',')
      : ['localhost'],
    cors: true,
    origin: process.env.VITE_ALLOWED_HOSTS?.split(',')[0]
      ? `https://${process.env.VITE_ALLOWED_HOSTS.split(',')[0]}`
      : undefined
  }
})

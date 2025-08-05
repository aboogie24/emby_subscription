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
    allowedHosts: [
      'signup.justpurple.org',
      'proxy.justpurple.org'
    ],
    cors: true,
    origin: 'https://signup.justpurple.org'
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), Inspect()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true, // keeps port consistent
    allowedHosts: [
      'signup.justpurple.org',
      'api.justpurple.org',
      'localhost',
      '127.0.0.1'
    ], // ✅ Allow any host
    cors: true,
    origin: '*'
  }
})

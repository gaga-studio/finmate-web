import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FinMate',
        short_name: 'FinMate',
        description: 'A mobile money routine companion',
        theme_color: '#1570ef',
        background_color: '#f7f9fc',
        display: 'standalone',
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: ['e2e/**', 'node_modules/**'],
  },
})

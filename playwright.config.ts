import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testIgnore: 'actual-api-flow.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    ...devices['Pixel 5'],
  },
  webServer: {
    command: 'VITE_USE_MOCKS=true npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
  },
})

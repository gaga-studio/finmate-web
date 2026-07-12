import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: 'actual-api-flow.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:4174',
    ...devices['Pixel 5'],
  },
  webServer: {
    command: 'VITE_USE_MOCKS=false VITE_API_BASE_URL=http://127.0.0.1:18080 npm run dev -- --host 127.0.0.1 --port 4174',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
  },
})

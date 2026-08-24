import process from 'node:process'

import { defineConfig, devices } from '@playwright/test'
import { loadEnv } from 'vite'

const isCI = !!process.env.CI
const port = isCI ? 4173 : 5173
const loadedEnv = loadEnv(process.env.NODE_ENV ?? 'test', process.cwd(), '')

for (const [key, value] of Object.entries(loadedEnv)) {
  if (process.env[key] === undefined) {
    process.env[key] = value
  }
}

export default defineConfig({
  testDir: './e2e',
  testMatch: '*.spec.ts',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${String(port)}`,
    locale: 'pt-BR',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    command: isCI ? 'npm run preview' : 'npm run dev',
    port,
    reuseExistingServer: !isCI,
    env: {
      PLAYWRIGHT: '1',
    },
  },
})

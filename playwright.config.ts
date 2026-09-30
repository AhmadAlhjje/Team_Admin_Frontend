import { defineConfig, devices } from '@playwright/test';

/**
 * Browser end-to-end tests for critical admin flows (login, CRUD, uploads,
 * settings, inbox). Requires the backend API running with a seeded database —
 * see docs/testing.md. The admin dev server is started automatically.
 */
const port = Number(process.env.E2E_ADMIN_PORT ?? 3001);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: `http://localhost:${port}`,
    locale: 'ar',
    trace: 'retain-on-failure',
    // Set PLAYWRIGHT_CHANNEL=chrome to use an installed Google Chrome instead of the bundled Chromium.
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'admin',
      use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/admin.json' },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    },
  ],
  webServer: {
    command: `npx next dev -p ${port}`,
    url: `http://localhost:${port}/login`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

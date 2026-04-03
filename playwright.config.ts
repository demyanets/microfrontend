import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/src',
  testMatch: '**/*.e2e-spec.ts',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:30103',
    trace: 'on-first-retry',
    channel: 'chrome',
  },
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:30103',
    reuseExistingServer: !process.env['CI'],
    timeout: 180000,
  },
});

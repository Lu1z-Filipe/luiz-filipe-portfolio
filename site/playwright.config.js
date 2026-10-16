import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const channel = process.env.PW_CHANNEL || undefined; // local: msedge; CI: chromium instalado

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],
  use: { baseURL: `http://localhost:${PORT}`, trace: 'on-first-retry', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel } },
  ],
  // Testa o build de produção, não o servidor de desenvolvimento.
  webServer: {
    command: `npm run build && npm run preview -- --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

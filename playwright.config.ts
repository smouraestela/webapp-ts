import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  reporter: [
    ['list'], // saída bonitinha no terminal
    ['junit', { outputFile: 'reports/playwright-results.xml' }],
    // se quiser também HTML:
    // ['html', { outputFolder: 'reports/html', open: 'never' }],
  ],
});

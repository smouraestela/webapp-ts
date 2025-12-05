import { test, expect } from '@playwright/test';

test('página inicial carrega e mostra mensagem', async ({ page }) => {
  await page.goto('/');

  const title = await page.textContent('h1');
  await expect(title).toContain('mini web app em TS');

  const paragraph = await page.textContent('p');
  await expect(paragraph || '').toContain('/api/users');
});

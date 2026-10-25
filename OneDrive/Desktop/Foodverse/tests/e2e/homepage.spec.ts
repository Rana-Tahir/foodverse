import { test, expect } from '@playwright/test';

test('homepage has welcome heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Welcome to Foodverse');
});

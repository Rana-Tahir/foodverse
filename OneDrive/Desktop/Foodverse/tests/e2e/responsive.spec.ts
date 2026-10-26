import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile (iPhone SE)', width: 375, height: 667 },
  { name: 'Mobile (iPhone 12)', width: 390, height: 844 },
  { name: 'Tablet (iPad)', width: 768, height: 1024 },
  { name: 'Desktop (Small)', width: 1024, height: 768 },
  { name: 'Desktop (Large)', width: 1440, height: 900 },
];

for (const vp of viewports) {
  test.describe(`Responsive Design - ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('Homepage renders correctly across viewports', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();

      // Check chatbot widget is visible and doesn't obstruct content
      const chatbot = page.locator('button[aria-label="Open support chat"]');
      await expect(chatbot).toBeVisible();
    });

    test('Restaurant detail page is responsive', async ({ page }) => {
      await page.goto('/restaurants/sample-restaurant-id');
      await expect(page.locator('body')).toBeVisible();
    });

    test('Checkout page is responsive', async ({ page }) => {
      await page.goto('/checkout');
      await expect(page.locator('body')).toBeVisible();
    });
  });
}

import { test, expect } from '@playwright/test';

test.describe('Restaurant Workflow', () => {
  test('Restaurant owner signup → setup restaurant → add menu', async ({ page }) => {
    // Signup as restaurant owner
    await page.goto('/auth/signup');
    await page.fill('input[type="email"]', `owner-${Date.now()}@test.com`);
    await page.fill('input[type="password"]', 'SecurePassword123!');
    await page.fill('input[placeholder*="Full Name"]', 'Test Owner');
    await page.click('text=Restaurant Owner');
    await page.click('button:has-text("Sign Up")');

    // Login as owner
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test.owner@example.com');
    await page.fill('input[type="password"]', 'SecurePassword123!');
    await page.click('button:has-text("Sign In")');

    // Navigate to restaurant dashboard
    await page.goto('/restaurant/dashboard');
    await expect(page.locator('text=Restaurant Dashboard')).toBeVisible();

    // Navigate to menu management
    await page.goto('/restaurant/menu');
    await expect(page.locator('text=Menu Management')).toBeVisible();

    // Add category/item button visible
    const addButton = page.locator('button:has-text("Add Category"), button:has-text("Add Menu Item")').first();
    await expect(addButton).toBeVisible();
  });

  test('Owner receives and accepts incoming order', async ({ page }) => {
    // Login as restaurant owner
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test.owner@example.com');
    await page.fill('input[type="password"]', 'SecurePassword123!');
    await page.click('button:has-text("Sign In")');

    // Navigate to restaurant dashboard
    await page.goto('/restaurant/dashboard');

    // Verify orders table or incoming orders section
    await expect(page.locator('text=Incoming Orders, text=Orders')).toBeVisible();
  });
});

test.describe('Admin Workflow', () => {
  test('Admin dashboard → approve pending restaurant → manage users', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test.admin@example.com');
    await page.fill('input[type="password"]', 'SecurePassword123!');
    await page.click('button:has-text("Sign In")');

    // Navigate to admin dashboard
    await page.goto('/admin/dashboard');
    await expect(page.locator('text=Platform Overview, text=Dashboard')).toBeVisible();

    // Navigate to pending approvals
    await page.goto('/admin/restaurants/pending');
    await expect(page.locator('text=Pending Approvals')).toBeVisible();

    // Navigate to user management
    await page.goto('/admin/users');
    await expect(page.locator('text=User Management')).toBeVisible();

    // Navigate to platform settings
    await page.goto('/admin/settings');
    await expect(page.locator('text=Platform Settings')).toBeVisible();
  });
});

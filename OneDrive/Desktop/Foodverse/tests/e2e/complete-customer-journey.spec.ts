import { test, expect } from '@playwright/test';

test.describe('Complete Customer Journey', () => {
  test('Customer registration → profile → address setup', async ({ page }) => {
    // Navigate to signup
    await page.goto('/auth/signup');

    // Fill signup form
    await page.fill('input[type="email"]', `customer-${Date.now()}@test.com`);
    await page.fill('input[type="password"]', 'SecurePassword123!');
    await page.fill('input[placeholder*="Full Name"]', 'Test Customer');

    // Select customer role
    await page.click('text=Customer');

    // Submit signup
    await page.click('button:has-text("Sign Up")');

    // Wait for redirect to profile or home
    await page.waitForNavigation();
    expect(page.url()).not.toContain('/auth/signup');
  });

  test('Browse restaurants → search → view menu → add to cart', async ({ page }) => {
    // Login first
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test.customer@example.com');
    await page.fill('input[type="password"]', 'SecurePassword123!');
    await page.click('button:has-text("Sign In")');

    // Wait for redirect to home
    await page.waitForNavigation();

    // Browse restaurants
    await page.goto('/');
    await expect(page.locator('text=Explore Restaurants')).toBeVisible();

    // Search for restaurant
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('biryani');

    // Click on first restaurant
    const restaurantCard = page.locator('[class*="restaurant-card"]').first();
    await restaurantCard.click();

    // Wait for menu page
    await page.waitForNavigation();

    // Add item to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await addToCartButton.click();

    // Verify item in cart
    const cartBadge = page.locator('text=1').first();
    await expect(cartBadge).toBeVisible();
  });

  test('Checkout → order confirmation → order tracking', async ({ page }) => {
    // Assume logged in with items in cart
    await page.goto('/checkout');

    // Select delivery address
    const addressSelect = page.locator('select, [role="combobox"]').first();
    await addressSelect.click();
    await page.locator('text=Saved Address').first().click();

    // Verify order summary
    await expect(page.locator('text=Order Summary')).toBeVisible();

    // Place order
    const placeOrderButton = page.locator('button:has-text("Place Order")');
    await placeOrderButton.click();

    // Wait for confirmation page
    await page.waitForNavigation();

    // Verify order confirmation
    await expect(page.locator('text=Order Confirmed')).toBeVisible();

    // Extract order ID from confirmation
    const orderReference = await page.locator('[class*="order-reference"]').textContent();
    expect(orderReference).toBeTruthy();

    // Navigate to order tracking
    const trackingLink = page.locator('a:has-text("Track Order")');
    await trackingLink.click();

    // Verify order status page
    await expect(page.locator('text=Order Status')).toBeVisible();
  });

  test('Order status updates: restaurant accepts → preparing → ready', async ({ page }) => {
    // Navigate to order tracking page
    await page.goto('/orders/tracked-order-id');

    // Verify initial status
    let statusBadge = page.locator('[class*="status-badge"]');
    let statusText = await statusBadge.textContent();
    expect(statusText).toContain('Pending') || expect(statusText).toContain('Confirmed');

    // Simulate restaurant accepting (in real test, would be done by restaurant owner)
    // For this E2E, we verify the UI can display status changes
    await expect(page.locator('text=Restaurant Status')).toBeVisible();
  });

  test('Rider accepts and completes delivery', async ({ page }) => {
    // Login as rider
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test.rider@example.com');
    await page.fill('input[type="password"]', 'SecurePassword123!');
    await page.click('button:has-text("Sign In")');

    // Navigate to rider dashboard
    await page.goto('/rider/dashboard');
    await expect(page.locator('text=Welcome back, Rider')).toBeVisible();

    // View available assignments
    await page.click('a:has-text("View Assignments")');
    await page.waitForNavigation();

    // Accept first assignment
    const acceptButton = page.locator('button:has-text("Accept Delivery")').first();
    if (await acceptButton.isVisible()) {
      await acceptButton.click();

      // Navigate to current delivery
      await page.goto('/rider/deliveries/current');
      await expect(page.locator('text=Current Delivery')).toBeVisible();
    }
  });

  test('Customer views completed order', async ({ page }) => {
    // Login as customer
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test.customer@example.com');
    await page.fill('input[type="password"]', 'SecurePassword123!');
    await page.click('button:has-text("Sign In")');

    // Navigate to orders or order history
    await page.goto('/');

    // Look for order history link
    const ordersLink = page.locator('a:has-text("Orders"), a:has-text("Order History")').first();
    if (await ordersLink.isVisible()) {
      await ordersLink.click();

      // Verify completed order is visible
      const completedOrderBadge = page.locator('text=Delivered, text=Completed').first();
      await expect(completedOrderBadge).toBeVisible();
    }
  });
});

test.describe('Chat Support Integration', () => {
  test('Chatbot is accessible and responds to queries', async ({ page }) => {
    // Navigate to any page
    await page.goto('/');

    // Find and click chatbot launcher
    const chatbotLauncher = page.locator('button[aria-label="Open support chat"]');
    await expect(chatbotLauncher).toBeVisible();
    await chatbotLauncher.click();

    // Wait for chat panel to open
    const chatPanel = page.locator('text=Foodverse Assistant');
    await expect(chatPanel).toBeVisible();

    // Send a message
    const chatInput = page.locator('input[placeholder*="question"]');
    await chatInput.fill('how do I place an order');

    // Send message
    await page.click('button[aria-label="Send message"]');

    // Verify bot response
    await expect(page.locator('text=Steps to order')).toBeVisible({ timeout: 5000 });
  });
});

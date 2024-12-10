import { test, expect } from '@playwright/test';

async function login({ page }) {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
}

test.describe('Sauce Demo Tests', () => {
  
  // Test Case 1: Verify User Login
  test('Verify User Login', async ({ page }) => {
    await login({ page });
    const appLogo = page.locator('.app_logo');
    await expect(appLogo).toBeVisible();
    await expect(appLogo).toHaveText('Swag Labs');
  });

  // Test Case 2: Verify Adding Item to Cart
  test('Verify Adding Item to Cart', async ({ page }) => {
    await login({ page });
    await page.locator('#add-to-cart-sauce-labs-backpack').click();
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    await page.locator('.shopping_cart_link').click();

    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);

    const backpackItem = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    await expect(backpackItem).toBeVisible();
  });

  // Test Case 3: Verify Adding Multiple Items to Cart
  test('Verify Adding Multiple Items to Cart', async ({ page }) => {
    await login({ page });
    await page.locator('#add-to-cart-sauce-labs-backpack').click();
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    await page.locator('#add-to-cart-sauce-labs-bike-light').click();
    await expect(cartBadge).toHaveText('2');

    await page.locator('.shopping_cart_link').click();
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);

    const backpackItem = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    const bikeLightItem = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bike Light' });
    await expect(backpackItem).toBeVisible();
    await expect(bikeLightItem).toBeVisible();
  });

  // Test Case 4: Verify Removing Item from Cart
  test('Verify Removing Item from Cart', async ({ page }) => {
    await login({ page });
    await page.locator('#add-to-cart-sauce-labs-backpack').click();
    await page.locator('.shopping_cart_link').click();

    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);

    const backpackItem = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    await expect(backpackItem).toBeVisible();

    await page.locator('#remove-sauce-labs-backpack').click();
    await expect(cartItems).toHaveCount(0);

    const updatedCartBadge = page.locator('.shopping_cart_badge');
    await expect(updatedCartBadge).toHaveCount(0);
  });

  // Test Case 5: Verify Checkout Process 
  test('Verify Checkout Process', async ({ page }) => {
    await login({ page });
    await page.locator('#add-to-cart-sauce-labs-backpack').click();
    await page.locator('.shopping_cart_link').click();

    const backpackItem = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    await expect(backpackItem).toBeVisible();

    await page.locator('#checkout').click();
    await page.locator('#first-name').fill('John');
    await page.locator('#last-name').fill('Dou');
    await page.locator('#postal-code').fill('12345');
    await page.locator('#continue').click();

    const summaryTotal = page.locator('.summary_total_label');
    await expect(summaryTotal).toHaveText('Total: $32.39');

    await page.locator('#finish').click();

    const completeHeader = page.locator('.complete-header');
    await expect(completeHeader).toHaveText('Thank you for your order!');
  });

  // Test Case 6: Verify Checkout Process for multiple items
  test('Verify Checkout Process for multiple items', async ({ page }) => {
    await login({ page });
    await page.locator('#add-to-cart-sauce-labs-backpack').click();
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');

    await page.locator('#add-to-cart-sauce-labs-bike-light').click();
    await expect(cartBadge).toHaveText('2');

    await page.locator('.shopping_cart_link').click();
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);

    const backpackItem = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    const bikeLightItem = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bike Light' });
    await expect(backpackItem).toBeVisible();
    await expect(bikeLightItem).toBeVisible();

    await page.locator('#checkout').click();
    await page.locator('#first-name').fill('John');
    await page.locator('#last-name').fill('Dou');
    await page.locator('#postal-code').fill('12345');
    await page.locator('#continue').click();

    const summaryTotal = page.locator('.summary_total_label');
    await expect(summaryTotal).toHaveText('Total: $43.18');

    await page.locator('#finish').click();
    const completeHeader = page.locator('.complete-header');
    await expect(completeHeader).toHaveText('Thank you for your order!');
  });

  // Test Case 7: Verify Non-Existing User Is not Able to Login
  test('Verify Non-Existing User Is not Able to Login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user_123');
    await page.locator('[data-test="password"]').fill('secret_sauce_123');
    await page.locator('[data-test="login-button"]').click();

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });

  // Test Case 8: Verify User is able to logout
  test('Verify User is able to logout', async ({ page }) => {
    await login({ page });
    await page.locator('#react-burger-menu-btn').click();
    const sideMenu = page.locator('.bm-menu-wrap');
    await expect(sideMenu).toBeVisible();

    await page.locator('#logout_sidebar_link').click();

    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
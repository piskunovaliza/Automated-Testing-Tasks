import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CheckoutPage } from './pages/CheckOutPage';
import { CartPage } from './pages/CartPage';
import { User } from './factories/User';

test.describe('Sauce Demo Tests', () => {
  let user: User;

  test.beforeEach(async ({ page }) => {
    user = new User();
  });

  // Test Case 1: Verify User Login
  test('Verify User Login', async ({ page }) => {
    const loginPage = new LoginPage({ page });
    await loginPage.goto();
    await loginPage.login(user.validUser);

    const inventoryPage = new InventoryPage({ page });
    await expect(inventoryPage.appLogo).toBeVisible();
    await expect(inventoryPage.appLogo).toHaveText('Swag Labs');
  });

  // Test Case 2: Verify Adding Item to Cart
  test('Verify Adding Item to Cart', async ({ page }) => {
    const loginPage = new LoginPage({ page });
    await loginPage.goto();
    await loginPage.login(user.validUser);

    const inventoryPage = new InventoryPage({ page });
    await inventoryPage.addBackpackToCart();
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    await inventoryPage.goToCart();
    const cartPage = new CartPage({ page });

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.backpackItem).toBeVisible();
  });

  // Test Case 3: Verify Adding Multiple Items to Cart
  test('Verify Adding Multiple Items to Cart', async ({ page }) => {
    const loginPage = new LoginPage({ page });
    await loginPage.goto();
    await loginPage.login(user.validUser);

    const inventoryPage = new InventoryPage({ page });
    await inventoryPage.addBackpackToCart();
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    await inventoryPage.addBikeLightToCart();
    await expect(inventoryPage.shoppingCartBadge).toHaveText('2');

    await inventoryPage.goToCart();
    const cartPage = new CartPage({ page });

    await expect(cartPage.cartItems).toHaveCount(2);
    await expect(cartPage.backpackItem).toBeVisible();
    await expect(cartPage.bikeLightItem).toBeVisible();
  });

  // Test Case 4: Verify Removing Item from Cart
  test('Verify Removing Item from Cart', async ({ page }) => {
    const loginPage = new LoginPage({ page });
    await loginPage.goto();
    await loginPage.login(user.validUser);

    const inventoryPage = new InventoryPage({ page });
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();

    const cartPage = new CartPage({ page });
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.backpackItem).toBeVisible();

    await cartPage.removeBackpack();
    await expect(cartPage.cartItems).toHaveCount(0);

    await expect(inventoryPage.shoppingCartBadge).toHaveCount(0);
  });

  // Test Case 5: Verify Checkout Process
  test('Verify Checkout Process', async ({ page }) => {
    const loginPage = new LoginPage({ page });
    await loginPage.goto();
    await loginPage.login(user.validUser);

    const inventoryPage = new InventoryPage({ page });
    await inventoryPage.addBackpackToCart();
    await inventoryPage.goToCart();

    const cartPage = new CartPage({ page });
    await expect(cartPage.backpackItem).toBeVisible();

    await cartPage.checkout();

    const checkoutPage = new CheckoutPage({ page });
    await checkoutPage.fillCheckoutInformation({ firstName: 'John', lastName: 'Dou', postalCode: '12345' });
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.summaryTotalLabel).toHaveText('Total: $32.39');

    await checkoutPage.finishCheckout();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  // Test Case 6: Verify Checkout Process for multiple items
  test('Verify Checkout Process for multiple items', async ({ page }) => {
    const loginPage = new LoginPage({ page });
    await loginPage.goto();
    await loginPage.login(user.validUser);

    const inventoryPage = new InventoryPage({ page });
    await inventoryPage.addBackpackToCart();
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    await inventoryPage.addBikeLightToCart();
    await expect(inventoryPage.shoppingCartBadge).toHaveText('2');

    await inventoryPage.goToCart();
    const cartPage = new CartPage({ page });
    await expect(cartPage.cartItems).toHaveCount(2);
    await expect(cartPage.backpackItem).toBeVisible();
    await expect(cartPage.bikeLightItem).toBeVisible();

    await cartPage.checkout();

    const checkoutPage = new CheckoutPage({ page });
    await checkoutPage.fillCheckoutInformation({ firstName: 'John', lastName: 'Dou', postalCode: '12345' });
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.summaryTotalLabel).toHaveText('Total: $43.18');

    await checkoutPage.finishCheckout();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  // Test Case 7: Verify Non-Existing User Is not Able to Login
  test('Verify Non-Existing User Is not Able to Login', async ({ page }) => {
    const loginPage = new LoginPage({ page });
    await loginPage.goto();
    await loginPage.login(user.invalidUser);

    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  // Test Case 8: Verify User is able to logout
  test('Verify User is able to logout', async ({ page }) => {
    const loginPage = new LoginPage({ page });
    await loginPage.goto();
    await loginPage.login(user.validUser);

    await page.locator('#react-burger-menu-btn').click();
    const sideMenu = page.locator('.bm-menu-wrap');
    await expect(sideMenu).toBeVisible();

    await page.locator('#logout_sidebar_link').click();

    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
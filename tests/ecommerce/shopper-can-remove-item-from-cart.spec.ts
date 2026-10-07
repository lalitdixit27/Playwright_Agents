// spec: specs/ecommerce.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Remove an item from the cart before purchase', () => {
  test('Shopper can remove a cart line and keep the remaining item', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com and log in as standard_user / secret_sauce
    await page.goto('https://www.saucedemo.com');
    await expect(page).toHaveTitle('Swag Labs');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="shopping-cart-link"]')).toHaveAttribute('aria-label', 'Cart, empty');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    // 2. Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

    // 3. Open the cart
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
    ]);

    // 4. Click Remove on Sauce Labs Bike Light
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();

    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText(['Sauce Labs Backpack']);
    await expect(page.getByText('Sauce Labs Bike Light')).toHaveCount(0);
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    await expect(page.locator('[data-test="shopping-cart-link"]')).toHaveAttribute('aria-label', 'Cart, 1 items');
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();

    // 5. Click Continue Shopping
    await page.locator('[data-test="continue-shopping"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });
});

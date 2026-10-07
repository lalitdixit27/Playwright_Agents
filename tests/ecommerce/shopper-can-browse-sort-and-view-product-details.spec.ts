// spec: specs/ecommerce.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Browse catalog, sort, and view product details', () => {
  test('Shopper can sort the catalog and open a product details page', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com and log in as standard_user / secret_sauce
    await page.goto('https://www.saucedemo.com');
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="shopping-cart-link"]')).toHaveAttribute('aria-label', 'Cart, empty');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    // 2. Observe the product list with default sort Name (A to Z)
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');
    await expect(page.locator('[data-test="active-option"]')).toHaveText('Name (A to Z)');
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText([
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ]);
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText([
      '$29.99',
      '$9.99',
      '$15.99',
      '$49.99',
      '$7.99',
      '$15.99',
    ]);

    // 3. Select sort option Price (low to high) (value lohi)
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    await expect(page.locator('[data-test="active-option"]')).toHaveText('Price (low to high)');
    await expect(page.locator('[data-test="inventory-item-name"]').nth(0)).toHaveText('Sauce Labs Onesie');
    await expect(page.locator('[data-test="inventory-item-price"]').nth(0)).toHaveText('$7.99');
    await expect(page.locator('[data-test="inventory-item-name"]').nth(1)).toHaveText('Sauce Labs Bike Light');
    await expect(page.locator('[data-test="inventory-item-price"]').nth(1)).toHaveText('$9.99');
    await expect(page.locator('[data-test="inventory-item-name"]').last()).toHaveText('Sauce Labs Fleece Jacket');
    await expect(page.locator('[data-test="inventory-item-price"]').last()).toHaveText('$49.99');

    // 4. Click the Sauce Labs Backpack name
    await page.locator('[data-test="item-4-title-link"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=4');
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="inventory-item-desc"]')).toContainText('carry.allTheThings()');
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
    await expect(page.locator('[data-test="back-to-products"]')).toHaveText('Back to products');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveCount(0);

    // 5. Click Back to products
    await page.locator('[data-test="back-to-products"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="shopping-cart-link"]')).toHaveAttribute('aria-label', 'Cart, empty');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
  });
});

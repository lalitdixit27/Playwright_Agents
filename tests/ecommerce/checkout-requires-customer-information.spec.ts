// spec: specs/ecommerce.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Checkout information validation', () => {
  test('Checkout Continue is blocked until first name, last name, and postal code are provided', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com and log in as standard_user / secret_sauce
    await page.goto('https://www.saucedemo.com');
    await expect(page).toHaveTitle('Swag Labs');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // 2. Add Sauce Labs Backpack and open the cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');

    // 3. Click Checkout
    await page.locator('[data-test="checkout"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('');
    await expect(page.locator('[data-test="lastName"]')).toHaveValue('');
    await expect(page.locator('[data-test="postalCode"]')).toHaveValue('');
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
    await expect(page.locator('[data-test="continue"]')).toBeVisible();

    // 4. Click Continue with all fields empty
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
    await expect(page.locator('[data-test="error-button"]')).toBeVisible();

    // 5. Fill First Name with Ada, leave Last Name and Postal Code empty, click Continue
    await page.locator('[data-test="firstName"]').fill('Ada');
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');

    // 6. Fill Last Name with Lovelace, leave Zip/Postal Code empty, click Continue
    await page.locator('[data-test="lastName"]').fill('Lovelace');
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
    await expect(page.getByText('Checkout: Overview', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Thank you for your order!', { exact: true })).toHaveCount(0);
  });
});

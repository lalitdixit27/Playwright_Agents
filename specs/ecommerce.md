# Core shopper operations / Sauce Demo

## Application Overview

Sauce Labs **Swag Labs** demo store at [https://www.saucedemo.com](https://www.saucedemo.com) (canonical URL; `https://saucedemo.com` redirects here). This plan covers **five independent e-commerce shopper operations** after login: browse/sort/product details, add to cart, manage cart (remove), checkout field validation, and complete purchase with confirmation.

This is **not** a login-only plan. Authentication is only a setup step inside each scenario. Login, locked-out user, and logout coverage lives in [`specs/login.md`](login.md) — **do not overwrite that file**.

Public credentials are printed on the login page. Use them as shown; do not invent other secrets.

- **Username for all scenarios in this plan:** `standard_user`
- **Password:** `secret_sauce`

### Project implementation notes (for the generator)

- Playwright `^1.61.1`, config `playwright.config.ts`: `testDir: ./tests`, `fullyParallel: true`, projects **chromium / firefox / webkit**, reporter **html**, `trace: on-first-retry`. **`baseURL` is not set** — every test must `page.goto('https://www.saucedemo.com')` (or the full post-login URL) unless config is updated later.
- Use standard fixtures only: `import { test, expect } from '@playwright/test'` and `{ page }`. There are no custom fixtures or page objects yet. Seed/setup lives in `tests/seed.spec.ts` (placeholder `test('seed')`). Do not copy `tests/example.spec.ts` (Playwright.dev demo).
- Prefer stable locators: `getByRole` and `[data-test=...]` as observed on the live site.
- Scenarios are **independent**. Each test starts from a **blank/fresh browser context**. Do not share storage state between tests. Each scenario that needs the store must log in as `standard_user` in its own steps.
- Suggested files live under `tests/ecommerce/`.
- Cart quantity cannot be incremented/decremented on this site; the only cart line action is **Remove**. There is no quantity stepper.

### Shared login steps (repeat in every scenario)

  1. Navigate to `https://www.saucedemo.com`
    - expect: Document title **Swag Labs**; Login form visible
  2. Fill Username `[data-test="username"]` with `standard_user` and Password `[data-test="password"]` with `secret_sauce`
  3. Click Login `[data-test="login-button"]`
    - expect: URL `https://www.saucedemo.com/inventory.html`
    - expect: Title `[data-test="title"]` is **Products**

Login locators (same as `specs/login.md`): Username `getByRole('textbox', { name: 'Username' })` / `[data-test="username"]`; Password `[data-test="password"]`; Login `[data-test="login-button"]`.

### Live-site locators and outcomes (observed 2026-09-25)

**URLs** (document title remains **Swag Labs** on every store page)

| Page | URL |
| --- | --- |
| Login | `https://www.saucedemo.com/` |
| Inventory / Products | `https://www.saucedemo.com/inventory.html` |
| Product details (Backpack) | `https://www.saucedemo.com/inventory-item.html?id=4` |
| Cart | `https://www.saucedemo.com/cart.html` |
| Checkout information | `https://www.saucedemo.com/checkout-step-one.html` |
| Checkout overview | `https://www.saucedemo.com/checkout-step-two.html` |
| Checkout complete | `https://www.saucedemo.com/checkout-complete.html` |

**Product ids** (title/image links `item-{id}-title-link` / `item-{id}-img-link`)

| Product | id | List price | Add (inventory) | Remove (inventory/cart) |
| --- | --- | --- | --- | --- |
| Sauce Labs Bike Light | 0 | `$9.99` | `add-to-cart-sauce-labs-bike-light` | `remove-sauce-labs-bike-light` |
| Sauce Labs Bolt T-Shirt | 1 | `$15.99` | `add-to-cart-sauce-labs-bolt-t-shirt` | `remove-sauce-labs-bolt-t-shirt` |
| Sauce Labs Onesie | 2 | `$7.99` | `add-to-cart-sauce-labs-onesie` | `remove-sauce-labs-onesie` |
| Test.allTheThings() T-Shirt (Red) | 3 | `$15.99` | `add-to-cart-test.allthethings()-t-shirt-(red)` | `remove-test.allthethings()-t-shirt-(red)` |
| Sauce Labs Backpack | 4 | `$29.99` | `add-to-cart-sauce-labs-backpack` | `remove-sauce-labs-backpack` |
| Sauce Labs Fleece Jacket | 5 | `$49.99` | `add-to-cart-sauce-labs-fleece-jacket` | `remove-sauce-labs-fleece-jacket` |

**Catalog / header**

| UI | Locator / role | Notes |
| --- | --- | --- |
| Inventory title | `[data-test="title"]` | **Products** |
| Sort combobox | `[data-test="product-sort-container"]`, name **Sort products** | Values: `az` Name (A to Z), `za` Name (Z to A), `lohi` Price (low to high), `hilo` Price (high to low) |
| Active sort label | `[data-test="active-option"]` | Mirrors selected option text |
| Item name | `[data-test="inventory-item-name"]` | Also used as `getByRole('button', { name: 'View details for Sauce Labs Backpack' })` |
| Item price | `[data-test="inventory-item-price"]` | e.g. `$29.99` |
| Cart link | `[data-test="shopping-cart-link"]` | Empty: `aria-label="Cart, empty"`; with n items: `Cart, n items` |
| Cart badge | `[data-test="shopping-cart-badge"]` | Absent when empty; text `"1"`, `"2"`, … |
| Open Menu | `getByRole('button', { name: 'Open Menu' })`, `#react-burger-menu-btn` | |
| All Items | `[data-test="inventory-sidebar-link"]` | **All Items** |
| Dynamic Catalog | `[data-test="dynamic-catalog-sidebar-link"]` | Extra store surface; **out of scope** for these 5 scenarios |
| About | `[data-test="about-sidebar-link"]` | `https://saucelabs.com/` |
| Logout | `[data-test="logout-sidebar-link"]` | Covered in `specs/login.md` |
| Reset App State | `[data-test="reset-sidebar-link"]` | **Reset App State** |

**Default Name (A to Z) catalog order:** Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, Test.allTheThings() T-Shirt (Red).

**Price (low to high) order observed:** Onesie `$7.99`, Bike Light `$9.99`, Bolt T-Shirt `$15.99`, Red T-Shirt `$15.99`, Backpack `$29.99`, Fleece Jacket `$49.99`.

**Product details (Backpack `id=4`)**

| UI | Locator | Notes |
| --- | --- | --- |
| Back to products | `[data-test="back-to-products"]` | Button text **Back to products** |
| Name / desc / price | `[data-test="inventory-item-name"]`, `inventory-item-desc`, `inventory-item-price` | Name **Sauce Labs Backpack**, price `$29.99` |
| Add / Remove | `[data-test="add-to-cart"]` / `[data-test="remove"]` | IDs `#add-to-cart` / `#remove` (generic, not slug-specific) |
| Image | `[data-test="item-sauce-labs-backpack-img"]` | alt **Sauce Labs Backpack** |

**Cart (`/cart.html`)**

| UI | Locator | Notes |
| --- | --- | --- |
| Title | `[data-test="title"]` | **Your Cart** |
| Qty column header | visible text **QTY** | Line qty `[data-test="item-quantity"]` is `"1"` (no qty editor) |
| Continue Shopping | `[data-test="continue-shopping"]` | Returns to `/inventory.html` |
| Checkout | `[data-test="checkout"]` | Goes to `/checkout-step-one.html` |

**Checkout information (`/checkout-step-one.html`)**

| UI | Locator | Notes |
| --- | --- | --- |
| Title | `[data-test="title"]` | **Checkout: Your Information** |
| Form | `form` name **Checkout information** | |
| First Name | `[data-test="firstName"]`, `#first-name` | placeholder / aria **First Name** |
| Last Name | `[data-test="lastName"]`, `#last-name` | **Last Name** |
| Zip/Postal Code | `[data-test="postalCode"]`, `#postal-code` | **Zip/Postal Code** |
| Cancel | `[data-test="cancel"]` | Returns to cart |
| Continue | `[data-test="continue"]` | `type="submit"` |
| Error alert | `[data-test="error"]` (`role="alert"`) | Dismiss: `[data-test="error-button"]` / **Dismiss error** |

**Checkout error copy (exact; no `Epic sadface:` prefix)**

- All fields empty (or first name empty): `Error: First Name is required`
- First name filled, last name empty: `Error: Last Name is required`
- First and last filled, postal empty: `Error: Postal Code is required`

Failed Continue stays on `https://www.saucedemo.com/checkout-step-one.html`.

**Checkout overview (`/checkout-step-two.html`) for Backpack `$29.99`**

| UI | Locator | Observed text |
| --- | --- | --- |
| Title | `[data-test="title"]` | **Checkout: Overview** |
| Payment | `[data-test="payment-info-label"]` / `payment-info-value` | **Payment Information:** / **SauceCard #31337** |
| Shipping | `[data-test="shipping-info-label"]` / `shipping-info-value` | **Shipping Information:** / **Free Pony Express Delivery!** |
| Item total | `[data-test="subtotal-label"]` | **Item total: $29.99** |
| Tax | `[data-test="tax-label"]` | **Tax: $2.40** |
| Total | `[data-test="total-label"]` | **Total: $32.39** |
| Finish | `[data-test="finish"]` | **Finish** |
| Cancel | `[data-test="cancel"]` | **Cancel** (returns toward inventory) |

**Checkout complete (`/checkout-complete.html`)**

| UI | Locator | Observed text |
| --- | --- | --- |
| Title | `[data-test="title"]` | **Checkout: Complete!** |
| Header | `[data-test="complete-header"]` (h2) | **Thank you for your order!** |
| Body | `[data-test="complete-text"]` | **Your order has been dispatched, and will arrive just as fast as the pony can get there!** |
| Pony image | `[data-test="pony-express"]` | alt **Pony Express** |
| Back Home | `[data-test="back-to-products"]` | Button text **Back Home** → `/inventory.html`; cart empty |
| Generate PDF order | `[data-test="generate-pdf-order"]` | Present on live site; **out of scope** for these 5 scenarios |
| Cart after complete | `[data-test="shopping-cart-link"]` | `aria-label="Cart, empty"`; no badge |

## Test Scenarios

### 1. Browse catalog, sort, and view product details

**Seed:** `tests/seed.spec.ts`

#### 1.1 Shopper can sort the catalog and open a product details page

**File:** `tests/ecommerce/shopper-can-browse-sort-and-view-product-details.spec.ts`

**Assumptions:** Fresh browser context, no stored session. Log in as `standard_user` / `secret_sauce` as part of this test. Do not add items to the cart.

**Success criteria:** After login, six products appear in Name (A to Z) order; sorting to Price (low to high) reorders with Onesie first at `$7.99` and Fleece last at `$49.99`; opening Sauce Labs Backpack lands on `/inventory-item.html?id=4` with name, description, `$29.99`, and **Add to cart**; **Back to products** returns to `/inventory.html`.

**Failure conditions:** Wrong default order, sort does not change order or active option, details URL/id wrong, missing price/description, or cart badge appearing.

**Steps:**

  1. Navigate to `https://www.saucedemo.com` and log in as `standard_user` / `secret_sauce`
    - expect: URL is `https://www.saucedemo.com/inventory.html`
    - expect: `[data-test="title"]` is **Products**
    - expect: Cart control is `Cart, empty` (no `[data-test="shopping-cart-badge"]`)
  2. Observe the product list with default sort **Name (A to Z)** (`[data-test="product-sort-container"]` value `az`, `[data-test="active-option"]` **Name (A to Z)**)
    - expect: Six products are listed
    - expect: Names in order: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, Test.allTheThings() T-Shirt (Red)
    - expect: Backpack price is `$29.99`; Bike Light `$9.99`; Bolt T-Shirt `$15.99`; Fleece Jacket `$49.99`; Onesie `$7.99`; Red T-Shirt `$15.99`
  3. Select sort option **Price (low to high)** (value `lohi`)
    - expect: `[data-test="active-option"]` is **Price (low to high)**
    - expect: First product is Sauce Labs Onesie at `$7.99`
    - expect: Second is Sauce Labs Bike Light at `$9.99`
    - expect: Last is Sauce Labs Fleece Jacket at `$49.99`
  4. Click the Sauce Labs Backpack name (or **View details for Sauce Labs Backpack** / `[data-test="item-4-title-link"]`)
    - expect: URL is `https://www.saucedemo.com/inventory-item.html?id=4`
    - expect: `[data-test="inventory-item-name"]` is **Sauce Labs Backpack**
    - expect: Description contains `carry.allTheThings()`
    - expect: Price is `$29.99`
    - expect: Button **Add to cart** (`[data-test="add-to-cart"]`) is visible
    - expect: **Back to products** (`[data-test="back-to-products"]`) is visible
    - expect: Sort combobox is not shown on the details page
  5. Click **Back to products**
    - expect: URL is `https://www.saucedemo.com/inventory.html`
    - expect: **Products** title is visible again
    - expect: Cart is still empty

### 2. Add items to cart and see badge and cart contents

**Seed:** `tests/seed.spec.ts`

#### 2.1 Shopper can add items from inventory and see them in the cart

**File:** `tests/ecommerce/shopper-can-add-items-to-cart.spec.ts`

**Assumptions:** Fresh session. Log in as `standard_user`. Start with an empty cart. Add from the inventory list (not only from details).

**Success criteria:** Adding Backpack then Bike Light shows badge **2** and `Cart, 2 items`; inventory buttons toggle to **Remove**; cart page lists both products with qty **1**, prices `$29.99` and `$9.99`, and **Checkout** / **Continue Shopping**.

**Failure conditions:** Badge missing/wrong count, cart empty, items missing or duplicated, or URL not `/cart.html`.

**Steps:**

  1. Navigate to `https://www.saucedemo.com` and log in as `standard_user` / `secret_sauce`
    - expect: Products inventory; cart empty
  2. Click **Add to cart** on Sauce Labs Backpack (`[data-test="add-to-cart-sauce-labs-backpack"]`)
    - expect: That control becomes **Remove** (`[data-test="remove-sauce-labs-backpack"]`)
    - expect: Badge `[data-test="shopping-cart-badge"]` shows `1`
    - expect: Cart `aria-label` is **Cart, 1 items**
  3. Click **Add to cart** on Sauce Labs Bike Light (`[data-test="add-to-cart-sauce-labs-bike-light"]`)
    - expect: Bike Light control becomes **Remove** (`[data-test="remove-sauce-labs-bike-light"]`)
    - expect: Badge shows `2`
    - expect: Cart `aria-label` is **Cart, 2 items**
  4. Click the cart link `[data-test="shopping-cart-link"]`
    - expect: URL is `https://www.saucedemo.com/cart.html`
    - expect: Title is **Your Cart**
    - expect: Line items include Sauce Labs Backpack `$29.99` qty `1` and Sauce Labs Bike Light `$9.99` qty `1`
    - expect: Each line has **Remove**
    - expect: **Continue Shopping** and **Checkout** are visible
  5. Click **Continue Shopping** (`[data-test="continue-shopping"]`)
    - expect: URL is `https://www.saucedemo.com/inventory.html`
    - expect: Badge still shows `2`
    - expect: Backpack and Bike Light still show **Remove**

### 3. Remove an item from the cart before purchase

**Seed:** `tests/seed.spec.ts`

#### 3.1 Shopper can remove a cart line and keep the remaining item

**File:** `tests/ecommerce/shopper-can-remove-item-from-cart.spec.ts`

**Assumptions:** Fresh session. Log in as `standard_user`. This test must add its own two items; do not depend on scenario 2. The store has no quantity update control — removal is the cart management action.

**Success criteria:** After removing Bike Light from `/cart.html`, only Backpack remains, badge is `1`, Bike Light is gone. Returning to inventory, Bike Light shows **Add to cart** again while Backpack still shows **Remove**.

**Failure conditions:** Both items remain, cart empties entirely, badge stale at `2`, or wrong product removed.

**Steps:**

  1. Navigate to `https://www.saucedemo.com` and log in as `standard_user` / `secret_sauce`
    - expect: Products inventory; cart empty
  2. Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart (inventory **Add to cart** buttons)
    - expect: Badge shows `2`
  3. Open the cart (`[data-test="shopping-cart-link"]`)
    - expect: URL is `https://www.saucedemo.com/cart.html`
    - expect: Both Backpack and Bike Light are listed
  4. Click **Remove** on Sauce Labs Bike Light (`[data-test="remove-sauce-labs-bike-light"]`)
    - expect: Bike Light is no longer listed
    - expect: Sauce Labs Backpack remains with qty `1` and `$29.99`
    - expect: Badge shows `1` and cart label is **Cart, 1 items**
    - expect: **Checkout** is still visible
  5. Click **Continue Shopping**
    - expect: URL is `https://www.saucedemo.com/inventory.html`
    - expect: Backpack button is **Remove** (`[data-test="remove-sauce-labs-backpack"]`)
    - expect: Bike Light button is **Add to cart** (`[data-test="add-to-cart-sauce-labs-bike-light"]`)
    - expect: Badge still shows `1`

### 4. Checkout information validation

**Seed:** `tests/seed.spec.ts`

#### 4.1 Checkout Continue is blocked until first name, last name, and postal code are provided

**File:** `tests/ecommerce/checkout-requires-customer-information.spec.ts`

**Assumptions:** Fresh session. Log in as `standard_user`. Add at least Sauce Labs Backpack so Checkout is a real shopper path (empty-cart checkout is not this scenario). Stay on step one; do **not** complete the order here (purchase is scenario 5).

**Success criteria:** Each missing required field keeps the URL on `/checkout-step-one.html` and shows the exact error strings below. Filling all three fields is **not** required for this test to pass; asserting the three sequential errors is enough. Optionally dismiss the banner with **Dismiss error**.

**Failure conditions:** Navigation to `/checkout-step-two.html` or `/checkout-complete.html` while a field is empty; login-style `Epic sadface:` errors; silent submit.

**Steps:**

  1. Navigate to `https://www.saucedemo.com` and log in as `standard_user` / `secret_sauce`
    - expect: Products inventory
  2. Add Sauce Labs Backpack (`[data-test="add-to-cart-sauce-labs-backpack"]`) and open the cart
    - expect: URL `/cart.html`; Backpack listed
  3. Click **Checkout** (`[data-test="checkout"]`)
    - expect: URL is `https://www.saucedemo.com/checkout-step-one.html`
    - expect: Title is **Checkout: Your Information**
    - expect: First Name, Last Name, and Zip/Postal Code textboxes are empty
    - expect: **Cancel** and **Continue** are visible
  4. Click **Continue** with all fields empty
    - expect: URL remains `https://www.saucedemo.com/checkout-step-one.html`
    - expect: Alert `[data-test="error"]` text is exactly `Error: First Name is required`
    - expect: **Dismiss error** (`[data-test="error-button"]`) is present
  5. Fill First Name with `Ada`, leave Last Name and Postal Code empty, click **Continue**
    - expect: URL remains `/checkout-step-one.html`
    - expect: Alert text is exactly `Error: Last Name is required`
  6. Fill Last Name with `Lovelace`, leave Zip/Postal Code empty, click **Continue**
    - expect: URL remains `/checkout-step-one.html`
    - expect: Alert text is exactly `Error: Postal Code is required`
    - expect: Overview (**Checkout: Overview**) and complete (**Thank you for your order!**) are not shown

### 5. Place order and see confirmation

**Seed:** `tests/seed.spec.ts`

#### 5.1 Shopper can complete checkout and see the thank-you page

**File:** `tests/ecommerce/shopper-can-complete-checkout.spec.ts`

**Assumptions:** Fresh session. Log in as `standard_user`. Use a single **Sauce Labs Backpack** so overview totals match the observed `$29.99` / tax `$2.40` / total `$32.39`. Use checkout info `Ada` / `Lovelace` / `94043` (any non-empty valid-looking values work; these were used on the live site). Do not share state with scenario 4.

**Success criteria:** Overview shows Backpack, SauceCard payment, pony shipping, and the three price lines above. Finish lands on `/checkout-complete.html` with **Thank you for your order!** and the dispatch copy. Cart is empty. **Back Home** returns to Products with Backpack showing **Add to cart** again.

**Failure conditions:** Wrong totals, stuck on step one with a validation error, missing thank-you copy, or cart still showing the backpack after Finish.

**Steps:**

  1. Navigate to `https://www.saucedemo.com` and log in as `standard_user` / `secret_sauce`
    - expect: Products inventory; cart empty
  2. Add Sauce Labs Backpack and open the cart, then click **Checkout**
    - expect: URL is `https://www.saucedemo.com/checkout-step-one.html`
  3. Fill First Name `Ada` (`[data-test="firstName"]`), Last Name `Lovelace` (`[data-test="lastName"]`), Zip/Postal Code `94043` (`[data-test="postalCode"]`), then click **Continue**
    - expect: URL is `https://www.saucedemo.com/checkout-step-two.html`
    - expect: Title is **Checkout: Overview**
    - expect: Line item Sauce Labs Backpack, qty `1`, `$29.99`
    - expect: **Payment Information:** **SauceCard #31337**
    - expect: **Shipping Information:** **Free Pony Express Delivery!**
    - expect: **Item total: $29.99** (`[data-test="subtotal-label"]`)
    - expect: **Tax: $2.40** (`[data-test="tax-label"]`)
    - expect: **Total: $32.39** (`[data-test="total-label"]`)
    - expect: **Finish** and **Cancel** are visible
    - expect: Cart badge still shows `1`
  4. Click **Finish** (`[data-test="finish"]`)
    - expect: URL is `https://www.saucedemo.com/checkout-complete.html`
    - expect: Title is **Checkout: Complete!**
    - expect: Heading `[data-test="complete-header"]` is **Thank you for your order!**
    - expect: `[data-test="complete-text"]` is **Your order has been dispatched, and will arrive just as fast as the pony can get there!**
    - expect: Pony Express image is visible
    - expect: **Back Home** is visible
    - expect: Cart is **Cart, empty** (no badge)
  5. Click **Back Home** (`[data-test="back-to-products"]`)
    - expect: URL is `https://www.saucedemo.com/inventory.html`
    - expect: Title is **Products**
    - expect: Sauce Labs Backpack shows **Add to cart** again
    - expect: Cart remains empty

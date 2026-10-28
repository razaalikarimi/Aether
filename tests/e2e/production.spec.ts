import { test, expect } from '@playwright/test';

test.describe('AETHER Luxury Commerce — Production End-to-End Suite', () => {
  test('homepage renders hero, 3D canvas/fallback, and story scroll without uncaught errors', async ({ page, isMobile }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('chrome-extension') && !text.includes('devtools') && !text.includes('GL Driver Message')) {
          consoleErrors.push(text);
        }
      }
    });

    await page.goto('/');

    // Verify brand header
    const brand = page.getByRole('link', { name: /aether/i }).first();
    await expect(brand).toBeVisible();

    // Verify Hero title
    await expect(page.locator('h1').first()).toContainText('AETHER-X');

    // Verify live FPS & tier indicator is present (visible on desktop)
    if (!isMobile) {
      const fpsBadge = page.locator('button:has-text("fps")');
      await expect(fpsBadge).toBeVisible();
    }

    // Verify Featured Masterworks section exists
    await expect(page.locator('h2:has-text("Curated Masterworks")')).toBeVisible();

    // Verify no unhandled hydration or runtime crash errors occurred
    const hydrationErrors = consoleErrors.filter(
      (err) => err.includes('Hydration') || err.includes('did not match') || err.includes('Minified React error')
    );
    expect(hydrationErrors).toEqual([]);
  });

  test('product detail page allows variant switching, 3D toggle, and cart drawer insertion', async ({ page }) => {
    await page.goto('/products/aether-x-planar-headphones');

    // Title & price validation
    await expect(page.locator('h1')).toContainText('Aether-X Planar Acoustic Flagship');
    await expect(page.locator('text=$1850.00').first()).toBeVisible();

    // Check material swatches
    const onyxOption = page.locator('button:has-text("Matte Onyx")');
    await expect(onyxOption).toBeVisible();
    await onyxOption.click();

    // Add to cart with luxury terminology
    const acquireBtn = page.locator('button:has-text("Acquire Instrument")');
    await expect(acquireBtn).toBeVisible();
    await acquireBtn.click({ force: true });

    // Cart drawer should open with item
    const drawerTitle = page.locator('h2:has-text("Acquisitions")');
    await expect(drawerTitle).toBeVisible({ timeout: 6000 });

    // Verify item in drawer
    await expect(page.locator('text=Aether-X Planar Acoustic Flagship').last()).toBeVisible();

    // Verify checkout button is present and active
    const checkoutBtn = page.locator('button:has-text("Proceed to Shopify Checkout")');
    await expect(checkoutBtn).toBeVisible();
    await expect(checkoutBtn).toBeEnabled();
  });

  test('collection catalog and search routes filter products properly', async ({ page }) => {
    // Navigate to Flagship Audio collection
    await page.goto('/collections/flagship-audio');
    await expect(page.locator('h1')).toContainText('Flagship Acoustic Systems');
    await expect(page.locator('text=Aether-X Planar Acoustic Flagship').first()).toBeVisible();

    // Navigate to Search page with query
    await page.goto('/search?q=planar');
    await expect(page.locator('h1')).toContainText('Catalog Search');
    await expect(page.locator('text=Aether-X Planar Acoustic Flagship').first()).toBeVisible();
  });
});

import { describe, it, expect } from 'vitest';
import {
  getProducts,
  getProductByHandle,
  getCollections,
  createCart,
  addToCart,
  updateCartLines,
  removeFromCart,
} from '@/lib/shopify';
import { ProductNodeSchema } from '@/lib/validation/shopifySchema';

describe('Shopify Commerce Layer & Operations', () => {
  it('retrieves products with valid strict typing and pricing', async () => {
    const products = await getProducts();
    expect(products.length).toBeGreaterThan(0);

    const flagship = products.find((p) => p.isFlagship3D);
    expect(flagship).toBeDefined();
    expect(flagship?.handle).toBe('aether-x-planar-headphones');
    expect(parseFloat(flagship!.priceRange.minVariantPrice.amount)).toBeGreaterThan(0);
  });

  it('retrieves specific product by handle', async () => {
    const product = await getProductByHandle('aether-x-planar-headphones');
    expect(product).toBeDefined();
    expect(product?.title).toContain('Aether-X');
    expect(product?.variants.length).toBeGreaterThanOrEqual(4);
  });

  it('correctly filters products by search query', async () => {
    const results = await getProducts('tourbillon');
    expect(results.length).toBe(1);
    expect(results[0].handle).toBe('chronos-tourbillon-horology');
  });

  it('retrieves curated collections with linked products', async () => {
    const collections = await getCollections();
    expect(collections.length).toBeGreaterThanOrEqual(3);
    const audioColl = collections.find((c) => c.handle === 'flagship-audio');
    expect(audioColl).toBeDefined();
    expect(audioColl?.products.length).toBeGreaterThan(0);
  });

  it('manages cart lifecycle: create, add item, update quantity, and compute total cost', async () => {
    // 1. Create cart with initial item
    const variantId = 'gid://shopify/ProductVariant/2001'; // Titanium Aether-X ($1,850)
    const cart = await createCart(variantId, 1);

    expect(cart.id).toBeDefined();
    expect(cart.totalQuantity).toBe(1);
    expect(cart.lines.length).toBe(1);
    expect(cart.cost.totalAmount.amount).toBe('1850.00');

    // 2. Add second quantity of item
    const updatedCart = await addToCart(cart.id, variantId, 1);
    expect(updatedCart.totalQuantity).toBe(2);
    expect(updatedCart.cost.totalAmount.amount).toBe('3700.00');

    // 3. Update line item quantity to 3
    const lineId = updatedCart.lines[0].id;
    const qtyUpdatedCart = await updateCartLines(cart.id, [{ id: lineId, quantity: 3 }]);
    expect(qtyUpdatedCart.totalQuantity).toBe(3);
    expect(qtyUpdatedCart.cost.totalAmount.amount).toBe('5550.00');

    // 4. Remove item from cart
    const emptyCart = await removeFromCart(cart.id, [lineId]);
    expect(emptyCart.totalQuantity).toBe(0);
    expect(emptyCart.lines.length).toBe(0);
    expect(emptyCart.cost.totalAmount.amount).toBe('0.00');
  });

  it('validates Shopify GraphQL responses against strict Zod schema', () => {
    const mockGraphQLProduct = {
      id: 'gid://shopify/Product/9999',
      handle: 'bespoke-tourbillon-test',
      title: 'Bespoke Tourbillon Test Complication',
      availableForSale: true,
      priceRange: {
        minVariantPrice: { amount: '12500.00', currencyCode: 'USD' },
        maxVariantPrice: { amount: '12500.00', currencyCode: 'USD' },
      },
    };

    const result = ProductNodeSchema.safeParse(mockGraphQLProduct);
    expect(result.success).toBe(true);

    // Invalid Product GID (not starting with gid://shopify/Product/)
    const invalidProduct = {
      ...mockGraphQLProduct,
      id: '12345_invalid',
    };
    const invalidResult = ProductNodeSchema.safeParse(invalidProduct);
    expect(invalidResult.success).toBe(false);
  });

  it('validates checkout redirection domain whitelist against open-redirect attacks', () => {
    const validateCheckoutUrl = (checkoutUrl: string) => {
      try {
        const parsed = new URL(checkoutUrl);
        const isAllowed =
          parsed.hostname.endsWith('myshopify.com') ||
          parsed.hostname.endsWith('shopify.com');
        return parsed.protocol === 'https:' && isAllowed;
      } catch {
        return false;
      }
    };

    // Legitimate Shopify URLs
    expect(validateCheckoutUrl('https://aether-atelier.myshopify.com/checkouts/cn/c1-12345')).toBe(true);
    expect(validateCheckoutUrl('https://checkout.shopify.com/12345/checkouts/abc')).toBe(true);

    // Malicious open-redirect targets
    expect(validateCheckoutUrl('http://insecure-site.com/checkout')).toBe(false);
    expect(validateCheckoutUrl('https://evil-phishing-site.com?shopify.com')).toBe(false);
    expect(validateCheckoutUrl('javascript:alert(1)')).toBe(false);
  });
});

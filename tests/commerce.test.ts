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
});

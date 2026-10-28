import {
  Product,
  Collection,
  Cart,
  CartItem,
  ProductVariant,
  MoneyV2,
  SelectedOption,
  ProductOption,
} from '@/types/commerce';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  GET_CART_QUERY,
} from './queries';
import { MOCK_PRODUCTS, MOCK_COLLECTIONS, createInitialCart } from './mockData';
import {
  ProductNodeSchema,
  CartNodeSchema,
} from '@/lib/validation/shopifySchema';

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-07';
const isProduction = process.env.NODE_ENV === 'production';

export const isLiveShopifyConfigured = Boolean(
  domain &&
    storefrontAccessToken &&
    !domain.includes('placeholder') &&
    !storefrontAccessToken.includes('placeholder')
);

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; field?: string[] }>;
}

interface ShopifyImageNode {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

interface ShopifyVariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  sku?: string | null;
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  selectedOptions: SelectedOption[];
  image?: ShopifyImageNode | null;
}

interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description?: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  featuredImage?: ShopifyImageNode | null;
  images?: {
    edges: Array<{ node: ShopifyImageNode }>;
  };
  options?: ProductOption[];
  variants?: {
    edges: Array<{ node: ShopifyVariantNode }>;
  };
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  tags?: string[];
  vendor?: string;
  productType?: string;
}

interface ShopifyCollectionNode {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: ShopifyImageNode | null;
  products?: {
    edges: Array<{ node: ShopifyProductNode }>;
  };
}

interface ShopifyCartLineNode {
  id: string;
  quantity: number;
  cost: {
    totalAmount: MoneyV2;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    price: MoneyV2;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImageNode;
    };
  };
}

interface ShopifyCartNode {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
    totalTaxAmount?: MoneyV2 | null;
  };
  lines: {
    edges: Array<{ node: ShopifyCartLineNode }>;
  };
}

async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T | null> {
  if (!isLiveShopifyConfigured) {
    if (isProduction) {
      console.error(
        '[Shopify Storefront Config] Production environment detected without valid SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN.'
      );
    }
    return null;
  }

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second network timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      signal: controller.signal,
      ...(tags ? { next: { tags } } : {}),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[Shopify Storefront API Error] HTTP ${response.status}: ${response.statusText}`);
      return null;
    }

    const json = (await response.json()) as GraphQLResponse<T>;

    if (json.errors && json.errors.length > 0) {
      console.error('[Shopify Storefront GraphQL Errors]:', json.errors);
      return null;
    }

    return json.data ?? null;
  } catch (error) {
    console.error('[Shopify Network Timeout or Exception]:', error);
    return null;
  }
}

function transformShopifyProduct(node: ShopifyProductNode): Product {
  // Validate node shape with Zod in runtime
  const parseResult = ProductNodeSchema.safeParse(node);
  if (!parseResult.success) {
    console.warn('[Zod Validation Warning] Product schema mismatch:', parseResult.error.format());
  }

  const images =
    node.images?.edges?.map((edge) => ({
      url: edge.node.url,
      altText: edge.node.altText,
      width: edge.node.width,
      height: edge.node.height,
    })) || [];

  const variants: ProductVariant[] =
    node.variants?.edges?.map((edge) => {
      const v = edge.node;
      let materialPreset: 'titanium' | 'onyx' | 'silver' | 'gold' = 'titanium';
      const titleLower = v.title.toLowerCase();
      if (titleLower.includes('onyx') || titleLower.includes('black')) materialPreset = 'onyx';
      else if (titleLower.includes('gold') || titleLower.includes('champagne')) materialPreset = 'gold';
      else if (titleLower.includes('silver') || titleLower.includes('chrome')) materialPreset = 'silver';

      return {
        ...v,
        materialPreset,
      };
    }) || [];

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description || '',
    descriptionHtml: node.descriptionHtml,
    availableForSale: node.availableForSale,
    featuredImage: node.featuredImage || {
      url: images[0]?.url || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
      altText: node.title,
    },
    images: images.length > 0 ? images : [
      {
        url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
        altText: node.title,
      }
    ],
    options: node.options || [],
    variants,
    priceRange: node.priceRange,
    tags: node.tags || [],
    vendor: node.vendor || 'AETHER',
    productType: node.productType || 'Hardware',
    isFlagship3D: node.tags?.includes('Flagship') || node.handle.includes('planar') || false,
  };
}

let activeMockCart: Cart | null = null;

export async function getProducts(query?: string): Promise<Product[]> {
  if (isLiveShopifyConfigured) {
    const data = await shopifyFetch<{
      products: { edges: Array<{ node: ShopifyProductNode }> };
    }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first: 20, query },
      tags: ['products'],
    });

    if (data?.products?.edges) {
      return data.products.edges.map((edge) => transformShopifyProduct(edge.node));
    }

    if (isProduction) {
      console.error('[Shopify Production Error] Failed to retrieve live products from Shopify.');
      return [];
    }
  }

  // Development-only mock mode with clear logging
  if (!isProduction) {
    console.info('[Aether Development] Serving curated local mock catalog.');
  }

  if (query) {
    const q = query.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  return MOCK_PRODUCTS;
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (isLiveShopifyConfigured) {
    const data = await shopifyFetch<{
      product: ShopifyProductNode;
    }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
      tags: [`product-${handle}`],
    });

    if (data?.product) {
      return transformShopifyProduct(data.product);
    }

    if (isProduction) {
      return null;
    }
  }

  const found = MOCK_PRODUCTS.find((p) => p.handle === handle);
  return found || null;
}

export async function getCollections(): Promise<Collection[]> {
  if (isLiveShopifyConfigured) {
    const data = await shopifyFetch<{
      collections: {
        edges: Array<{ node: ShopifyCollectionNode }>;
      };
    }>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first: 10 },
      tags: ['collections'],
    });

    if (data?.collections?.edges) {
      return data.collections.edges.map((edge) => ({
        id: edge.node.id,
        handle: edge.node.handle,
        title: edge.node.title,
        description: edge.node.description || '',
        image: edge.node.image,
        products: edge.node.products?.edges?.map((pEdge) =>
          transformShopifyProduct(pEdge.node)
        ) || [],
      }));
    }

    if (isProduction) {
      return [];
    }
  }

  return MOCK_COLLECTIONS;
}

export async function getCollectionByHandle(handle: string): Promise<Collection | null> {
  const collections = await getCollections();
  return collections.find((c) => c.handle === handle) || null;
}

function transformShopifyCart(rawCart: ShopifyCartNode): Cart {
  // Validate cart node shape with Zod
  const parseResult = CartNodeSchema.safeParse(rawCart);
  if (!parseResult.success) {
    console.warn('[Zod Validation Warning] Cart schema mismatch:', parseResult.error.format());
  }

  return {
    id: rawCart.id,
    checkoutUrl: rawCart.checkoutUrl,
    totalQuantity: rawCart.totalQuantity,
    cost: rawCart.cost,
    lines: rawCart.lines.edges.map((edge): CartItem => edge.node),
  };
}

export async function createCart(variantId?: string, quantity: number = 1): Promise<Cart> {
  if (isLiveShopifyConfigured) {
    const input = variantId
      ? {
          lines: [{ merchandiseId: variantId, quantity }],
        }
      : {};

    const data = await shopifyFetch<{
      cartCreate: { cart: ShopifyCartNode; userErrors: Array<{ message: string }> };
    }>({
      query: CREATE_CART_MUTATION,
      variables: { input },
      cache: 'no-store',
    });

    if (data?.cartCreate?.cart) {
      return transformShopifyCart(data.cartCreate.cart);
    }

    if (isProduction) {
      throw new Error('[Shopify API Error] Failed to create cart on live Shopify Storefront.');
    }
  }

  const mockCart = createInitialCart();
  if (variantId) {
    for (const p of MOCK_PRODUCTS) {
      const v = p.variants.find((item) => item.id === variantId);
      if (v) {
        mockCart.lines.push({
          id: 'line_' + Math.random().toString(36).substring(2, 9),
          quantity,
          cost: {
            totalAmount: {
              amount: (parseFloat(v.price.amount) * quantity).toFixed(2),
              currencyCode: v.price.currencyCode,
            },
          },
          merchandise: {
            id: v.id,
            title: v.title,
            selectedOptions: v.selectedOptions,
            price: v.price,
            product: {
              id: p.id,
              handle: p.handle,
              title: p.title,
              featuredImage: p.featuredImage,
            },
          },
        });
        mockCart.totalQuantity = quantity;
        const total = parseFloat(v.price.amount) * quantity;
        mockCart.cost.subtotalAmount.amount = total.toFixed(2);
        mockCart.cost.totalAmount.amount = total.toFixed(2);
        break;
      }
    }
  }
  activeMockCart = mockCart;
  return mockCart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<Cart> {
  if (isLiveShopifyConfigured) {
    const data = await shopifyFetch<{
      cartLinesAdd: { cart: ShopifyCartNode; userErrors: Array<{ message: string }> };
    }>({
      query: ADD_TO_CART_MUTATION,
      variables: {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      },
      cache: 'no-store',
    });

    if (data?.cartLinesAdd?.cart) {
      return transformShopifyCart(data.cartLinesAdd.cart);
    }

    if (isProduction) {
      throw new Error('[Shopify API Error] Failed to add item to live Shopify cart.');
    }
  }

  const cart = activeMockCart || createInitialCart();
  let found = false;
  for (const line of cart.lines) {
    if (line.merchandise.id === variantId) {
      line.quantity += quantity;
      const unit = parseFloat(line.merchandise.price.amount);
      line.cost.totalAmount.amount = (unit * line.quantity).toFixed(2);
      found = true;
      break;
    }
  }

  if (!found) {
    for (const p of MOCK_PRODUCTS) {
      const v = p.variants.find((item) => item.id === variantId);
      if (v) {
        cart.lines.push({
          id: 'line_' + Math.random().toString(36).substring(2, 9),
          quantity,
          cost: {
            totalAmount: {
              amount: (parseFloat(v.price.amount) * quantity).toFixed(2),
              currencyCode: v.price.currencyCode,
            },
          },
          merchandise: {
            id: v.id,
            title: v.title,
            selectedOptions: v.selectedOptions,
            price: v.price,
            product: {
              id: p.id,
              handle: p.handle,
              title: p.title,
              featuredImage: p.featuredImage,
            },
          },
        });
        break;
      }
    }
  }

  let totalQty = 0;
  let totalCost = 0;
  for (const l of cart.lines) {
    totalQty += l.quantity;
    totalCost += parseFloat(l.cost.totalAmount.amount);
  }
  cart.totalQuantity = totalQty;
  cart.cost.subtotalAmount.amount = totalCost.toFixed(2);
  cart.cost.totalAmount.amount = totalCost.toFixed(2);

  activeMockCart = cart;
  return cart;
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<Cart> {
  if (isLiveShopifyConfigured) {
    const data = await shopifyFetch<{
      cartLinesUpdate: { cart: ShopifyCartNode; userErrors: Array<{ message: string }> };
    }>({
      query: UPDATE_CART_MUTATION,
      variables: { cartId, lines },
      cache: 'no-store',
    });

    if (data?.cartLinesUpdate?.cart) {
      return transformShopifyCart(data.cartLinesUpdate.cart);
    }

    if (isProduction) {
      throw new Error('[Shopify API Error] Failed to update line items in live Shopify cart.');
    }
  }

  const cart = activeMockCart || createInitialCart();
  for (const upd of lines) {
    const line = cart.lines.find((l) => l.id === upd.id);
    if (line) {
      line.quantity = upd.quantity;
      const unit = parseFloat(line.merchandise.price.amount);
      line.cost.totalAmount.amount = (unit * line.quantity).toFixed(2);
    }
  }
  cart.lines = cart.lines.filter((l) => l.quantity > 0);

  let totalQty = 0;
  let totalCost = 0;
  for (const l of cart.lines) {
    totalQty += l.quantity;
    totalCost += parseFloat(l.cost.totalAmount.amount);
  }
  cart.totalQuantity = totalQty;
  cart.cost.subtotalAmount.amount = totalCost.toFixed(2);
  cart.cost.totalAmount.amount = totalCost.toFixed(2);

  activeMockCart = cart;
  return cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  if (isLiveShopifyConfigured) {
    const data = await shopifyFetch<{
      cartLinesRemove: { cart: ShopifyCartNode; userErrors: Array<{ message: string }> };
    }>({
      query: REMOVE_FROM_CART_MUTATION,
      variables: { cartId, lineIds },
      cache: 'no-store',
    });

    if (data?.cartLinesRemove?.cart) {
      return transformShopifyCart(data.cartLinesRemove.cart);
    }

    if (isProduction) {
      throw new Error('[Shopify API Error] Failed to remove line items from live Shopify cart.');
    }
  }

  const cart = activeMockCart || createInitialCart();
  cart.lines = cart.lines.filter((l) => !lineIds.includes(l.id));

  let totalQty = 0;
  let totalCost = 0;
  for (const l of cart.lines) {
    totalQty += l.quantity;
    totalCost += parseFloat(l.cost.totalAmount.amount);
  }
  cart.totalQuantity = totalQty;
  cart.cost.subtotalAmount.amount = totalCost.toFixed(2);
  cart.cost.totalAmount.amount = totalCost.toFixed(2);

  activeMockCart = cart;
  return cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  if (isLiveShopifyConfigured) {
    const data = await shopifyFetch<{
      cart: ShopifyCartNode;
    }>({
      query: GET_CART_QUERY,
      variables: { cartId },
      cache: 'no-store',
    });

    if (data?.cart) {
      return transformShopifyCart(data.cart);
    }

    if (isProduction) {
      return null;
    }
  }

  return activeMockCart || createInitialCart();
}

/**
 * Strict TypeScript types for Commerce & Shopify Storefront GraphQL operations.
 * Zero `any` policy.
 */

export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ImageSource {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  image?: ImageSource | null;
  sku?: string | null;
  // Material / finish mapping for 3D synchronization
  materialPreset?: 'titanium' | 'onyx' | 'silver' | 'gold';
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  featuredImage: ImageSource;
  images: ImageSource[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  tags: string[];
  vendor: string;
  productType: string;
  // Specifications for luxury flagship view
  specifications?: Record<string, string>;
  isFlagship3D?: boolean;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ImageSource | null;
  products: Product[];
}

export interface CartItem {
  id: string;
  quantity: number;
  cost: {
    totalAmount: MoneyV2;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ImageSource;
    };
    price: MoneyV2;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
    totalTaxAmount?: MoneyV2 | null;
  };
  totalQuantity: number;
  lines: CartItem[];
}

export interface ShopifyError {
  message: string;
  field?: string[];
}

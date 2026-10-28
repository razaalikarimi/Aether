import { z } from 'zod';

export const MoneyV2Schema = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const ImageNodeSchema = z.object({
  url: z.string().url(),
  altText: z.string().nullable().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const SelectedOptionSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const VariantNodeSchema = z.object({
  id: z.string().startsWith('gid://shopify/ProductVariant/'),
  title: z.string(),
  availableForSale: z.boolean(),
  sku: z.string().nullable().optional(),
  price: MoneyV2Schema,
  compareAtPrice: MoneyV2Schema.nullable().optional(),
  selectedOptions: z.array(SelectedOptionSchema),
  image: ImageNodeSchema.nullable().optional(),
});

export const ProductNodeSchema = z.object({
  id: z.string().startsWith('gid://shopify/Product/'),
  handle: z.string(),
  title: z.string(),
  description: z.string().optional(),
  descriptionHtml: z.string().optional(),
  availableForSale: z.boolean(),
  featuredImage: ImageNodeSchema.nullable().optional(),
  images: z
    .object({
      edges: z.array(z.object({ node: ImageNodeSchema })),
    })
    .optional(),
  options: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        values: z.array(z.string()),
      })
    )
    .optional(),
  variants: z
    .object({
      edges: z.array(z.object({ node: VariantNodeSchema })),
    })
    .optional(),
  priceRange: z.object({
    minVariantPrice: MoneyV2Schema,
    maxVariantPrice: MoneyV2Schema,
  }),
  tags: z.array(z.string()).optional(),
  vendor: z.string().optional(),
  productType: z.string().optional(),
});

export const CartLineNodeSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
  cost: z.object({
    totalAmount: MoneyV2Schema,
  }),
  merchandise: z.object({
    id: z.string().startsWith('gid://shopify/ProductVariant/'),
    title: z.string(),
    selectedOptions: z.array(SelectedOptionSchema),
    price: MoneyV2Schema,
    product: z.object({
      id: z.string(),
      handle: z.string(),
      title: z.string(),
      featuredImage: ImageNodeSchema,
    }),
  }),
});

export const CartNodeSchema = z.object({
  id: z.string(),
  checkoutUrl: z.string().url(),
  totalQuantity: z.number().int().nonnegative(),
  cost: z.object({
    subtotalAmount: MoneyV2Schema,
    totalAmount: MoneyV2Schema,
    totalTaxAmount: MoneyV2Schema.nullable().optional(),
  }),
  lines: z.object({
    edges: z.array(z.object({ node: CartLineNodeSchema })),
  }),
});

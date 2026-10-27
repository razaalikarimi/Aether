/**
 * Shopify Storefront GraphQL API Queries & Mutations
 * Compliant with 2024-07+ API Schema
 */

export const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    productType
    vendor
    tags
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      id
      name
      values
    }
    variants(first: 25) {
      edges {
        node {
          id
          title
          availableForSale
          sku
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

export const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
              product {
                id
                handle
                title
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query getProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
`;

export const GET_COLLECTIONS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
          }
          products(first: 10) {
            edges {
              node {
                ...ProductFragment
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation createCart($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const ADD_TO_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const UPDATE_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = `
  ${CART_FRAGMENT}
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
`;

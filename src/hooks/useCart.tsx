'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Cart } from '@/types/commerce';
import { createInitialCart } from '@/lib/shopify/mockData';

interface CartContextValue {
  cart: Cart;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  checkout: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'aether_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(createInitialCart());
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMutatingRef = useRef(false);

  // Initialize cart on mount via secure server route
  useEffect(() => {
    async function initCart() {
      try {
        const savedCartId = localStorage.getItem(CART_STORAGE_KEY);
        const url = savedCartId
          ? `/api/cart?cartId=${encodeURIComponent(savedCartId)}`
          : '/api/cart';

        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data: Cart = await res.json();
          setCart(data);
          localStorage.setItem(CART_STORAGE_KEY, data.id);
        }
      } catch (err) {
        console.error('[Cart Init Error]:', err);
      }
    }
    initCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // In-flight mutex protected add
  const addItem = async (variantId: string, quantity = 1) => {
    if (isMutatingRef.current) {
      console.warn('[Cart Protection] In-flight mutation already active. Dropping duplicate request.');
      return;
    }

    isMutatingRef.current = true;
    setIsLoading(true);

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          cartId: cart.id,
          variantId,
          quantity,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const updated: Cart = await res.json();
      setCart(updated);
      setIsOpen(true);
    } catch (err) {
      console.error('[Cart Add Error]:', err);
    } finally {
      setIsLoading(false);
      isMutatingRef.current = false;
    }
  };

  // In-flight mutex protected update
  const updateQuantity = async (lineId: string, quantity: number) => {
    if (isMutatingRef.current) return;
    isMutatingRef.current = true;
    setIsLoading(true);

    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: cart.id,
          lines: [{ id: lineId, quantity }],
        }),
      });

      if (res.ok) {
        const updated: Cart = await res.json();
        setCart(updated);
      }
    } catch (err) {
      console.error('[Cart Update Error]:', err);
    } finally {
      setIsLoading(false);
      isMutatingRef.current = false;
    }
  };

  // In-flight mutex protected remove
  const removeItem = async (lineId: string) => {
    if (isMutatingRef.current) return;
    isMutatingRef.current = true;
    setIsLoading(true);

    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId: cart.id,
          lineIds: [lineId],
        }),
      });

      if (res.ok) {
        const updated: Cart = await res.json();
        setCart(updated);
      }
    } catch (err) {
      console.error('[Cart Remove Error]:', err);
    } finally {
      setIsLoading(false);
      isMutatingRef.current = false;
    }
  };

  // Safe checkout URL redirection with host verification (CWE-601 prevention)
  const checkout = () => {
    if (!cart.checkoutUrl) return;

    try {
      const parsed = new URL(cart.checkoutUrl);
      const isAllowedHost =
        parsed.hostname.endsWith('myshopify.com') ||
        parsed.hostname.endsWith('shopify.com') ||
        parsed.hostname === window.location.hostname;

      if (parsed.protocol === 'https:' && isAllowedHost) {
        window.location.href = cart.checkoutUrl;
      } else {
        console.error('[Security Redirection Blocked] Untrusted checkout URL domain:', cart.checkoutUrl);
      }
    } catch (e) {
      console.error('[Security Malformed Checkout URL]:', e);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

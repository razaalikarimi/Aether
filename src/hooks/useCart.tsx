'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart } from '@/types/commerce';
import { createInitialCart } from '@/lib/shopify/mockData';
import {
  createCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  getCart,
} from '@/lib/shopify/client';

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

  // Initialize cart on mount
  useEffect(() => {
    async function initCart() {
      try {
        const savedCartId = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCartId) {
          const existing = await getCart(savedCartId);
          if (existing) {
            setCart(existing);
            return;
          }
        }
        const newCart = await createCart();
        localStorage.setItem(CART_STORAGE_KEY, newCart.id);
        setCart(newCart);
      } catch (err) {
        console.error('Cart initialization error:', err);
      }
    }
    initCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      const updated = await addToCart(cart.id, variantId, quantity);
      setCart(updated);
      setIsOpen(true);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const updated = await updateCartLines(cart.id, [{ id: lineId, quantity }]);
      setCart(updated);
    } catch (err) {
      console.error('Failed to update cart quantity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    setIsLoading(true);
    try {
      const updated = await removeFromCart(cart.id, [lineId]);
      setCart(updated);
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkout = () => {
    if (cart.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
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

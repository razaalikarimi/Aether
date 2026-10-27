'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, checkout, isLoading } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0a0f] border-l border-white/[0.08] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-accent-gold" />
              <h2 className="text-sm font-mono uppercase tracking-widest text-white">
                Acquisitions ({cart.totalQuantity})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/[0.05] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Line items scroll area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.lines.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-text-muted">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white font-medium">Your collection is empty</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Explore our engineered instruments and horology.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-4 px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              cart.lines.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-card flex-shrink-0 border border-white/[0.05]">
                    {item.merchandise.product.featuredImage?.url && (
                      <Image
                        src={item.merchandise.product.featuredImage.url}
                        alt={item.merchandise.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.merchandise.product.handle}`}
                          onClick={closeCart}
                          className="text-sm font-medium text-white hover:text-accent-gold transition-colors line-clamp-1"
                        >
                          {item.merchandise.product.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-text-muted hover:text-rose-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-text-secondary font-mono mt-0.5">
                        {item.merchandise.title}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/40">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1.5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-white/10 text-text-secondary hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-sm text-white">
                        ${item.cost.totalAmount.amount}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.lines.length > 0 && (
            <div className="p-6 border-t border-white/[0.08] bg-[#07070a]/90 space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="text-white">${cart.cost.subtotalAmount.amount}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Insured Courier Delivery</span>
                  <span className="text-emerald-400 uppercase">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm text-white pt-2 border-t border-white/[0.06] font-sans font-medium">
                  <span>Total</span>
                  <span className="font-mono">${cart.cost.totalAmount.amount}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={checkout}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-medium tracking-wide flex items-center justify-center gap-3 bg-white text-black hover:bg-neutral-200 active:scale-[0.99] transition-all duration-300 shadow-xl disabled:opacity-50"
              >
                <span>Proceed to Shopify Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shopify Encrypted 256-bit Transaction Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

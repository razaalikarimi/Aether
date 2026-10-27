'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, checkout, isLoading } = useCart();

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-8">
      <div className="pb-6 border-b border-white/[0.08]">
        <h1 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight">
          Your Collection ({cart.totalQuantity})
        </h1>
      </div>

      {cart.lines.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-text-muted mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-white text-lg">Your acquisition bag is currently empty.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 rounded-full bg-white text-black text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-colors"
          >
            Explore Masterworks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items list */}
          <div className="lg:col-span-8 space-y-4">
            {cart.lines.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-3xl bg-surface-card/60 border border-white/[0.08]"
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-black/40 border border-white/[0.06] flex-shrink-0">
                    {item.merchandise.product.featuredImage?.url && (
                      <Image
                        src={item.merchandise.product.featuredImage.url}
                        alt={item.merchandise.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.merchandise.product.handle}`}
                      className="text-base font-medium text-white hover:text-accent-gold transition-colors"
                    >
                      {item.merchandise.product.title}
                    </Link>
                    <p className="text-xs font-mono text-text-secondary mt-1">
                      {item.merchandise.title}
                    </p>
                    <p className="text-sm font-mono text-white mt-2">
                      ${item.merchandise.price.amount} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                  <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-black/40 p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="p-1.5 text-text-secondary hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono text-white">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-text-secondary hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-lg font-mono text-white font-medium min-w-[90px] text-right">
                    ${item.cost.totalAmount.amount}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-text-muted hover:text-rose-400 transition-colors p-2"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cost Summary Box */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-surface-card border border-white/[0.08] space-y-6 h-fit">
            <h2 className="text-lg font-display text-white">Acquisition Summary</h2>
            <div className="space-y-3 text-xs font-mono text-text-secondary border-b border-white/[0.08] pb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${cart.cost.subtotalAmount.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Courier Shipping</span>
                <span className="text-emerald-400 uppercase">Complimentary</span>
              </div>
              <div className="flex justify-between">
                <span>Customs & Duties</span>
                <span className="text-text-muted">Calculated at Checkout</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline text-white">
              <span className="text-base font-medium">Estimated Total</span>
              <span className="text-2xl font-mono">${cart.cost.totalAmount.amount}</span>
            </div>

            <button
              type="button"
              onClick={checkout}
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-white text-black font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all shadow-xl"
            >
              <span>Proceed to Official Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Shopify 256-Bit Encrypted Secure Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

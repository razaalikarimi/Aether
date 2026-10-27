'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/commerce';
import { useCart } from '@/hooks/useCart';
import { ShoppingBag, ArrowUpRight, Check, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { addItem, isLoading } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const activeVariant = product.variants[selectedVariantIndex] || product.variants[0];

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activeVariant) return;
    await addItem(activeVariant.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formattedIndex = String(index).padStart(2, '0');

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative flex flex-col rounded-3xl bg-surface-card/40 border border-white/[0.08] hover:border-white/25 overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_rgba(0,0,0,0.7)]"
    >
      {/* Visual Image Container with Dynamic Ambient Glow */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Ambient Subtle Highlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent opacity-80" />

        {/* Top Badges & Edition Number */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-widest text-text-secondary">
              № {formattedIndex} {'//'} {product.productType}
            </span>
          </div>

          {product.isFlagship3D && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-gold/15 backdrop-blur-md border border-accent-gold/30 text-[9px] font-mono uppercase tracking-wider text-accent-gold">
              <Sparkles className="w-3 h-3" /> 3D Flagship
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isLoading || !product.availableForSale}
            aria-label={`Quick add ${product.title} to cart`}
            className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 shadow-xl transition-transform active:scale-90"
          >
            {added ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-display text-white font-normal group-hover:text-accent-gold transition-colors line-clamp-1">
              {product.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-white transition-colors flex-shrink-0" />
          </div>
          <p className="mt-2 text-xs text-text-secondary line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Live Finish Swatches if variant has finishes */}
        {product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.variants.slice(0, 4).map((variant, vIdx) => (
              <button
                key={variant.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantIndex(vIdx);
                }}
                className={`w-3 h-3 rounded-full border transition-all ${
                  selectedVariantIndex === vIdx
                    ? 'border-accent-gold scale-125'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor:
                    variant.materialPreset === 'gold'
                      ? '#d4af37'
                      : variant.materialPreset === 'onyx'
                      ? '#1c1d22'
                      : variant.materialPreset === 'silver'
                      ? '#e2e6f0'
                      : '#8d929b',
                }}
                title={variant.title}
              />
            ))}
            <span className="text-[10px] font-mono text-text-muted pl-1">
              {activeVariant.title.split('/')[0]}
            </span>
          </div>
        )}

        {/* Pricing & Stock Indicator */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-mono text-white font-medium">
              ${activeVariant.price.amount}
            </span>
            {activeVariant.compareAtPrice && (
              <span className="text-xs font-mono text-text-muted line-through">
                ${activeVariant.compareAtPrice.amount}
              </span>
            )}
          </div>

          <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400">
            {activeVariant.availableForSale ? 'Allocations Verified' : 'Sold Out'}
          </span>
        </div>
      </div>
    </Link>
  );
}

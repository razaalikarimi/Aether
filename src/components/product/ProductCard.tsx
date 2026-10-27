'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/commerce';
import { useCart } from '@/hooks/useCart';
import { ShoppingBag, ArrowUpRight, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isLoading } = useCart();
  const [added, setAdded] = useState(false);

  const primaryVariant = product.variants[0];

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!primaryVariant) return;
    await addItem(primaryVariant.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative flex flex-col rounded-3xl bg-surface-card/40 border border-white/[0.08] hover:border-white/25 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
    >
      {/* Visual Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-text-secondary">
            {product.productType}
          </span>
          {product.isFlagship3D && (
            <span className="px-2.5 py-1 rounded-full bg-accent-gold/20 backdrop-blur-md border border-accent-gold/30 text-[10px] font-mono uppercase tracking-wider text-accent-gold">
              3D Flagship
            </span>
          )}
        </div>

        {/* Quick Add Button on Hover */}
        <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isLoading || !product.availableForSale}
            aria-label={`Quick add ${product.title} to cart`}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 shadow-xl transition-transform active:scale-90"
          >
            {added ? <Check className="w-4 h-4 text-emerald-600" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-display text-white font-normal group-hover:text-accent-gold transition-colors line-clamp-1">
              {product.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-white transition-colors flex-shrink-0" />
          </div>
          <p className="mt-1.5 text-xs text-text-secondary line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Bottom Pricing & Variants */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-mono text-white">
              ${product.priceRange.minVariantPrice.amount}
            </span>
            {product.variants.length > 1 && (
              <span className="text-[10px] font-mono text-text-muted">
                ({product.variants.length} finishes)
              </span>
            )}
          </div>

          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
            {product.availableForSale ? 'Available' : 'Allocated'}
          </span>
        </div>
      </div>
    </Link>
  );
}

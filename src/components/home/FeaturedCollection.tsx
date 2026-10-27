'use client';

import React, { useState } from 'react';
import { Product } from '@/types/commerce';
import { ProductCard } from '../product/ProductCard';
import { Sparkles } from 'lucide-react';

interface FeaturedCollectionProps {
  products: Product[];
}

export function FeaturedCollection({ products }: FeaturedCollectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'Flagship Audio' | 'Timepiece' | 'Security Hardware'>('all');

  const filteredProducts = products.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.productType === selectedFilter;
  });

  return (
    <section className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-accent-gold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> The Permanent Collection
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight">
            Curated Masterworks
          </h2>
          <p className="mt-2 text-xs md:text-sm text-text-secondary max-w-lg leading-relaxed">
            Each artifact represents an uncompromising synthesis of aerospace engineering,
            horological precision, and acoustic purity.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: 'All Artifacts' },
              { id: 'Flagship Audio', label: 'Acoustics' },
              { id: 'Timepiece', label: 'Horology' },
              { id: 'Security Hardware', label: 'Enclosures' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${
                selectedFilter === tab.id
                  ? 'bg-white text-black font-medium shadow-lg'
                  : 'bg-white/[0.03] text-text-secondary hover:text-white border border-white/[0.06] hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

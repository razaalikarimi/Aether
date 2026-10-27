'use client';

import React, { useState } from 'react';
import { Product } from '@/types/commerce';
import { ProductCard } from '../product/ProductCard';
import { Sparkles, Compass } from 'lucide-react';

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
      {/* Atelier Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-accent-gold uppercase tracking-[0.2em] mb-3">
            <Sparkles className="w-3 h-3" /> Permanent Archive
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight">
            Curated Masterworks
          </h2>
          <p className="mt-2 text-xs md:text-sm text-text-secondary max-w-lg leading-relaxed">
            Each artifact represents an uncompromising synthesis of aerospace metallurgy,
            micro-mechanical complication, and uncompressed acoustic purity.
          </p>
        </div>

        {/* Filter Tabs with Active Indicators */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: 'All Artifacts' },
              { id: 'Flagship Audio', label: 'Acoustics' },
              { id: 'Timepiece', label: 'Horology' },
              { id: 'Security Hardware', label: 'Hardware Enclosures' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 ${
                selectedFilter === tab.id
                  ? 'bg-white text-black font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)]'
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
        {filteredProducts.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx + 1} />
        ))}
      </div>

      {/* Atelier Craftsmanship Note */}
      <div className="mt-16 p-8 rounded-3xl bg-surface-card/30 border border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-accent-gold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-display text-white font-normal">
              Individually Numbered & Acoustically Auditioned
            </h4>
            <p className="text-xs text-text-secondary">
              Every unit undergoes 48 hours of spectral response verification in Zurich before worldwide insured courier dispatch.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-accent-gold uppercase tracking-widest whitespace-nowrap">
          Global Courier Delivery Included
        </span>
      </div>
    </section>
  );
}

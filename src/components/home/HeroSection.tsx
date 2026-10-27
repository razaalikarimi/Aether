'use client';

import React from 'react';
import Link from 'next/link';
import { ProductVariant } from '@/types/commerce';
import { ArrowDown, Sparkles, Shield, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  activeVariant?: ProductVariant;
  onExploreClick?: () => void;
}

export function HeroSection({
  activeVariant,
  onExploreClick,
}: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between pt-28 pb-12 px-6 md:px-12 pointer-events-none">
      {/* Top Tagline & Specification Badges */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-auto">
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-text-secondary">
            Bespoke Transducer Atelier
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-xs font-mono text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-accent-gold" /> Grade 5 Titanium
          </span>
          <span className="text-white/20">/</span>
          <span>4Hz – 52kHz</span>
          <span className="text-white/20">/</span>
          <span className="text-accent-gold">&lt; 0.02% THD</span>
        </div>
      </div>

      {/* Center Editorial Typography */}
      <div className="max-w-7xl w-full mx-auto my-auto text-center pointer-events-none select-none">
        <p className="font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-accent-gold mb-3 animate-fade-in">
          Flagship Planar Transducer
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extralight tracking-tight text-white leading-none">
          AETHER-X
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-xs sm:text-sm md:text-base text-text-secondary font-light tracking-wide leading-relaxed">
          Machined from solid aerospace titanium. Acoustically tuned with nanometer planar
          magnetic arrays for transcendent spatial clarity.
        </p>
      </div>

      {/* Bottom Commerce Actions & Scroll Indicator */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-auto">
        {/* Price & Variant Pill */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase text-text-muted">
              Edition Price
            </span>
            <span className="text-2xl font-mono font-medium text-white">
              ${activeVariant?.price.amount || '1,850.00'}
            </span>
          </div>

          <Link
            href="/products/aether-x-planar-headphones"
            className="px-6 py-3.5 rounded-xl bg-white text-black font-medium text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <span>Acquire Flagship</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Scroll exploration indicator */}
        <button
          type="button"
          onClick={onExploreClick}
          className="group flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-white transition-colors"
        >
          <span>Explore Architecture</span>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent-gold group-hover:translate-y-1 transition-all">
            <ArrowDown className="w-3.5 h-3.5 text-accent-gold" />
          </div>
        </button>
      </div>
    </section>
  );
}

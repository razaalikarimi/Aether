'use client';

import React from 'react';
import Link from 'next/link';
import { ProductVariant } from '@/types/commerce';
import { ArrowDown, Sparkles, Shield, ChevronRight, Activity } from 'lucide-react';

interface HeroSectionProps {
  activeVariant?: ProductVariant;
  onExploreClick?: () => void;
}

export function HeroSection({
  activeVariant,
  onExploreClick,
}: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between pt-28 pb-10 px-6 md:px-12 pointer-events-none">
      {/* Top Editorial Folio & Technical Coordinates */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-accent-gold" />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-text-secondary">
              № 001 {'//'} Masterwork Planar Transducer
            </span>
          </div>
          <span className="hidden lg:inline text-[10px] font-mono text-text-muted tracking-wider">
            ZURICH ATELIER {'//'} 47°22&apos;N 8°32&apos;E
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-[11px] font-mono text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-accent-gold" /> Grade 5 Titanium
          </span>
          <span className="text-white/20">/</span>
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-accent-cyan" /> 4 Hz – 52 kHz
          </span>
          <span className="text-white/20">/</span>
          <span className="text-accent-gold">&lt; 0.02% THD</span>
        </div>
      </div>

      {/* Center Editorial Typography with Layered Scale */}
      <div className="max-w-7xl w-full mx-auto my-auto text-center pointer-events-none select-none py-6">
        <div className="inline-block relative">
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.45em] text-accent-gold mb-2">
            Acoustic Engineering Flagship
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-display font-extralight tracking-tight text-white leading-none">
            AETHER-X
          </h1>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs sm:text-sm font-serif italic text-white/50">
            <span>Machined Titanium Chassis</span>
            <span>—</span>
            <span>Nanometer Symmetrical Planar Arrays</span>
          </div>
        </div>

        <p className="mt-4 max-w-xl mx-auto text-xs sm:text-sm text-text-secondary font-light tracking-wide leading-relaxed">
          Crafted from solid Ti-6Al-4V aerospace alloy. Acoustically voiced for transcendental
          harmonic transparency and holographic spatial separation.
        </p>
      </div>

      {/* Bottom Commerce Deck & Chapter Navigation */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-auto border-t border-white/[0.06] pt-6">
        {/* Edition Price & Acquisition */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted">
              Edition Valuation
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-mono font-medium text-white">
                ${activeVariant?.price.amount || '1,850.00'}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 uppercase">
                Allocation Open
              </span>
            </div>
          </div>

          <Link
            href="/products/aether-x-planar-headphones"
            className="px-6 py-3.5 rounded-xl bg-white text-black font-medium text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95"
          >
            <span>Acquire Flagship</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Scroll Exploration Cue with Animated Pulse */}
        <button
          type="button"
          onClick={onExploreClick}
          className="group flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-text-secondary hover:text-white transition-colors"
        >
          <div className="flex flex-col text-right">
            <span>Cinematic Sequence</span>
            <span className="text-[10px] text-accent-gold">Scroll to Disassemble</span>
          </div>
          <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent-gold group-hover:translate-y-1 transition-all bg-white/[0.02]">
            <ArrowDown className="w-4 h-4 text-accent-gold" />
          </div>
        </button>
      </div>
    </section>
  );
}

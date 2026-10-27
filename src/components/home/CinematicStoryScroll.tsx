'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ProductVariant } from '@/types/commerce';
import { MaterialPresetId } from '@/types/three';
import { HeroSection } from './HeroSection';
import { MATERIAL_SPECS } from '../three/HeroProductModel';
import { useCart } from '@/hooks/useCart';
import { Shield, Sparkles, Layers, Sliders, ArrowRight, Check } from 'lucide-react';

// Dynamic import with SSR disabled for Three.js Canvas
const Scene = dynamic(() => import('../three/Scene').then((mod) => mod.Scene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#070709]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] font-mono text-text-muted uppercase tracking-widest">
          Initializing 3D Engine
        </span>
      </div>
    </div>
  ),
});

interface CinematicStoryScrollProps {
  variants: ProductVariant[];
}

export function CinematicStoryScroll({ variants }: CinematicStoryScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [explodedProgress, setExplodedProgress] = useState(0);
  const [activePreset, setActivePreset] = useState<MaterialPresetId>('titanium');
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(variants[0]);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const { addItem, isLoading } = useCart();

  // Scroll listener for sticky cinematic storytelling
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalHeight));
      setScrollProgress(progress);

      // Map progress to exploded view between 0.55 and 0.8
      if (progress >= 0.55 && progress <= 0.8) {
        const p = (progress - 0.55) / 0.15;
        // Peak explosion around 0.7, then reassembly starts at 0.75
        if (progress <= 0.7) {
          setExplodedProgress(Math.min(1, p));
        } else {
          const reassemblyP = 1.0 - (progress - 0.7) / 0.1;
          setExplodedProgress(Math.max(0, reassemblyP));
        }
      } else if (progress > 0.8) {
        setExplodedProgress(0);
      } else {
        setExplodedProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectPreset = (preset: MaterialPresetId) => {
    setActivePreset(preset);
    const found = variants.find((v) => v.materialPreset === preset);
    if (found) {
      setActiveVariant(found);
    }
  };

  const handleAddToCart = async () => {
    if (!activeVariant) return;
    await addItem(activeVariant.id, 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2200);
  };

  const handleExploreClick = () => {
    if (!containerRef.current) return;
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: 'smooth',
    });
  };

  const currentSpec = MATERIAL_SPECS[activePreset] || MATERIAL_SPECS.titanium;

  return (
    <div ref={containerRef} className="relative w-full h-[450vh] bg-[#070709]">
      {/* Pinned 3D Viewport Anchor */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        {/* Real-time 3D Scene */}
        <div className="absolute inset-0 z-0">
          <Scene
            materialPreset={activePreset}
            scrollProgress={scrollProgress}
            explodedProgress={explodedProgress}
            variants={variants}
            selectedVariantId={activeVariant?.id}
            onSelectVariant={setActiveVariant}
          />
        </div>

        {/* Dynamic Storytelling Text Overlays based on scrollProgress */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
          {/* STAGE 1: HERO OVERLAY (0 - 0.22) */}
          <div
            className={`transition-opacity duration-700 ${
              scrollProgress < 0.22 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <HeroSection
              activeVariant={activeVariant}
              onExploreClick={handleExploreClick}
            />
          </div>

          {/* STAGE 2: ORBITAL EXPLORATION (0.22 - 0.45) */}
          <div
            className={`absolute inset-0 flex items-center justify-start max-w-7xl mx-auto px-6 md:px-12 transition-opacity duration-700 ${
              scrollProgress >= 0.22 && scrollProgress < 0.45
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="max-w-md bg-surface-card/60 backdrop-blur-xl p-8 rounded-3xl border border-white/[0.08] pointer-events-auto space-y-4 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-[10px] font-mono uppercase tracking-wider">
                <Shield className="w-3 h-3" /> Orbital Exploration
              </div>
              <h2 className="text-2xl md:text-3xl font-display text-white font-light">
                Monolithic Grade 5 Titanium Chassis
              </h2>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Every headband arch and gimbal yoke is machined on 5-axis CNC mills from a
                single solid billet of aerospace-grade titanium alloy. Zero welds, zero resonance,
                eternal structural permanence.
              </p>
              <div className="pt-2 flex items-center gap-6 text-xs font-mono text-text-muted">
                <span>Chassis Weight: 385g</span>
                <span>•</span>
                <span>5-Axis CNC Milled</span>
              </div>
            </div>
          </div>

          {/* STAGE 3: EXPLODED VIEW & NANOMETER DIAPHRAGM (0.45 - 0.72) */}
          <div
            className={`absolute inset-0 flex items-center justify-end max-w-7xl mx-auto px-6 md:px-12 transition-opacity duration-700 ${
              scrollProgress >= 0.45 && scrollProgress < 0.72
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="max-w-md bg-surface-card/60 backdrop-blur-xl p-8 rounded-3xl border border-white/[0.08] pointer-events-auto space-y-4 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-[10px] font-mono uppercase tracking-wider">
                <Layers className="w-3 h-3" /> Exploded Transducer Architecture
              </div>
              <h2 className="text-2xl md:text-3xl font-display text-white font-light">
                50mm Symmetrical Planar Array
              </h2>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Visualizing the exploded acoustic sub-assembly: dual neodymium N52 flux stators,
                gold-vaporized nanometer substrate diaphragm, laser-etched stainless grilles, and
                acoustically transparent damping membranes.
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400">
                Separation telemetry: {Math.round(explodedProgress * 100)}%
              </div>
            </div>
          </div>

          {/* STAGE 4: MATERIAL TRANSFORMATION & ACQUISITION (0.72 - 1.0) */}
          <div
            className={`absolute inset-0 flex items-center justify-center max-w-7xl mx-auto px-6 md:px-12 transition-opacity duration-700 ${
              scrollProgress >= 0.72 ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="max-w-lg w-full bg-surface-card/85 backdrop-blur-2xl p-8 rounded-3xl border border-white/[0.1] pointer-events-auto space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-[10px] font-mono uppercase tracking-wider">
                  <Sliders className="w-3 h-3" /> Bespoke Material Finishing
                </div>
                <span className="text-xs font-mono text-emerald-400">In Stock</span>
              </div>

              <div>
                <h3 className="text-2xl font-display font-light text-white">
                  Acquire The Aether-X Flagship
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Finished in {currentSpec.name}. Includes 4.4mm balanced cable and aluminum vault.
                </p>
              </div>

              {/* Material Switcher Pills */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                  Select Architectural Finish
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['titanium', 'onyx', 'silver', 'gold'] as MaterialPresetId[]).map((preset) => {
                    const spec = MATERIAL_SPECS[preset];
                    const isSelected = activePreset === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-accent-gold bg-accent-gold/[0.1] shadow-[0_0_15px_rgba(226,184,87,0.15)]'
                            : 'border-white/[0.08] bg-black/40 hover:border-white/20'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                          style={{ backgroundColor: spec.color }}
                        />
                        <span className="text-[10px] font-mono capitalize text-text-secondary">
                          {preset}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price and Cart Button */}
              <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/[0.08]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-text-muted uppercase">
                    Total Acquisition
                  </span>
                  <span className="text-2xl font-mono text-white font-medium">
                    ${activeVariant?.price.amount || '1,850.00'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="px-6 py-3.5 rounded-xl bg-white text-black font-medium text-xs tracking-wider uppercase hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Added to Drawer</span>
                    </>
                  ) : (
                    <>
                      <span>Acquire Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Cinematic Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.04]">
          <div
            className="h-full bg-gradient-to-r from-accent-gold via-accent-cyan to-white transition-all duration-150"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

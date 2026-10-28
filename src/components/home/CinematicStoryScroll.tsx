'use client';

import React, { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ProductVariant } from '@/types/commerce';
import { MaterialPresetId } from '@/types/three';
import { HeroSection } from './HeroSection';
import { MATERIAL_SPECS } from '../three/HeroProductModel';
import { useCart } from '@/hooks/useCart';
import { usePerformanceTier } from '@/lib/performance/usePerformanceTier';
import { CinematicProductFallback } from '../three/CinematicProductFallback';
import { Shield, Layers, Sliders, ArrowRight, Check, Activity, Sparkles } from 'lucide-react';

const Scene = dynamic(() => import('../three/Scene').then((mod) => mod.Scene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#070709]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] font-mono text-text-muted uppercase tracking-widest">
          Calibrating Optical Pipeline
        </span>
      </div>
    </div>
  ),
});

interface CinematicStoryScrollProps {
  variants: ProductVariant[];
}

const CHAPTERS = [
  { id: '01', title: 'Reveal', range: [0, 0.22] },
  { id: '02', title: 'Kinematics', range: [0.22, 0.45] },
  { id: '03', title: 'Exploded Transducer', range: [0.45, 0.72] },
  { id: '04', title: 'Metallurgy', range: [0.72, 1.0] },
];

export function CinematicStoryScroll({ variants }: CinematicStoryScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [explodedProgress, setExplodedProgress] = useState(0);
  const [activePreset, setActivePreset] = useState<MaterialPresetId>('titanium');
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(variants[0]);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const { addItem, isLoading } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (totalHeight <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalHeight));
      setScrollProgress(progress);

      // Controlled exploded separation curve
      if (progress >= 0.48 && progress <= 0.75) {
        if (progress <= 0.65) {
          const p = (progress - 0.48) / 0.17;
          setExplodedProgress(Math.min(1, p));
        } else {
          const reassemblyP = 1.0 - (progress - 0.65) / 0.1;
          setExplodedProgress(Math.max(0, reassemblyP));
        }
      } else if (progress > 0.75) {
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
    setTimeout(() => setAddedSuccess(false), 2400);
  };

  const handleExploreClick = () => {
    if (!containerRef.current) return;
    window.scrollTo({
      top: window.innerHeight * 0.95,
      behavior: 'smooth',
    });
  };

  const currentSpec = MATERIAL_SPECS[activePreset] || MATERIAL_SPECS.titanium;
  const { isFallback } = usePerformanceTier();

  if (isFallback) {
    return (
      <div className="relative w-full bg-[#070709] pt-24 pb-8">
        <CinematicProductFallback
          variants={variants}
          selectedVariantId={activeVariant?.id}
          onSelectVariant={setActiveVariant}
          reason="Hardware WebGL Fallback Active"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-[460vh] bg-[#070709]">
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

        {/* Top HUD Chapter Navigation Bar */}
        <div className="absolute top-20 left-0 right-0 z-20 pointer-events-none px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/[0.08]">
              {CHAPTERS.map((ch) => {
                const isActive =
                  scrollProgress >= ch.range[0] && scrollProgress <= ch.range[1];
                return (
                  <div
                    key={ch.id}
                    className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                      isActive ? 'text-accent-gold font-medium' : 'text-text-muted'
                    }`}
                  >
                    <span>{ch.id}</span>
                    <span className="hidden md:inline">{ch.title}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shadow-[0_0_8px_#e2b857]" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Live Audio Telemetry Indicator */}
            <div className="hidden lg:flex items-center gap-3 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/[0.08] text-[10px] font-mono text-text-secondary">
              <Activity className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Acoustic Dispersion: Phase-Coherent Wavefront</span>
            </div>
          </div>
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

          {/* STAGE 2: KINEMATICS & CHASSIS (0.22 - 0.45) */}
          <div
            className={`absolute inset-0 flex items-center justify-start max-w-7xl mx-auto px-6 md:px-12 transition-all duration-700 ${
              scrollProgress >= 0.22 && scrollProgress < 0.45
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="max-w-md bg-surface-card/75 backdrop-blur-2xl p-8 rounded-3xl border border-white/[0.1] pointer-events-auto space-y-4 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3 h-3" /> Chapter 02 {'//'} Kinematic Yoke
                </span>
                <span className="text-[10px] font-mono text-text-muted">Ti-6Al-4V Alloy</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-display text-white font-light leading-snug">
                Monolithic 5-Axis CNC Architecture
              </h2>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Machined from a solid billet of aerospace-grade titanium. The gimbal pivots utilize
                precision micro-bearings, isolating acoustic vibrations while ensuring tailored
                contact pressure against the temporal bone.
              </p>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-text-muted">
                <span>Tolerance: ±2.5 Microns</span>
                <span>Chassis Mass: 385g</span>
              </div>
            </div>
          </div>

          {/* STAGE 3: EXPLODED TRANSDUCER VIEW (0.45 - 0.72) */}
          <div
            className={`absolute inset-0 flex items-center justify-end max-w-7xl mx-auto px-6 md:px-12 transition-all duration-700 ${
              scrollProgress >= 0.45 && scrollProgress < 0.72
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="max-w-md bg-surface-card/75 backdrop-blur-2xl p-8 rounded-3xl border border-white/[0.1] pointer-events-auto space-y-4 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3 h-3" /> Chapter 03 {'//'} Exploded Transducer
                </span>
                <span className="text-[10px] font-mono text-accent-gold">
                  Separation: {Math.round(explodedProgress * 100)}%
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-display text-white font-light leading-snug">
                50mm Symmetrical Planar Array
              </h2>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                Deconstructing the acoustic chamber: dual Neodymium N52 magnetic stator rails
                generate a 1.8 Tesla push-pull flux field, driving a 2.5μm gold-vaporized nanometer
                substrate with zero audible modal distortion.
              </p>

              {/* Exploded Component Specs Pills */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono text-text-secondary">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="text-accent-gold block">Flux Density</span>
                  <span>1.8 Tesla Symmetrical</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="text-accent-cyan block">Diaphragm</span>
                  <span>2.5μm Gold Substrate</span>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 4: METALLURGY & ACQUISITION (0.72 - 1.0) */}
          <div
            className={`absolute inset-0 flex items-center justify-center max-w-7xl mx-auto px-6 md:px-12 transition-all duration-700 ${
              scrollProgress >= 0.72
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div className="max-w-lg w-full bg-surface-card/85 backdrop-blur-2xl p-8 rounded-3xl border border-white/[0.12] pointer-events-auto space-y-6 shadow-[0_30px_70px_rgba(0,0,0,0.85)]">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-[10px] font-mono uppercase tracking-wider">
                  <Sliders className="w-3 h-3" /> Chapter 04 {'//'} Bespoke Metallurgy
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Immediate Allocation</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-light text-white">
                  Acquire The Aether-X Flagship
                </h3>
                <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                  Configured in <span className="text-white font-medium">{currentSpec.name}</span>.
                  Includes bespoke CNC flight case, pure silver 4.4mm balanced cable, and certificate of acoustic audition.
                </p>
              </div>

              {/* Material Switcher Pills */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted flex justify-between">
                  <span>Select Architectural Finish</span>
                  <span className="text-accent-gold uppercase">{activePreset}</span>
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {(['titanium', 'onyx', 'silver', 'gold'] as MaterialPresetId[]).map((preset) => {
                    const spec = MATERIAL_SPECS[preset];
                    const isSelected = activePreset === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                          isSelected
                            ? 'border-accent-gold bg-accent-gold/[0.12] shadow-[0_0_20px_rgba(226,184,87,0.2)] scale-105'
                            : 'border-white/[0.08] bg-black/40 hover:border-white/20 hover:bg-white/[0.02]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shadow-inner"
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
              <div className="pt-4 flex items-center justify-between gap-6 border-t border-white/[0.08]">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">
                    Acquisition Valuation
                  </span>
                  <span className="text-2xl sm:text-3xl font-mono text-white font-medium">
                    ${activeVariant?.price.amount || '1,850.00'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="px-6 py-4 rounded-xl bg-white text-black font-medium text-xs tracking-wider uppercase hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] disabled:opacity-50"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Allocated to Cart</span>
                    </>
                  ) : (
                    <>
                      <span>Acquire Flagship</span>
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

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductVariant } from '@/types/commerce';
import { MaterialPresetId } from '@/types/three';
import { useCart } from '@/hooks/useCart';
import { MATERIAL_SPECS } from './HeroProductModel';
import { Shield, Sparkles, Check, ArrowRight } from 'lucide-react';

interface CinematicProductFallbackProps {
  variants?: ProductVariant[];
  selectedVariantId?: string;
  onSelectVariant?: (variant: ProductVariant) => void;
  reason?: string;
}

export function CinematicProductFallback({
  variants = [],
  selectedVariantId,
  onSelectVariant,
  reason,
}: CinematicProductFallbackProps) {
  const { addItem, isLoading } = useCart();
  const [activePreset, setActivePreset] = useState<MaterialPresetId>('titanium');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const activeVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  const handlePresetChange = (preset: MaterialPresetId) => {
    setActivePreset(preset);
    const matchingVariant = variants.find((v) => v.materialPreset === preset);
    if (matchingVariant && onSelectVariant) {
      onSelectVariant(matchingVariant);
    }
  };

  const handleAddToCart = async () => {
    if (!activeVariant) return;
    await addItem(activeVariant.id, 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2400);
  };

  const currentSpec = MATERIAL_SPECS[activePreset] || MATERIAL_SPECS.titanium;

  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#070709] px-6 py-16">
      {/* Layered Parallax Background Glows */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${currentSpec.accentColor} 0%, transparent 70%)`,
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-card/40 via-surface-void to-surface-void pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Layered Product Presentation with Dynamic Lighting */}
        <div className="lg:col-span-7 relative flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl p-8 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] backdrop-blur-xl shadow-2xl group">
            {/* Animated Shadow & Specular Ring */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent-gold/20 via-transparent to-accent-cyan/20 opacity-40 blur-xl group-hover:opacity-75 transition-opacity duration-1000" />

            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80"
                alt="Aether-X Flagship Headphones Presentation"
                fill
                priority
                className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Hardware Precision Tag */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-text-secondary border-t border-white/[0.06] pt-4">
              <span className="font-mono uppercase tracking-widest text-[10px]">
                Finish: {currentSpec.name}
              </span>
              <span className="flex items-center gap-1 text-accent-gold font-mono">
                <Sparkles className="w-3 h-3" /> Nanometer Planar
              </span>
            </div>
          </div>
        </div>

        {/* Right: Editorial Typography & Functional Commerce Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-text-secondary font-mono">
            <Shield className="w-3.5 h-3.5 text-accent-gold" />
            <span>High-Fidelity Studio Edition</span>
          </div>

          <div>
            <h1 className="text-3xl md:text-5xl font-display font-light tracking-tight text-white leading-tight">
              Aether-X <br />
              <span className="text-white/60 italic font-serif">Planar Flagship</span>
            </h1>
            <p className="mt-3 text-text-secondary text-sm md:text-base leading-relaxed">
              Crafted from monolithic Grade 5 titanium with hand-tensioned planar magnetic
              transducers. Designed for acoustic transcendence.
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 pt-2">
            <span className="text-3xl font-mono text-white font-medium">
              ${activeVariant?.price.amount || '1,850.00'}
            </span>
            {activeVariant?.compareAtPrice && (
              <span className="text-lg font-mono text-text-muted line-through">
                ${activeVariant.compareAtPrice.amount}
              </span>
            )}
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              In Stock & Verified
            </span>
          </div>

          {/* Finish & Material Switcher */}
          <div className="space-y-3 pt-4 border-t border-white/[0.08]">
            <label className="text-xs font-mono uppercase tracking-wider text-text-secondary flex justify-between">
              <span>Select Architecture</span>
              <span className="text-accent-gold font-sans capitalize">{activePreset}</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['titanium', 'onyx', 'silver', 'gold'] as MaterialPresetId[]).map((preset) => {
                const spec = MATERIAL_SPECS[preset];
                const isSelected = activePreset === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetChange(preset)}
                    className={`relative p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                      isSelected
                        ? 'border-accent-gold bg-accent-gold/[0.08] shadow-[0_0_15px_rgba(226,184,87,0.15)]'
                        : 'border-white/[0.08] bg-surface-card/60 hover:border-white/20'
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

          {/* Commerce Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex-1 py-4 px-6 rounded-xl font-medium tracking-wide flex items-center justify-center gap-3 transition-all duration-300 bg-white text-black hover:bg-neutral-200 active:scale-[0.98] shadow-lg disabled:opacity-50"
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to Collection</span>
                </>
              ) : (
                <>
                  <span>Acquire Aether-X</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {reason && (
            <p className="text-[11px] font-mono text-text-muted text-center pt-2">
              Hardware Note: Dynamic 2D presentation active ({reason}).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

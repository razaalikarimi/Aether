'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Product, ProductVariant } from '@/types/commerce';
import { MaterialPresetId } from '@/types/three';
import { useCart } from '@/hooks/useCart';
import { MATERIAL_SPECS } from '@/components/three/HeroProductModel';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Check,
  Minus,
  Plus,
  Box,
  Truck,
  RotateCcw,
  Sliders,
  Award,
} from 'lucide-react';

const Scene = dynamic(
  () => import('@/components/three/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#070709] min-h-[420px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
            Rendering Holographic Mesh
          </span>
        </div>
      </div>
    ),
  }
);

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is3DMode, setIs3DMode] = useState(product.isFlagship3D ?? false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const { addItem, isLoading } = useCart();

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.availableForSale) return;
    await addItem(selectedVariant.id, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2400);
  };

  const currentPreset: MaterialPresetId = selectedVariant.materialPreset || 'titanium';
  const currentSpec = MATERIAL_SPECS[currentPreset] || MATERIAL_SPECS.titanium;

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: 3D Viewport or Studio Photography Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative w-full aspect-square rounded-3xl bg-surface-card/60 border border-white/[0.08] overflow-hidden backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] flex items-center justify-center">
            {is3DMode && product.isFlagship3D ? (
              <div className="absolute inset-0">
                <Scene
                  materialPreset={currentPreset}
                  scrollProgress={0.16}
                  variants={product.variants}
                  selectedVariantId={selectedVariant.id}
                  onSelectVariant={setSelectedVariant}
                />
              </div>
            ) : (
              <div className="relative w-full h-full p-8 md:p-12">
                <Image
                  src={product.images[activeImageIndex]?.url || product.featuredImage.url}
                  alt={product.title}
                  fill
                  priority
                  className="object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)] transition-all duration-500"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            )}

            {/* Mode Switcher Button */}
            {product.isFlagship3D && (
              <button
                type="button"
                onClick={() => setIs3DMode(!is3DMode)}
                className="absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-xs font-mono text-white hover:border-accent-gold transition-all flex items-center gap-2 shadow-lg hover:scale-105"
              >
                <Box className="w-3.5 h-3.5 text-accent-gold" />
                <span>{is3DMode ? 'Studio Gallery' : 'Interactive 3D Engine'}</span>
              </button>
            )}

            {/* Micro Architecture Tag */}
            <div className="absolute bottom-5 left-5 z-20 px-3.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono text-text-secondary">
              Architecture: <span className="text-white uppercase font-medium">{currentSpec.name}</span>
            </div>
          </div>

          {/* Thumbnails row */}
          {!is3DMode && product.images.length > 1 && (
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border transition-all ${
                    activeImageIndex === idx
                      ? 'border-accent-gold ring-2 ring-accent-gold/40 scale-105'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications, Architectural Finish, & Acquisition Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-accent-gold uppercase tracking-[0.2em]">
                <Sparkles className="w-3 h-3" /> {product.productType}
              </span>
              <span className="text-[10px] font-mono text-text-muted uppercase">
                Ref: {selectedVariant.sku || 'AETH-FLAGSHIP'}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight leading-tight">
              {product.title}
            </h1>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed pt-2 font-light">
              {product.description}
            </p>
          </div>

          {/* Pricing & Stock Status */}
          <div className="flex items-baseline justify-between py-4 border-y border-white/[0.08]">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-mono text-white font-medium">
                ${selectedVariant.price.amount}
              </span>
              {selectedVariant.compareAtPrice && (
                <span className="text-sm font-mono text-text-muted line-through">
                  ${selectedVariant.compareAtPrice.amount}
                </span>
              )}
            </div>

            <span className="text-[10px] uppercase font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {selectedVariant.availableForSale ? 'Allocations Available' : 'Waitlist Only'}
            </span>
          </div>

          {/* Variants / Finishes */}
          {product.options.map((opt) => (
            <div key={opt.id} className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-text-secondary">
                <span>{opt.name}</span>
                {opt.name.toLowerCase().includes('finish') && (
                  <span className="text-accent-gold text-[10px] uppercase">{currentPreset}</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {opt.values.map((val) => {
                  const matchingVariant = product.variants.find((v) =>
                    v.selectedOptions.some(
                      (o) => o.name === opt.name && o.value === val
                    )
                  );
                  const isSelected = selectedVariant.selectedOptions.some(
                    (o) => o.name === opt.name && o.value === val
                  );

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => matchingVariant && handleVariantChange(matchingVariant)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-mono transition-all duration-300 ${
                        isSelected
                          ? 'bg-white text-black font-medium shadow-lg scale-105'
                          : 'bg-white/[0.03] text-text-secondary hover:text-white border border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity and Acquisition Button */}
          <div className="space-y-4 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-surface-card p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-text-secondary hover:text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-mono text-white font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-text-secondary hover:text-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isLoading || !selectedVariant.availableForSale}
                className="flex-1 py-4 px-6 rounded-xl font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 bg-white text-black hover:bg-neutral-200 active:scale-[0.98] shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] disabled:opacity-50"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Allocated to Cart</span>
                  </>
                ) : (
                  <>
                    <span>Acquire Instrument</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Atelier Guarantees Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <Truck className="w-4 h-4 text-accent-gold mx-auto" />
                <p className="text-[10px] font-mono uppercase text-text-secondary">Insured Delivery</p>
                <p className="text-[9px] text-text-muted">Global Priority</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto" />
                <p className="text-[10px] font-mono uppercase text-text-secondary">5-Year Warranty</p>
                <p className="text-[9px] text-text-muted">Atelier Coverage</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <RotateCcw className="w-4 h-4 text-accent-cyan mx-auto" />
                <p className="text-[10px] font-mono uppercase text-text-secondary">30-Day Audition</p>
                <p className="text-[9px] text-text-muted">Acoustic Evaluation</p>
              </div>
            </div>

            {/* Provenance note */}
            <div className="p-4 rounded-2xl bg-surface-card/40 border border-white/[0.06] flex items-center gap-3 text-xs text-text-secondary">
              <Award className="w-4 h-4 text-accent-gold flex-shrink-0" />
              <span>Includes individual certificate of acoustic calibration signed by the master acoustic engineer in Zurich.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Telemetry Table */}
      {product.specifications && (
        <div className="pt-12 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 mb-6">
            <Sliders className="w-4 h-4 text-accent-gold" />
            <h2 className="text-2xl font-display font-light text-white">
              Technical Specifications & Tolerances
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-2xl bg-surface-card/40 border border-white/[0.06]"
              >
                <span className="text-xs font-mono text-text-secondary uppercase">{key}</span>
                <span className="text-xs font-mono text-white text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

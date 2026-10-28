'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { usePerformanceTier } from '@/lib/performance/usePerformanceTier';
import { ShoppingBag, Search, Menu, X, Cpu } from 'lucide-react';

export function Navbar() {
  const { cart, openCart } = useCart();
  const { tier, setTier, fps } = usePerformanceTier();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTierSelector, setShowTierSelector] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-[#070709]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between">
          {/* Brand Identity */}
          <Link
            href="/"
            className="group flex items-center gap-3 text-white transition-opacity hover:opacity-90"
          >
            <span className="w-2 h-2 rounded-full bg-accent-gold shadow-[0_0_8px_#e2b857] group-hover:scale-125 transition-transform" />
            <span className="font-display font-medium text-lg md:text-xl tracking-[0.28em] uppercase text-white">
              Aether
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-text-secondary">
            <Link
              href="/collections/flagship-audio"
              className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-accent-gold hover:after:w-full after:transition-all"
            >
              Acoustics
            </Link>
            <Link
              href="/collections/horology-instruments"
              className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-accent-gold hover:after:w-full after:transition-all"
            >
              Horology
            </Link>
            <Link
              href="/collections/hardware-vaults"
              className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-accent-gold hover:after:w-full after:transition-all"
            >
              Enclosures
            </Link>
            <Link
              href="/products/aether-x-planar-headphones"
              className="text-accent-gold hover:text-white transition-colors"
            >
              Flagship 3D
            </Link>
          </nav>

          {/* Right Controls: Search, Performance Manager, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Realtime Performance Manager Tier Pill */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setShowTierSelector(!showTierSelector)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-[10px] font-mono text-text-secondary transition-all"
                title={`Rendering Engine: ${tier.toUpperCase()} (${fps} FPS)`}
              >
                <Cpu className="w-3 h-3 text-accent-gold" />
                <span className="uppercase">{tier}</span>
                <span className="text-text-muted">({fps}fps)</span>
              </button>

              {showTierSelector && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-card border border-white/10 p-2 shadow-2xl backdrop-blur-xl z-50">
                  <p className="text-[10px] font-mono text-text-muted px-2 py-1 uppercase tracking-wider">
                    Rendering Profile
                  </p>
                  {(['ultra', 'balanced', 'low', 'fallback'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTier(t);
                        setShowTierSelector(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors flex items-center justify-between ${
                        tier === t
                          ? 'bg-accent-gold/15 text-accent-gold'
                          : 'text-text-secondary hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>{t}</span>
                      {tier === t && <span className="w-1.5 h-1.5 rounded-full bg-accent-gold" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search link */}
            <Link
              href="/search"
              aria-label="Search catalog"
              className="p-2 rounded-full text-text-secondary hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open Cart with ${cart.totalQuantity} items`}
              className="relative p-2 rounded-full text-white hover:bg-white/[0.08] transition-all group"
            >
              <ShoppingBag className="w-4 h-4 text-text-secondary group-hover:text-white transition-colors" />
              {cart.totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-gold text-black font-mono text-[10px] font-bold flex items-center justify-center shadow-lg animate-pulse">
                  {cart.totalQuantity}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/[0.05]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#070709]/95 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden">
          <nav className="flex flex-col gap-6 text-xl font-display tracking-widest uppercase text-text-secondary">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/collections/flagship-audio"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Acoustic Systems
            </Link>
            <Link
              href="/collections/horology-instruments"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Horology
            </Link>
            <Link
              href="/collections/hardware-vaults"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Hardware Vaults
            </Link>
            <Link
              href="/products/aether-x-planar-headphones"
              onClick={() => setMobileMenuOpen(false)}
              className="text-accent-gold hover:text-white transition-colors"
            >
              Aether-X Flagship 3D
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

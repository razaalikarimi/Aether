'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-[#050507] border-t border-white/[0.08] text-text-secondary pt-20 pb-12 overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/[0.06]">
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-display font-medium text-2xl tracking-[0.25em] uppercase text-white">
                Aether
              </span>
            </Link>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-sm">
              An independent design atelier dedicated to uncompromising physical fidelity.
              Synthesizing aerospace metallurgy, planar magnetic transducers, and bespoke
              micro-mechanics.
            </p>
            <div className="pt-2 text-[11px] font-mono text-accent-gold uppercase tracking-wider">
              Zurich — Tokyo — San Francisco
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white">
              Collections
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/collections/flagship-audio"
                  className="hover:text-white transition-colors"
                >
                  Planar Acoustics
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/horology-instruments"
                  className="hover:text-white transition-colors"
                >
                  Tourbillon Calibres
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/hardware-vaults"
                  className="hover:text-white transition-colors"
                >
                  Hardware Vaults
                </Link>
              </li>
              <li>
                <Link
                  href="/products/aether-x-planar-headphones"
                  className="hover:text-white transition-colors text-accent-gold"
                >
                  Aether-X Flagship
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white">
              Architecture
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-text-muted">Grade 5 Titanium</span>
              </li>
              <li>
                <span className="text-text-muted">Neodymium N52 Arrays</span>
              </li>
              <li>
                <span className="text-text-muted">DLC Obsidian Finishing</span>
              </li>
              <li>
                <span className="text-text-muted">Nanometer Diaphragm</span>
              </li>
            </ul>
          </div>

          {/* Private Atelier Dispatch (Newsletter) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white">
              Private Dispatch
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Receive confidential notices on bespoke editions and horological allocations.
            </p>

            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-text-muted focus:outline-none focus:border-accent-gold transition-colors pr-10 font-mono"
              />
              <button
                type="submit"
                aria-label="Subscribe to dispatch"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                {subscribed ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] font-mono text-emerald-400 pt-1">
                Allocation credentials dispatched.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Credits & Verification */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-text-muted gap-4">
          <div>
            &copy; {new Date().getFullYear()} AETHER HOROLOGY & SOUND ATELIER. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>Shopify Storefront Verified</span>
            <span>WebGL 2.0 Real-Time Physics</span>
            <span>Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React, { useState } from 'react';
import { Shield, Cpu, Activity, Zap, Radio, Layers } from 'lucide-react';

export function TechSpecsSection() {
  const [activeTab, setActiveTab] = useState<'transducer' | 'metallurgy'>('transducer');

  const specs = [
    {
      label: 'Transducer Architecture',
      value: '50mm Planar-Magnetic Nanometer Substrate Diaphragm',
      icon: Activity,
    },
    {
      label: 'Magnetic Stator Array',
      value: 'Dual Symmetrical Neodymium N52 Flux Rails (1.8 Tesla peak)',
      icon: Zap,
    },
    {
      label: 'Frequency Dispersion',
      value: '4 Hz – 52,000 Hz (Sub-audible to Ultrasonic)',
      icon: Cpu,
    },
    {
      label: 'Harmonic Distortion',
      value: '< 0.02% THD @ 1kHz, 100dB Sound Pressure Level',
      icon: Activity,
    },
    {
      label: 'Metallurgy & Machining',
      value: 'Monolithic Grade 5 Ti-6Al-4V Titanium, 5-Axis CNC Milled',
      icon: Shield,
    },
    {
      label: 'Chassis Mass',
      value: '385 grams with Lambskin Ergonomic Pressure Distribution',
      icon: Shield,
    },
  ];

  // Frequency spectrum benchmark data
  const frequencyBands = [
    { freq: '4 Hz', level: 98, note: 'Infrasonic Sub-Bass' },
    { freq: '20 Hz', level: 100, note: 'Deep Bass Foundation' },
    { freq: '250 Hz', level: 99, note: 'Warm Mid-Bass' },
    { freq: '1 kHz', level: 100, note: 'Reference Midrange' },
    { freq: '4 kHz', level: 98, note: 'Vocal Presence' },
    { freq: '12 kHz', level: 99, note: 'Air & Treble Luster' },
    { freq: '24 kHz', level: 97, note: 'Harmonic Extension' },
    { freq: '52 kHz', level: 94, note: 'Ultrasonic Micro-detail' },
  ];

  return (
    <section className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Editorial Header & Interactive Toggle */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-accent-gold uppercase tracking-[0.25em]">
            <Radio className="w-3 h-3" /> Acoustic Laboratory
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight leading-tight">
            Acoustic Physics <br />
            <span className="italic font-serif text-white/50">Without Compromise</span>
          </h2>

          <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
            Conventional dynamic drivers suffer from cone breakup, modal ringing, and transient
            hysteresis. The Aether-X planar diaphragm moves as a singular, unified wavefront,
            rendering recorded spatial cues with absolute holographic depth.
          </p>

          {/* Toggle Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-card border border-white/[0.08] w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('transducer')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all ${
                activeTab === 'transducer'
                  ? 'bg-white text-black font-medium shadow-md'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Telemetry Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('metallurgy')}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all ${
                activeTab === 'metallurgy'
                  ? 'bg-white text-black font-medium shadow-md'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Frequency Spectrum
            </button>
          </div>
        </div>

        {/* Right Interactive Lab Content */}
        <div className="lg:col-span-7">
          {activeTab === 'transducer' ? (
            <div className="rounded-3xl bg-surface-card/60 border border-white/[0.08] p-6 md:p-8 space-y-4 backdrop-blur-xl shadow-2xl">
              {specs.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5 ${
                      idx < specs.length - 1 ? 'border-b border-white/[0.05]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-accent-gold">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-mono uppercase tracking-wider text-text-secondary">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-mono text-white text-right">
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl bg-surface-card/60 border border-white/[0.08] p-6 md:p-8 space-y-6 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h4 className="text-sm font-display text-white font-normal">
                    Flat Acoustic Wavefront Curve
                  </h4>
                  <p className="text-[10px] font-mono text-text-muted mt-0.5">
                    ±0.5 dB deviation across audible bandwidth (20Hz - 20kHz)
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  Spectral Purity 99.8%
                </span>
              </div>

              {/* Dynamic Frequency Response Graph Bars */}
              <div className="space-y-3">
                {frequencyBands.map((band) => (
                  <div key={band.freq} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-text-secondary">
                      <span className="text-white font-medium">{band.freq}</span>
                      <span className="text-text-muted">{band.note}</span>
                      <span className="text-accent-gold">{band.level}% Output</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-cyan via-accent-gold to-white rounded-full transition-all duration-700"
                        style={{ width: `${band.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

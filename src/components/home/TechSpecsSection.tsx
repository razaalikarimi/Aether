'use client';

import React from 'react';
import { Shield, Cpu, Activity, Zap } from 'lucide-react';

export function TechSpecsSection() {
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

  return (
    <section className="relative py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/[0.08]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Editorial Text */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent-gold">
            Engineering Telemetry
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight leading-tight">
            Acoustic Physics <br />
            <span className="italic font-serif text-white/60">Without Compromise</span>
          </h2>
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
            Conventional dynamic drivers suffer from cone breakup, modal ringing, and transient
            hysteresis. The Aether-X planar diaphragm moves as a singular, unified wavefront,
            rendering recorded spatial cues with absolute fidelity.
          </p>
        </div>

        {/* Right Telemetry Table */}
        <div className="lg:col-span-7 rounded-3xl bg-surface-card/40 border border-white/[0.08] p-6 md:p-8 space-y-4 backdrop-blur-md">
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
      </div>
    </section>
  );
}

'use client';

import React, { Suspense, Component, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { HeroProductModel } from './HeroProductModel';
import { FloatingProductController } from './FloatingProductController';
import { FloatingParticles } from './FloatingParticles';
import { FluidAuraBackground } from './FluidAuraBackground';
import { CinematicProductFallback } from './CinematicProductFallback';
import { usePerformanceTier } from '@/lib/performance/usePerformanceTier';
import { webGLPerformanceManager } from '@/lib/performance/performanceManager';
import { MaterialPresetId } from '@/types/three';
import { ProductVariant } from '@/types/commerce';

interface SceneProps {
  materialPreset?: MaterialPresetId;
  scrollProgress?: number;
  explodedProgress?: number;
  variants?: ProductVariant[];
  selectedVariantId?: string;
  onSelectVariant?: (variant: ProductVariant) => void;
}

// Inner frame meter hooked into real render cycle
function PerformanceRegister() {
  useFrame(() => {
    webGLPerformanceManager.registerFrame(performance.now());
  });
  return null;
}

// Robust WebGL Error Boundary to catch shader compilation or context failures
interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message || 'WebGL Render failure' };
  }

  componentDidCatch(error: Error) {
    webGLPerformanceManager.activateFallback(error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function Scene({
  materialPreset = 'titanium',
  scrollProgress = 0,
  explodedProgress = 0,
  variants = [],
  selectedVariantId,
  onSelectVariant,
}: SceneProps) {
  const { isFallback, dprCap, tier } = usePerformanceTier();

  if (isFallback) {
    return (
      <CinematicProductFallback
        variants={variants}
        selectedVariantId={selectedVariantId}
        onSelectVariant={onSelectVariant}
        reason="Adaptive Performance Management"
      />
    );
  }

  const fallbackNode = (
    <CinematicProductFallback
      variants={variants}
      selectedVariantId={selectedVariantId}
      onSelectVariant={onSelectVariant}
      reason="Hardware WebGL Error"
    />
  );

  return (
    <WebGLErrorBoundary fallback={fallbackNode}>
      <div className="relative w-full h-full min-h-[500px]">
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          dpr={[1, dprCap]}
          gl={{
            antialias: tier !== 'low',
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              webGLPerformanceManager.activateFallback('Context lost');
            });
          }}
        >
          <PerformanceRegister />

          {/* Dynamic Environment Lighting */}
          <ambientLight intensity={0.4} color="#0c0e14" />
          {/* Key Specular Highlight */}
          <directionalLight position={[4, 5, 4]} intensity={1.8} color="#ffffff" />
          {/* Rim Light for Metallic Edges */}
          <directionalLight position={[-4, 2, -3]} intensity={1.2} color="#d4af37" />
          {/* Soft fill */}
          <pointLight position={[0, -2, 3]} intensity={0.6} color="#00f2fe" />

          <Suspense fallback={null}>
            {/* Atmospheric Fluid Aura Background */}
            <FluidAuraBackground
              colorPreset={materialPreset}
              intensity={tier === 'low' ? 0.5 : 1.0}
            />

            {/* Floating Particles System */}
            <FloatingParticles />

            {/* Antigravity Floating Product with Exploded Assembly */}
            <FloatingProductController scrollProgress={scrollProgress}>
              <HeroProductModel
                materialPreset={materialPreset}
                explodedProgress={explodedProgress}
              />
            </FloatingProductController>

            {/* High-quality subtle environment reflection */}
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}

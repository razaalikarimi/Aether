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

function PerformanceRegister() {
  useFrame(() => {
    webGLPerformanceManager.registerFrame(performance.now());
  });
  return null;
}

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
          camera={{ position: [0, 0, 5.2], fov: 40 }}
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

          {/* 3-Point Studio Luxury Lighting Setup */}
          <ambientLight intensity={0.45} color="#0a0b10" />

          {/* Key Directional Light (Soft warm white highlight) */}
          <directionalLight position={[4.5, 5.5, 4.2]} intensity={2.2} color="#ffffff" />

          {/* Rim Specular Light 1 (Warm Champagne / Tungsten edge) */}
          <directionalLight position={[-4.5, 3.2, -3.0]} intensity={1.5} color="#ffd88a" />

          {/* Rim Specular Light 2 (Cool Platinum / Cyan edge) */}
          <directionalLight position={[3.2, -2.5, -2.5]} intensity={0.9} color="#a6e3e9" />

          {/* Subtle Front Fill Light for titanium chamfer reflections */}
          <pointLight position={[0, 0, 4.0]} intensity={0.4} color="#f4f5f8" />

          <Suspense fallback={null}>
            {/* Fluid Aura Background Plane */}
            <FluidAuraBackground
              colorPreset={materialPreset}
              intensity={tier === 'low' ? 0.45 : 1.0}
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

            {/* Ground Contact Shadow Gradient Disc */}
            <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0, 2.8, 32]} />
              <meshBasicMaterial
                color="#000000"
                transparent
                opacity={0.35}
                depthWrite={false}
              />
            </mesh>

            {/* High-quality studio environment reflection */}
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { PerformanceMetrics, PerformanceTier } from '@/types/three';
import { webGLPerformanceManager } from './performanceManager';

export function usePerformanceTier() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    avgFrameDurationMs: 16.6,
    tier: 'ultra',
    droppedFrames: 0,
    isFallback: false,
  });

  useEffect(() => {
    const unsubscribe = webGLPerformanceManager.subscribe((newMetrics) => {
      setMetrics(newMetrics);
    });
    return unsubscribe;
  }, []);

  const manualSetTier = (tier: PerformanceTier) => {
    webGLPerformanceManager.setTier(tier);
  };

  return {
    ...metrics,
    setTier: manualSetTier,
    particleBudget: webGLPerformanceManager.getParticleCount(),
    dprCap: webGLPerformanceManager.getDprCap(),
  };
}

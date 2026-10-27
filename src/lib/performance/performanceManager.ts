/**
 * WebGLPerformanceManager
 * Real-time hardware performance monitoring measuring actual frame delta times,
 * sustained frame drops, and executing hysteresis-stabilized quality tier downgrades/upgrades.
 * 
 * Quality Tiers:
 * - ULTRA: Full particle count (1200+), high-res shader passes, real-time reflection probes, max dpr 2.0
 * - BALANCED: 400 particles, simplified lighting passes, max dpr 1.5
 * - LOW: 100 particles, lightweight lighting, max dpr 1.0, lower-cost shaders
 * - FALLBACK: WebGL disabled/lost, seamless 2D parallax & high-fidelity CSS render
 */

import { PerformanceTier, PerformanceMetrics } from '@/types/three';

export type PerformanceListener = (metrics: PerformanceMetrics) => void;

class PerformanceManager {
  private currentTier: PerformanceTier = 'ultra';
  private frameTimes: number[] = [];
  private lastTimestamp: number = 0;
  private droppedFrameCount: number = 0;
  private sustainedLowFpsCount: number = 0;
  private sustainedHighFpsCount: number = 0;
  private listeners: Set<PerformanceListener> = new Set();
  private isFallbackMode: boolean = false;
  private isPaused: boolean = false;

  // Configuration thresholds
  private readonly SAMPLE_SIZE = 60; // 60 frames sample window
  private readonly TARGET_FPS = 60;
  private readonly LOW_FPS_THRESHOLD = 45; // Below this is considered degraded
  private readonly CRITICAL_FPS_THRESHOLD = 25; // Critical lag
  private readonly RECOVERY_FPS_THRESHOLD = 55; // For upgrading tier
  private readonly DOWNGRADE_SUSTAINED_FRAMES = 120; // 2 seconds of sustained bad FPS before downgrade
  private readonly UPGRADE_SUSTAINED_FRAMES = 300; // 5 seconds of sustained smooth 60fps before upgrade

  constructor() {
    if (typeof window !== 'undefined') {
      // Check for user reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        this.currentTier = 'low';
      }

      // Check for WebGL capability
      if (!this.checkWebGLSupport()) {
        this.activateFallback('WebGL context unavailable on host device');
      }

      // Pause monitoring on document hidden to avoid false degradation readings
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.isPaused = true;
          this.frameTimes = [];
        } else {
          this.isPaused = false;
          this.lastTimestamp = performance.now();
        }
      });
    }
  }

  public checkWebGLSupport(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      if (typeof canvas.getContext !== 'function') return false;
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      return Boolean(gl);
    } catch {
      return false;
    }
  }

  public registerFrame(timestamp: number) {
    if (this.isFallbackMode || this.isPaused) return;

    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      return;
    }

    const deltaMs = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Reject outliers from background tab wakeups
    if (deltaMs > 250) {
      return;
    }

    this.frameTimes.push(deltaMs);
    if (this.frameTimes.length > this.SAMPLE_SIZE) {
      this.frameTimes.shift();
    }

    // Evaluate metrics every 30 frames
    if (this.frameTimes.length >= 30) {
      const avgDuration =
        this.frameTimes.reduce((acc, curr) => acc + curr, 0) / this.frameTimes.length;
      const currentFps = Math.min(1000 / avgDuration, 60);

      if (currentFps < this.LOW_FPS_THRESHOLD) {
        this.sustainedLowFpsCount++;
        this.sustainedHighFpsCount = 0;
        this.droppedFrameCount++;

        if (this.sustainedLowFpsCount > this.DOWNGRADE_SUSTAINED_FRAMES) {
          this.downgradeTier(currentFps);
          this.sustainedLowFpsCount = 0;
        }
      } else if (currentFps >= this.RECOVERY_FPS_THRESHOLD) {
        this.sustainedHighFpsCount++;
        this.sustainedLowFpsCount = 0;

        if (this.sustainedHighFpsCount > this.UPGRADE_SUSTAINED_FRAMES) {
          this.upgradeTier();
          this.sustainedHighFpsCount = 0;
        }
      }

      this.notifyListeners({
        fps: Math.round(currentFps),
        avgFrameDurationMs: Math.round(avgDuration * 10) / 10,
        tier: this.currentTier,
        droppedFrames: this.droppedFrameCount,
        isFallback: this.isFallbackMode,
      });
    }
  }

  private downgradeTier(currentFps: number) {
    if (this.currentTier === 'ultra') {
      console.warn(`[PerformanceManager] Sustained FPS ${Math.round(currentFps)} < 45. Downgrading to BALANCED tier.`);
      this.currentTier = 'balanced';
    } else if (this.currentTier === 'balanced') {
      console.warn(`[PerformanceManager] Sustained FPS ${Math.round(currentFps)} < 45. Downgrading to LOW tier.`);
      this.currentTier = 'low';
    } else if (this.currentTier === 'low' && currentFps < this.CRITICAL_FPS_THRESHOLD) {
      console.warn(`[PerformanceManager] Sustained critical FPS ${Math.round(currentFps)} < 25. Activating 2D FALLBACK.`);
      this.activateFallback('Sustained critical frame rate');
    }
  }

  private upgradeTier() {
    if (this.currentTier === 'low') {
      console.info('[PerformanceManager] Stable 60 FPS detected. Upgrading to BALANCED tier.');
      this.currentTier = 'balanced';
    } else if (this.currentTier === 'balanced') {
      console.info('[PerformanceManager] Sustained peak FPS detected. Upgrading to ULTRA tier.');
      this.currentTier = 'ultra';
    }
  }

  public activateFallback(reason: string) {
    console.warn(`[PerformanceManager] WebGL 2D Fallback triggered: ${reason}`);
    this.isFallbackMode = true;
    this.currentTier = 'fallback';
    this.notifyListeners({
      fps: 60,
      avgFrameDurationMs: 16.6,
      tier: 'fallback',
      droppedFrames: this.droppedFrameCount,
      isFallback: true,
    });
  }

  public getTier(): PerformanceTier {
    return this.currentTier;
  }

  public setTier(tier: PerformanceTier) {
    this.currentTier = tier;
    if (tier === 'fallback') {
      this.isFallbackMode = true;
    } else {
      this.isFallbackMode = false;
    }
    this.notifyListeners({
      fps: 60,
      avgFrameDurationMs: 16.6,
      tier: this.currentTier,
      droppedFrames: this.droppedFrameCount,
      isFallback: this.isFallbackMode,
    });
  }

  public subscribe(listener: PerformanceListener): () => void {
    this.listeners.add(listener);
    // Initial emit
    listener({
      fps: 60,
      avgFrameDurationMs: 16.6,
      tier: this.currentTier,
      droppedFrames: this.droppedFrameCount,
      isFallback: this.isFallbackMode,
    });
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(metrics: PerformanceMetrics) {
    this.listeners.forEach((listener) => listener(metrics));
  }

  // Get particle budget for current tier
  public getParticleCount(): number {
    switch (this.currentTier) {
      case 'ultra':
        return 900;
      case 'balanced':
        return 400;
      case 'low':
        return 120;
      case 'fallback':
        return 0;
    }
  }

  // Max DPR cap for current tier
  public getDprCap(): number {
    switch (this.currentTier) {
      case 'ultra':
        return 2.0;
      case 'balanced':
        return 1.5;
      case 'low':
        return 1.0;
      case 'fallback':
        return 1.0;
    }
  }
}

export const webGLPerformanceManager = new PerformanceManager();

import { describe, it, expect, beforeEach } from 'vitest';
import { webGLPerformanceManager } from '@/lib/performance/performanceManager';

describe('WebGLPerformanceManager', () => {
  beforeEach(() => {
    webGLPerformanceManager.setTier('ultra');
  });

  it('initializes with default ultra tier on capable hardware', () => {
    expect(webGLPerformanceManager.getTier()).toBe('ultra');
  });

  it('returns proper particle budgets matching tier configurations', () => {
    webGLPerformanceManager.setTier('ultra');
    expect(webGLPerformanceManager.getParticleCount()).toBe(900);

    webGLPerformanceManager.setTier('balanced');
    expect(webGLPerformanceManager.getParticleCount()).toBe(400);

    webGLPerformanceManager.setTier('low');
    expect(webGLPerformanceManager.getParticleCount()).toBe(120);

    webGLPerformanceManager.setTier('fallback');
    expect(webGLPerformanceManager.getParticleCount()).toBe(0);
  });

  it('returns device pixel ratio caps adapted to tiers', () => {
    webGLPerformanceManager.setTier('ultra');
    expect(webGLPerformanceManager.getDprCap()).toBe(2.0);

    webGLPerformanceManager.setTier('balanced');
    expect(webGLPerformanceManager.getDprCap()).toBe(1.5);

    webGLPerformanceManager.setTier('low');
    expect(webGLPerformanceManager.getDprCap()).toBe(1.0);
  });

  it('activates 2D fallback cleanly when triggered', () => {
    webGLPerformanceManager.activateFallback('Manual test trigger');
    expect(webGLPerformanceManager.getTier()).toBe('fallback');
  });

  it('notifies subscribers upon tier changes', () => {
    let notifiedTier = '';
    const unsubscribe = webGLPerformanceManager.subscribe((metrics) => {
      notifiedTier = metrics.tier;
    });

    webGLPerformanceManager.setTier('balanced');
    expect(notifiedTier).toBe('balanced');

    unsubscribe();
  });
});

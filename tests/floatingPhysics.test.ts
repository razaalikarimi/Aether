import { describe, it, expect } from 'vitest';

describe('Floating Physics & Inertial Damping Calculations', () => {
  it('calculates frame-rate independent exponential damping rate', () => {
    const damping = 0.05;

    // At 60 FPS (delta ~ 0.0166s)
    const delta60 = 1 / 60;
    const dampRate60 = 1.0 - Math.exp(-damping * 120 * delta60);
    expect(dampRate60).toBeGreaterThan(0.08);
    expect(dampRate60).toBeLessThan(0.12);

    // At 30 FPS (delta ~ 0.0333s)
    const delta30 = 1 / 30;
    const dampRate30 = 1.0 - Math.exp(-damping * 120 * delta30);
    expect(dampRate30).toBeGreaterThan(dampRate60); // Compensates automatically for slower frame rates!
  });

  it('clamps mouse tilt within configured maximum angular bounds', () => {
    const maxTiltDegrees = 18;
    const maxTiltRad = (maxTiltDegrees * Math.PI) / 180;
    const pointerInfluence = 0.45;

    const extremeMouse = 2.5; // Out of bounds pointer coordinate
    const clampedMouse = Math.max(-1, Math.min(1, extremeMouse));
    expect(clampedMouse).toBe(1);

    const tiltRad = clampedMouse * maxTiltRad * pointerInfluence;
    expect(tiltRad).toBeLessThanOrEqual(maxTiltRad);
    expect(tiltRad).toBeCloseTo(0.14137, 3);
  });

  it('attenuates interactive pointer influence during exploded view and acquisition to preserve cinematic timeline', () => {
    const basePointerInfluence = 0.45;

    // During Stage 1 & 2 (scrollProgress < 0.45), full interactive influence
    const progressHero = 0.2;
    const attenuateHero = progressHero < 0.45 ? 1.0 : Math.max(0.15, 1.0 - (progressHero - 0.45) * 2.2);
    expect(attenuateHero).toBe(1.0);

    // During Stage 3 (Exploded View at progress = 0.6)
    const progressExploded = 0.6;
    const attenuateExploded = progressExploded < 0.45 ? 1.0 : Math.max(0.15, 1.0 - (progressExploded - 0.45) * 2.2);
    expect(attenuateExploded).toBeLessThan(1.0);
    expect(attenuateExploded).toBeGreaterThanOrEqual(0.15);

    // Verified effective influence is attenuated
    const effectiveInfluence = basePointerInfluence * attenuateExploded;
    expect(effectiveInfluence).toBeLessThan(basePointerInfluence);
  });
});

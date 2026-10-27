/**
 * Strict TypeScript definitions for Three.js, React Three Fiber scene,
 * Floating physics, and Performance Tiers.
 */

export type PerformanceTier = 'ultra' | 'balanced' | 'low' | 'fallback';

export interface PerformanceMetrics {
  fps: number;
  avgFrameDurationMs: number;
  tier: PerformanceTier;
  droppedFrames: number;
  isFallback: boolean;
}

export type MaterialPresetId = 'titanium' | 'onyx' | 'silver' | 'gold';

export interface MaterialProperties {
  id: MaterialPresetId;
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  reflectivity: number;
  accentColor: string;
}

export interface FloatingConfig {
  floatStrength: number;
  damping: number;
  angularResponse: number;
  pointerInfluence: number;
  particleDensity: number;
  gravityRadius: number;
  scrollOverrideStrength: number;
  maxTiltDegrees: number;
}

export interface CameraStateConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  explodedOffset: number;
  description: string;
  subtitle: string;
}

export type SceneCinematicStage =
  | 'hero'
  | 'orbit'
  | 'macro'
  | 'exploded'
  | 'materials'
  | 'reassembly'
  | 'checkout';

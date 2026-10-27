'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { FloatingConfig } from '@/types/three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface FloatingProductControllerProps {
  children: React.ReactNode;
  config?: Partial<FloatingConfig>;
  scrollProgress?: number; // 0 to 1
  stage?: string;
}

const DEFAULT_CONFIG: FloatingConfig = {
  floatStrength: 0.12,
  damping: 0.05,
  angularResponse: 0.55,
  pointerInfluence: 0.45,
  particleDensity: 1.0,
  gravityRadius: 3.0,
  scrollOverrideStrength: 1.0,
  maxTiltDegrees: 18,
};

export function FloatingProductController({
  children,
  config = {},
  scrollProgress = 0,
}: FloatingProductControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const prefersReducedMotion = useReducedMotion();

  // Inertial state tracking without React re-renders
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentRot = useRef(new THREE.Euler(0, 0, 0));
  const targetRot = useRef(new THREE.Euler(0, 0, 0));
  const floatTime = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Delta clamp to prevent teleportation on lag spikes
    const clampedDelta = Math.min(delta, 0.1);
    floatTime.current += clampedDelta;

    if (prefersReducedMotion) {
      // Gentle static orientation with slight scroll progression
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, scrollProgress * Math.PI * 0.5, 0);
      return;
    }

    // 1. Natural Controlled Vertical Floating (Sine waves with orbital perturbation)
    const floatY =
      Math.sin(floatTime.current * 1.2) * cfg.floatStrength +
      Math.sin(floatTime.current * 0.6) * (cfg.floatStrength * 0.4);
    const floatX = Math.cos(floatTime.current * 0.8) * (cfg.floatStrength * 0.35);

    // 2. Mouse Raycast Tracking & Clamped Tilt
    const maxTiltRad = THREE.MathUtils.degToRad(cfg.maxTiltDegrees);
    const mouseX = THREE.MathUtils.clamp(state.pointer.x, -1, 1);
    const mouseY = THREE.MathUtils.clamp(state.pointer.y, -1, 1);

    // Interactive target rotation damped by pointer
    const interactiveRotX = -mouseY * maxTiltRad * cfg.pointerInfluence;
    const interactiveRotY = mouseX * maxTiltRad * cfg.pointerInfluence;

    // 3. Scroll Choreography Interpolation
    // Transition through stages deterministically
    let choreoX = 0;
    let choreoY = 0;
    let choreoZ = 0;
    let choreoRotX = 0;
    let choreoRotY = scrollProgress * Math.PI * 2.2; // Controlled orbital revolution
    let choreoRotZ = 0;

    // Stage 1 (0 - 0.2): Centered Hero Reveal
    // Stage 2 (0.2 - 0.4): Orbital shift
    if (scrollProgress > 0.2 && scrollProgress <= 0.4) {
      const p = (scrollProgress - 0.2) / 0.2;
      choreoX = THREE.MathUtils.lerp(0, 1.2, p);
      choreoRotX = THREE.MathUtils.lerp(0, 0.35, p);
    }
    // Stage 3 (0.4 - 0.6): Macro Detail Focus (close up zoom)
    else if (scrollProgress > 0.4 && scrollProgress <= 0.6) {
      const p = (scrollProgress - 0.4) / 0.2;
      choreoX = THREE.MathUtils.lerp(1.2, -0.8, p);
      choreoZ = THREE.MathUtils.lerp(0, 1.8, p); // Close-up camera proximity
      choreoRotY = THREE.MathUtils.lerp(Math.PI * 0.8, Math.PI * 1.4, p);
    }
    // Stage 4 (0.6 - 0.8): Exploded view separation showcase
    else if (scrollProgress > 0.6 && scrollProgress <= 0.8) {
      const p = (scrollProgress - 0.6) / 0.2;
      choreoX = THREE.MathUtils.lerp(-0.8, 0, p);
      choreoZ = THREE.MathUtils.lerp(1.8, -0.4, p);
      choreoRotX = THREE.MathUtils.lerp(0.35, 0.1, p);
      choreoRotY = Math.PI * 1.6;
    }
    // Stage 5 (0.8 - 1.0): Resolution into Stable Purchase Action
    else if (scrollProgress > 0.8) {
      const p = (scrollProgress - 0.8) / 0.2;
      choreoX = THREE.MathUtils.lerp(0, -1.1, p);
      choreoY = THREE.MathUtils.lerp(0, -0.2, p);
      choreoZ = THREE.MathUtils.lerp(-0.4, 0, p);
      choreoRotY = THREE.MathUtils.lerp(Math.PI * 1.6, Math.PI * 2.0, p);
    }

    // Set target vectors
    targetPos.current.set(choreoX + floatX, choreoY + floatY, choreoZ);
    targetRot.current.set(
      choreoRotX + interactiveRotX,
      choreoRotY + interactiveRotY,
      choreoRotZ
    );

    // Delta-time aware interpolation (Lerp damp)
    const dampRate = 1.0 - Math.exp(-cfg.damping * 120 * clampedDelta);

    currentPos.current.lerp(targetPos.current, dampRate);
    groupRef.current.position.copy(currentPos.current);

    // Rotation interpolation
    currentRot.current.x = THREE.MathUtils.lerp(currentRot.current.x, targetRot.current.x, dampRate);
    currentRot.current.y = THREE.MathUtils.lerp(currentRot.current.y, targetRot.current.y, dampRate);
    currentRot.current.z = THREE.MathUtils.lerp(currentRot.current.z, targetRot.current.z, dampRate);
    groupRef.current.rotation.copy(currentRot.current);
  });

  return <group ref={groupRef}>{children}</group>;
}

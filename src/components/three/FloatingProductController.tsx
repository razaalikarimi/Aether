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

  // Inertial state tracking with Quaternion SLERP to prevent gimbal lock
  const currentPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const currentQuat = useRef(new THREE.Quaternion());
  const targetQuat = useRef(new THREE.Quaternion());
  const targetEuler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const floatTime = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Delta clamp to prevent teleportation on lag spikes or tab switching
    const clampedDelta = Math.min(delta, 0.1);
    floatTime.current += clampedDelta;

    if (prefersReducedMotion) {
      // Direct deterministic positioning without floating oscillation
      groupRef.current.position.set(0, 0, 0);
      targetEuler.current.set(0, scrollProgress * Math.PI * 0.5, 0);
      targetQuat.current.setFromEuler(targetEuler.current);
      groupRef.current.quaternion.copy(targetQuat.current);
      return;
    }

    // 1. Natural Controlled Vertical Floating (Sine waves with orbital perturbation)
    const floatY =
      Math.sin(floatTime.current * 1.2) * cfg.floatStrength +
      Math.sin(floatTime.current * 0.6) * (cfg.floatStrength * 0.4);
    const floatX = Math.cos(floatTime.current * 0.8) * (cfg.floatStrength * 0.35);

    // 2. Mouse Raycast Tracking with Cinematic Timeline Attenuation
    // When exploded view (0.45 - 0.72) or acquisition (0.72+) is active,
    // attenuate pointer influence so user mouse movement does not fight the exploded alignment
    const pointerAttenuate =
      scrollProgress < 0.45
        ? 1.0
        : Math.max(0.15, 1.0 - (scrollProgress - 0.45) * 2.2);

    const maxTiltRad = THREE.MathUtils.degToRad(cfg.maxTiltDegrees);
    const mouseX = THREE.MathUtils.clamp(state.pointer.x, -1, 1);
    const mouseY = THREE.MathUtils.clamp(state.pointer.y, -1, 1);

    const interactiveRotX = -mouseY * maxTiltRad * cfg.pointerInfluence * pointerAttenuate;
    const interactiveRotY = mouseX * maxTiltRad * cfg.pointerInfluence * pointerAttenuate;

    // 3. Scroll Choreography Interpolation (Synchronized with Chapter Stages)
    let choreoX = 0;
    let choreoY = 0;
    let choreoZ = 0;
    let choreoRotX = 0;
    let choreoRotY = scrollProgress * Math.PI * 2.2;
    let choreoRotZ = 0;

    // Stage 1 (0 - 0.22): Reveal (Centered Hero Anchor)
    // Stage 2 (0.22 - 0.45): Kinematics & Chassis (Orbital shift to showcase titanium yokes)
    if (scrollProgress >= 0.22 && scrollProgress < 0.45) {
      const p = (scrollProgress - 0.22) / 0.23;
      choreoX = THREE.MathUtils.lerp(0, 1.15, p);
      choreoRotX = THREE.MathUtils.lerp(0, 0.32, p);
      choreoZ = THREE.MathUtils.lerp(0, 0.4, p);
    }
    // Stage 3 (0.45 - 0.72): Exploded Transducer View (Macro focus on driver components)
    else if (scrollProgress >= 0.45 && scrollProgress < 0.72) {
      const p = (scrollProgress - 0.45) / 0.27;
      choreoX = THREE.MathUtils.lerp(1.15, -0.65, p);
      choreoZ = THREE.MathUtils.lerp(0.4, 0.85, p);
      choreoRotX = THREE.MathUtils.lerp(0.32, 0.15, p);
      choreoRotY = THREE.MathUtils.lerp(Math.PI * 0.95, Math.PI * 1.55, p);
    }
    // Stage 4 (0.72 - 1.0): Metallurgy & Acquisition (Clean resolution into purchase deck)
    else if (scrollProgress >= 0.72) {
      const p = (scrollProgress - 0.72) / 0.28;
      choreoX = THREE.MathUtils.lerp(-0.65, 0, p);
      choreoY = THREE.MathUtils.lerp(0, -0.15, p);
      choreoZ = THREE.MathUtils.lerp(0.85, 0, p);
      choreoRotX = THREE.MathUtils.lerp(0.15, 0, p);
      choreoRotY = THREE.MathUtils.lerp(Math.PI * 1.55, Math.PI * 2.0, p);
    }

    // Set target position
    targetPos.current.set(choreoX + floatX, choreoY + floatY, choreoZ);

    // Set target rotation via Euler then convert to Quaternion
    targetEuler.current.set(
      choreoRotX + interactiveRotX,
      choreoRotY + interactiveRotY,
      choreoRotZ
    );
    targetQuat.current.setFromEuler(targetEuler.current);

    // Delta-time aware exponential damping rate
    const dampRate = 1.0 - Math.exp(-cfg.damping * 120 * clampedDelta);

    // 4. Position Vector Lerp
    currentPos.current.lerp(targetPos.current, dampRate);
    groupRef.current.position.copy(currentPos.current);

    // 5. Quaternion Spherical Linear Interpolation (SLERP)
    currentQuat.current.slerp(targetQuat.current, dampRate);
    groupRef.current.quaternion.copy(currentQuat.current);
  });

  return <group ref={groupRef}>{children}</group>;
}

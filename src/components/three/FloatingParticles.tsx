'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { usePerformanceTier } from '@/lib/performance/usePerformanceTier';

export function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const { particleBudget, tier } = usePerformanceTier();

  const count = useMemo(() => {
    if (tier === 'fallback') return 0;
    return particleBudget;
  }, [particleBudget, tier]);

  // Procedural particle coordinates & velocities
  const [positions, velocities, initialPos] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const init = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute in a spherical cloud around the product
      const radius = 2.5 + Math.random() * 6.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = (radius * Math.sin(phi) * Math.sin(theta)) * 0.7; // Flattened elipse
      const z = radius * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      init[i * 3] = x;
      init[i * 3 + 1] = y;
      init[i * 3 + 2] = z;

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return [pos, vel, init];
  }, [count]);

  // Clean GPU memory allocation when particle tier count updates or unmounts
  React.useEffect(() => {
    const currentPoints = pointsRef.current;
    return () => {
      if (currentPoints) {
        currentPoints.geometry.dispose();
        if (Array.isArray(currentPoints.material)) {
          currentPoints.material.forEach((m) => m.dispose());
        } else {
          currentPoints.material.dispose();
        }
      }
    };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current || count === 0) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;

    const pointerX = state.pointer.x * 3.0;
    const pointerY = state.pointer.y * 3.0;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Gentle orbital drift
      posArr[idx] += velocities[idx];
      posArr[idx + 1] += velocities[idx + 1];
      posArr[idx + 2] += velocities[idx + 2];

      // Gravity-anchor pull towards initial position
      posArr[idx] += (initialPos[idx] - posArr[idx]) * 0.002;
      posArr[idx + 1] += (initialPos[idx + 1] - posArr[idx + 1]) * 0.002;
      posArr[idx + 2] += (initialPos[idx + 2] - posArr[idx + 2]) * 0.002;

      // Pointer repulsion
      const dx = posArr[idx] - pointerX;
      const dy = posArr[idx + 1] - pointerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1.8) {
        const force = (1.8 - dist) * 0.02;
        posArr[idx] += dx * force;
        posArr[idx + 1] += dy * force;
      }
    }

    posAttr.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#e2b857"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

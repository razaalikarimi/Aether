'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { fluidAuraVertexShader, fluidAuraFragmentShader } from '@/shaders/fluidAura';

interface FluidAuraProps {
  colorPreset?: 'titanium' | 'onyx' | 'silver' | 'gold';
  intensity?: number;
}

export function FluidAuraBackground({
  colorPreset = 'titanium',
  intensity = 1.0,
}: FluidAuraProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const accentColors = useMemo(
    () => ({
      titanium: new THREE.Color('#8d929b'),
      onyx: new THREE.Color('#383a45'),
      silver: new THREE.Color('#00f0ff'),
      gold: new THREE.Color('#d4af37'),
    }),
    []
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerVelocity: { value: 0.0 },
      uColorBase: { value: new THREE.Color('#050507') },
      uColorAccent: { value: accentColors[colorPreset] },
      uIntensity: { value: intensity },
    }),
    [accentColors, colorPreset, intensity]
  );

  const prevPointer = useRef({ x: 0, y: 0 });
  const velocityRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;

    // Update time with bounded delta
    material.uniforms.uTime.value += delta * 0.45;

    // Pointer smooth tracking
    const targetX = (state.pointer.x + 1) * 0.5;
    const targetY = (state.pointer.y + 1) * 0.5;

    material.uniforms.uPointer.value.lerp(new THREE.Vector2(targetX, targetY), 0.08);

    // Calculate velocity
    const dx = targetX - prevPointer.current.x;
    const dy = targetY - prevPointer.current.y;
    const instantaneousSpeed = Math.sqrt(dx * dx + dy * dy) * 40;
    prevPointer.current = { x: targetX, y: targetY };

    // Damp velocity
    velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, instantaneousSpeed, 0.1);
    material.uniforms.uPointerVelocity.value = Math.min(velocityRef.current, 1.5);

    // Interpolate accent color
    const targetColor = accentColors[colorPreset];
    material.uniforms.uColorAccent.value.lerp(targetColor, 0.05);
    material.uniforms.uIntensity.value = intensity;
  });

  React.useEffect(() => {
    const currentMesh = meshRef.current;
    return () => {
      if (currentMesh) {
        currentMesh.geometry.dispose();
        if (Array.isArray(currentMesh.material)) {
          currentMesh.material.forEach((m) => m.dispose());
        } else {
          currentMesh.material.dispose();
        }
      }
    };
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, -8]} scale={[viewport.width * 2.2, viewport.height * 2.2, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={fluidAuraVertexShader}
        fragmentShader={fluidAuraFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

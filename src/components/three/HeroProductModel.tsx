'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MaterialPresetId, MaterialProperties } from '@/types/three';

interface HeroProductModelProps {
  materialPreset?: MaterialPresetId;
  explodedProgress?: number; // 0 to 1
  isMacroFocus?: boolean;
}

export const MATERIAL_SPECS: Record<MaterialPresetId, MaterialProperties> = {
  titanium: {
    id: 'titanium',
    name: 'Aerospace Grade 5 Titanium',
    color: '#9ba0ab',
    metalness: 0.94,
    roughness: 0.26,
    clearcoat: 0.35,
    clearcoatRoughness: 0.15,
    reflectivity: 0.9,
    accentColor: '#8d929b',
  },
  onyx: {
    id: 'onyx',
    name: 'DLC Matte Obsidian',
    color: '#1a1b20',
    metalness: 0.82,
    roughness: 0.42,
    clearcoat: 0.15,
    clearcoatRoughness: 0.25,
    reflectivity: 0.6,
    accentColor: '#343640',
  },
  silver: {
    id: 'silver',
    name: 'Mirrored Chrome Silver',
    color: '#dbe0ea',
    metalness: 0.98,
    roughness: 0.14,
    clearcoat: 0.75,
    clearcoatRoughness: 0.08,
    reflectivity: 1.0,
    accentColor: '#00f2fe',
  },
  gold: {
    id: 'gold',
    name: '18K Champagne Gold Luster',
    color: '#d8b257',
    metalness: 0.95,
    roughness: 0.22,
    clearcoat: 0.6,
    clearcoatRoughness: 0.12,
    reflectivity: 0.95,
    accentColor: '#e2b857',
  },
};

export function HeroProductModel({
  materialPreset = 'titanium',
  explodedProgress = 0,
}: HeroProductModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rightGrilleRef = useRef<THREE.Mesh>(null);
  const rightDriverRef = useRef<THREE.Mesh>(null);
  const rightDiaphragmRef = useRef<THREE.Mesh>(null);
  const rightPadRef = useRef<THREE.Mesh>(null);

  const matSpec = useMemo(() => MATERIAL_SPECS[materialPreset] || MATERIAL_SPECS.titanium, [
    materialPreset,
  ]);

  // Smooth interpolation of materials and exploded target offsets
  useFrame((_, delta) => {
    // Exploded offsets along X axis
    const explosionFactor = THREE.MathUtils.clamp(explodedProgress, 0, 1);

    if (rightGrilleRef.current) {
      rightGrilleRef.current.position.x = 1.35 + explosionFactor * 1.6;
      rightGrilleRef.current.rotation.y = explosionFactor * 0.3;
    }
    if (rightDriverRef.current) {
      rightDriverRef.current.position.x = 1.35 + explosionFactor * 0.9;
    }
    if (rightDiaphragmRef.current) {
      rightDiaphragmRef.current.position.x = 1.35 + explosionFactor * 0.4;
    }
    if (rightPadRef.current) {
      rightPadRef.current.position.x = 1.35 - explosionFactor * 0.7;
    }

    // Material lerping across meshes
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mesh.userData.usePreset) {
              const targetCol = new THREE.Color(matSpec.color);
              mat.color.lerp(targetCol, delta * 3.5);
              mat.metalness = THREE.MathUtils.lerp(mat.metalness, matSpec.metalness, delta * 3.5);
              mat.roughness = THREE.MathUtils.lerp(mat.roughness, matSpec.roughness, delta * 3.5);
            }
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={[1.4, 1.4, 1.4]}>
      {/* 1. ARCHED HEADBAND (Titanium arch) */}
      <mesh position={[0, 1.6, 0]} userData={{ usePreset: true }}>
        <torusGeometry args={[1.35, 0.065, 24, 64, Math.PI]} />
        <meshStandardMaterial
          color={matSpec.color}
          metalness={matSpec.metalness}
          roughness={matSpec.roughness}
        />
      </mesh>

      {/* Headband Lambskin Cushion */}
      <mesh position={[0, 1.7, 0]}>
        <torusGeometry args={[1.28, 0.08, 16, 48, Math.PI * 0.65]} />
        <meshStandardMaterial color="#111216" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* 2. LEFT YOKE & GIMBAL */}
      <group position={[-1.35, 0.4, 0]}>
        {/* Pivot pin */}
        <mesh position={[0, 0.5, 0]} userData={{ usePreset: true }}>
          <cylinderGeometry args={[0.08, 0.08, 0.25, 24]} />
          <meshStandardMaterial
            color={matSpec.color}
            metalness={matSpec.metalness}
            roughness={matSpec.roughness}
          />
        </mesh>
        {/* Gimbal Ring */}
        <mesh userData={{ usePreset: true }}>
          <torusGeometry args={[0.62, 0.045, 16, 32]} />
          <meshStandardMaterial
            color={matSpec.color}
            metalness={matSpec.metalness}
            roughness={matSpec.roughness}
          />
        </mesh>

        {/* LEFT EAR CUP (Assembled) */}
        <group position={[0, 0, 0]}>
          {/* Outer Housing */}
          <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} userData={{ usePreset: true }}>
            <cylinderGeometry args={[0.55, 0.58, 0.28, 48]} />
            <meshStandardMaterial
              color={matSpec.color}
              metalness={matSpec.metalness}
              roughness={matSpec.roughness}
            />
          </mesh>
          {/* Outer Grille */}
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.5, 0.5, 0.02, 32]} />
            <meshStandardMaterial color="#0a0a0e" metalness={0.9} roughness={0.3} wireframe />
          </mesh>
          {/* Ear Cushion */}
          <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.48, 0.18, 24, 48]} />
            <meshStandardMaterial color="#121319" roughness={0.8} metalness={0.05} />
          </mesh>
        </group>
      </group>

      {/* 3. RIGHT YOKE & GIMBAL */}
      <group position={[1.35, 0.4, 0]}>
        {/* Pivot pin */}
        <mesh position={[0, 0.5, 0]} userData={{ usePreset: true }}>
          <cylinderGeometry args={[0.08, 0.08, 0.25, 24]} />
          <meshStandardMaterial
            color={matSpec.color}
            metalness={matSpec.metalness}
            roughness={matSpec.roughness}
          />
        </mesh>
        {/* Gimbal Ring */}
        <mesh userData={{ usePreset: true }}>
          <torusGeometry args={[0.62, 0.045, 16, 32]} />
          <meshStandardMaterial
            color={matSpec.color}
            metalness={matSpec.metalness}
            roughness={matSpec.roughness}
          />
        </mesh>
      </group>

      {/* 4. RIGHT EAR CUP EXPLODED SUB-ASSEMBLY */}
      {/* Component A: Outer Housing */}
      <mesh
        position={[1.35, 0.4, 0]}
        rotation={[0, 0, Math.PI / 2]}
        userData={{ usePreset: true }}
      >
        <cylinderGeometry args={[0.58, 0.55, 0.25, 48]} />
        <meshStandardMaterial
          color={matSpec.color}
          metalness={matSpec.metalness}
          roughness={matSpec.roughness}
        />
      </mesh>

      {/* Component B: Laser-etched Outer Acoustic Grille (Separates outward +X) */}
      <mesh
        ref={rightGrilleRef}
        position={[1.35, 0.4, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.52, 0.52, 0.03, 36]} />
        <meshStandardMaterial
          color={matSpec.accentColor}
          metalness={0.98}
          roughness={0.2}
          wireframe
        />
      </mesh>

      {/* Component C: Neodymium N52 Planar Stator Ring (Mid separation) */}
      <mesh
        ref={rightDriverRef}
        position={[1.35, 0.4, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <torusGeometry args={[0.42, 0.06, 16, 36]} />
        <meshStandardMaterial color="#c0c4ce" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Component D: Ultra-thin Planar Diaphragm */}
      <mesh
        ref={rightDiaphragmRef}
        position={[1.35, 0.4, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <circleGeometry args={[0.38, 36]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.99}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Component E: Hand-stitched Lambskin Ear Pad (Separates inward -X) */}
      <mesh
        ref={rightPadRef}
        position={[1.35, 0.4, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <torusGeometry args={[0.48, 0.18, 24, 48]} />
        <meshStandardMaterial color="#111216" roughness={0.85} metalness={0.05} />
      </mesh>
    </group>
  );
}

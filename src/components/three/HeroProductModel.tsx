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
    color: '#9aa0ab',
    metalness: 0.94,
    roughness: 0.22,
    clearcoat: 0.45,
    clearcoatRoughness: 0.12,
    reflectivity: 0.92,
    accentColor: '#8d929b',
  },
  onyx: {
    id: 'onyx',
    name: 'DLC Matte Obsidian',
    color: '#18191e',
    metalness: 0.88,
    roughness: 0.38,
    clearcoat: 0.25,
    clearcoatRoughness: 0.2,
    reflectivity: 0.7,
    accentColor: '#343640',
  },
  silver: {
    id: 'silver',
    name: 'Mirrored Chrome Platinum',
    color: '#e2e6f0',
    metalness: 0.99,
    roughness: 0.12,
    clearcoat: 0.85,
    clearcoatRoughness: 0.06,
    reflectivity: 1.0,
    accentColor: '#00f2fe',
  },
  gold: {
    id: 'gold',
    name: '18K Champagne Gold Luster',
    color: '#dfba63',
    metalness: 0.96,
    roughness: 0.18,
    clearcoat: 0.7,
    clearcoatRoughness: 0.1,
    reflectivity: 0.96,
    accentColor: '#e2b857',
  },
};

export function HeroProductModel({
  materialPreset = 'titanium',
  explodedProgress = 0,
}: HeroProductModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rightGrilleRef = useRef<THREE.Mesh>(null);
  const rightStatorRef = useRef<THREE.Group>(null);
  const rightDiaphragmRef = useRef<THREE.Mesh>(null);
  const rightPadRef = useRef<THREE.Mesh>(null);
  const leftPadRef = useRef<THREE.Mesh>(null);

  const matSpec = useMemo(
    () => MATERIAL_SPECS[materialPreset] || MATERIAL_SPECS.titanium,
    [materialPreset]
  );

  useFrame((_, delta) => {
    const explosionFactor = THREE.MathUtils.clamp(explodedProgress, 0, 1);

    // Exploded sub-assembly targets along X axis with subtle rotations
    if (rightGrilleRef.current) {
      rightGrilleRef.current.position.x = 1.35 + explosionFactor * 1.85;
      rightGrilleRef.current.rotation.y = explosionFactor * 0.45;
    }
    if (rightStatorRef.current) {
      rightStatorRef.current.position.x = 1.35 + explosionFactor * 1.15;
      rightStatorRef.current.rotation.y = explosionFactor * 0.25;
    }
    if (rightDiaphragmRef.current) {
      rightDiaphragmRef.current.position.x = 1.35 + explosionFactor * 0.55;
    }
    if (rightPadRef.current) {
      rightPadRef.current.position.x = 1.35 - explosionFactor * 0.85;
    }
    if (leftPadRef.current) {
      leftPadRef.current.position.x = -1.35 + explosionFactor * 0.35;
    }

    // Material lerping across meshes for high-end finish changes
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (
            mesh.material &&
            (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial
          ) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mesh.userData.usePreset) {
              const targetCol = new THREE.Color(matSpec.color);
              mat.color.lerp(targetCol, delta * 4.0);
              mat.metalness = THREE.MathUtils.lerp(mat.metalness, matSpec.metalness, delta * 4.0);
              mat.roughness = THREE.MathUtils.lerp(mat.roughness, matSpec.roughness, delta * 4.0);
            }
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={[1.45, 1.45, 1.45]}>
      {/* 1. ARCHED HEADBAND (Dual-rail Titanium architecture) */}
      <mesh position={[0, 1.62, 0]} userData={{ usePreset: true }}>
        <torusGeometry args={[1.36, 0.055, 24, 64, Math.PI]} />
        <meshStandardMaterial
          color={matSpec.color}
          metalness={matSpec.metalness}
          roughness={matSpec.roughness}
        />
      </mesh>
      <mesh position={[0, 1.62, -0.08]} userData={{ usePreset: true }}>
        <torusGeometry args={[1.36, 0.035, 20, 64, Math.PI]} />
        <meshStandardMaterial
          color={matSpec.color}
          metalness={matSpec.metalness}
          roughness={matSpec.roughness}
        />
      </mesh>

      {/* Perforated Ergonomic Lambskin Comfort Suspension Strap */}
      <mesh position={[0, 1.72, -0.04]}>
        <torusGeometry args={[1.29, 0.09, 16, 48, Math.PI * 0.68]} />
        <meshStandardMaterial color="#0e0f14" roughness={0.75} metalness={0.08} />
      </mesh>

      {/* 2. LEFT YOKE & GIMBAL SYSTEM */}
      <group position={[-1.35, 0.38, 0]}>
        {/* CNC Pivot Bearing */}
        <mesh position={[0, 0.52, 0]} userData={{ usePreset: true }}>
          <cylinderGeometry args={[0.09, 0.09, 0.28, 32]} />
          <meshStandardMaterial
            color={matSpec.color}
            metalness={matSpec.metalness}
            roughness={matSpec.roughness}
          />
        </mesh>
        {/* 5-Axis Milled Yoke Gimbal Ring */}
        <mesh userData={{ usePreset: true }}>
          <torusGeometry args={[0.64, 0.045, 16, 36]} />
          <meshStandardMaterial
            color={matSpec.color}
            metalness={matSpec.metalness}
            roughness={matSpec.roughness}
          />
        </mesh>

        {/* LEFT EAR CUP HOUSING */}
        <group position={[0, 0, 0]}>
          {/* Anodized Outer Acoustic Cup with Beveled Chamfer */}
          <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} userData={{ usePreset: true }}>
            <cylinderGeometry args={[0.56, 0.59, 0.28, 48]} />
            <meshStandardMaterial
              color={matSpec.color}
              metalness={matSpec.metalness}
              roughness={matSpec.roughness}
            />
          </mesh>
          {/* Outer Laser-Etched Stainless Acoustic Grille */}
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.52, 0.52, 0.02, 36]} />
            <meshStandardMaterial color="#090a0f" metalness={0.95} roughness={0.2} wireframe />
          </mesh>
          {/* Micro Knurled Volume Dial */}
          <mesh position={[-0.16, -0.44, 0.25]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 24]} />
            <meshStandardMaterial color="#c0c4ce" metalness={0.98} roughness={0.2} />
          </mesh>
          {/* 4.4mm Pentaconn Balanced Input Port */}
          <mesh position={[-0.12, -0.58, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.99} roughness={0.15} />
          </mesh>
          {/* Memory Foam Lambskin Ear Pad */}
          <mesh ref={leftPadRef} position={[0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.49, 0.19, 24, 48]} />
            <meshStandardMaterial color="#0f1016" roughness={0.88} metalness={0.04} />
          </mesh>
        </group>
      </group>

      {/* 3. RIGHT YOKE & GIMBAL SYSTEM */}
      <group position={[1.35, 0.38, 0]}>
        {/* CNC Pivot Bearing */}
        <mesh position={[0, 0.52, 0]} userData={{ usePreset: true }}>
          <cylinderGeometry args={[0.09, 0.09, 0.28, 32]} />
          <meshStandardMaterial
            color={matSpec.color}
            metalness={matSpec.metalness}
            roughness={matSpec.roughness}
          />
        </mesh>
        {/* Yoke Gimbal Ring */}
        <mesh userData={{ usePreset: true }}>
          <torusGeometry args={[0.64, 0.045, 16, 36]} />
          <meshStandardMaterial
            color={matSpec.color}
            metalness={matSpec.metalness}
            roughness={matSpec.roughness}
          />
        </mesh>
      </group>

      {/* 4. RIGHT EAR CUP EXPLODED SUB-ASSEMBLY */}
      {/* Component A: Titanium Outer Chamber Base */}
      <mesh
        position={[1.35, 0.38, 0]}
        rotation={[0, 0, Math.PI / 2]}
        userData={{ usePreset: true }}
      >
        <cylinderGeometry args={[0.59, 0.56, 0.26, 48]} />
        <meshStandardMaterial
          color={matSpec.color}
          metalness={matSpec.metalness}
          roughness={matSpec.roughness}
        />
      </mesh>

      {/* 4.4mm Pentaconn Balanced Input Port (Right) */}
      <mesh position={[1.35, -0.2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.99} roughness={0.15} />
      </mesh>

      {/* Component B: Laser-Cut Stainless Geometric Acoustic Grille (Separates outward +X) */}
      <mesh
        ref={rightGrilleRef}
        position={[1.35, 0.38, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.53, 0.53, 0.03, 36]} />
        <meshStandardMaterial
          color={matSpec.accentColor}
          metalness={0.98}
          roughness={0.18}
          wireframe
        />
      </mesh>

      {/* Component C: Dual Symmetrical Neodymium N52 Magnetic Stator Rails */}
      <group ref={rightStatorRef} position={[1.35, 0.38, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.43, 0.065, 16, 36]} />
          <meshStandardMaterial color="#b2b6c2" metalness={0.96} roughness={0.18} />
        </mesh>
        {/* Horizontal Stator Bar Arrays */}
        {[-0.2, -0.07, 0.07, 0.2].map((yOffset) => (
          <mesh key={yOffset} position={[0, yOffset, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.04, 0.06, 0.6]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Component D: 2.5μm Gold-Vaporized Planar Diaphragm */}
      <mesh
        ref={rightDiaphragmRef}
        position={[1.35, 0.38, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <circleGeometry args={[0.4, 40]} />
        <meshStandardMaterial
          color="#dcb252"
          metalness={0.99}
          roughness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Component E: Hand-stitched Lambskin Memory Foam Isolation Cushion */}
      <mesh
        ref={rightPadRef}
        position={[1.35, 0.38, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <torusGeometry args={[0.49, 0.19, 24, 48]} />
        <meshStandardMaterial color="#0f1016" roughness={0.88} metalness={0.04} />
      </mesh>
    </group>
  );
}

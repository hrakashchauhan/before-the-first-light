import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

interface HandpumpProps {
  position?: [number, number, number]
}

export function Handpump({ position = [4.6, 0, 3.2] }: HandpumpProps) {
  const ironMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.handpumpIron,
      roughness: 0.6,
      metalness: 0.7,
    })
  }, [])

  const concreteMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#95a5a6',
      roughness: 0.85,
      metalness: 0.05,
    })
  }, [])

  return (
    <group position={position}>
      {/* 1. Concrete Soakage Platform (Chabutra) */}
      <mesh position={[0, 0.04, 0]} receiveShadow castShadow material={concreteMaterial}>
        <cylinderGeometry args={[1.1, 1.2, 0.08, 16]} />
      </mesh>
      {/* Platform Raised Rim */}
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]} material={concreteMaterial}>
        <torusGeometry args={[1.08, 0.035, 6, 18]} />
      </mesh>

      {/* 2. Main Vertical Cast Iron Cylinder Body */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow material={ironMaterial}>
        <cylinderGeometry args={[0.09, 0.11, 1.15, 12]} />
      </mesh>
      {/* Base Flange Mounting Plate */}
      <mesh position={[0, 0.1, 0]} castShadow material={ironMaterial}>
        <cylinderGeometry args={[0.18, 0.2, 0.05, 12]} />
      </mesh>
      {/* Pump Head Cap */}
      <mesh position={[0, 1.25, 0]} castShadow material={ironMaterial}>
        <cylinderGeometry args={[0.12, 0.1, 0.12, 12]} />
      </mesh>

      {/* 3. Curved Water Spout */}
      <mesh position={[0, 0.68, 0.18]} rotation={[0.4, 0, 0]} castShadow material={ironMaterial}>
        <cylinderGeometry args={[0.035, 0.04, 0.3, 10]} />
      </mesh>

      {/* 4. Handpump Lever Handle (Long Angled Arm) */}
      <group position={[0, 1.2, -0.06]} rotation={[-0.25, 0, 0]}>
        <mesh position={[0, 0.12, -0.45]} rotation={[-0.15, 0, 0]} castShadow material={ironMaterial}>
          <boxGeometry args={[0.04, 0.05, 0.95]} />
        </mesh>
        {/* Handle Heavy End Knob */}
        <mesh position={[0, 0.2, -0.92]} castShadow material={ironMaterial}>
          <sphereGeometry args={[0.065, 8, 8]} />
        </mesh>
      </group>
    </group>
  )
}

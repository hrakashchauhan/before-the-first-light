import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

interface BambooBasketsProps {
  position?: [number, number, number]
  showDaura?: boolean
}

export function BambooBaskets({
  position = [-1.5, 0.32, -2.4],
  showDaura = true,
}: BambooBasketsProps) {
  const bambooYellowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.bambooYellow,
      roughness: 0.6,
      metalness: 0.05,
    })
  }, [])

  const caneTrimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#b88137',
      roughness: 0.75,
      metalness: 0.05,
    })
  }, [])

  return (
    <group position={position}>
      {/* 1. Traditional Chhath Bamboo Soop (Arghya Basket) */}
      <group position={[0, 0, 0]} rotation={[0.08, -0.2, 0]}>
        {/* Soop Flat Base Plate */}
        <mesh position={[0, 0.02, 0]} receiveShadow castShadow material={bambooYellowMaterial}>
          <boxGeometry args={[0.38, 0.02, 0.44]} />
        </mesh>
        {/* Raised Curved Back Rim */}
        <mesh position={[0, 0.08, -0.21]} castShadow material={caneTrimMaterial}>
          <boxGeometry args={[0.4, 0.12, 0.03]} />
        </mesh>
        {/* Raised Left Rim */}
        <mesh position={[-0.19, 0.07, -0.04]} castShadow material={caneTrimMaterial}>
          <boxGeometry args={[0.03, 0.1, 0.36]} />
        </mesh>
        {/* Raised Right Rim */}
        <mesh position={[0.19, 0.07, -0.04]} castShadow material={caneTrimMaterial}>
          <boxGeometry args={[0.03, 0.1, 0.36]} />
        </mesh>
        {/* Front Opening Lip (where offerings like thekua and fruits rest) */}
        <mesh position={[0, 0.015, 0.22]} material={bambooYellowMaterial}>
          <boxGeometry args={[0.38, 0.012, 0.05]} />
        </mesh>
      </group>

      {/* 2. Traditional Woven Bamboo Daura (Deep Offering Basket) */}
      {showDaura && (
        <group position={[0.55, 0, 0.1]}>
          {/* Main woven basket body */}
          <mesh position={[0, 0.14, 0]} castShadow receiveShadow material={bambooYellowMaterial}>
            <cylinderGeometry args={[0.26, 0.18, 0.28, 16, 1, true]} />
          </mesh>
          {/* Basket solid woven bottom */}
          <mesh position={[0, 0.01, 0]} receiveShadow material={bambooYellowMaterial}>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
          </mesh>
          {/* Sturdy Cane Reinforced Rim */}
          <mesh position={[0, 0.28, 0]} castShadow material={caneTrimMaterial}>
            <torusGeometry args={[0.26, 0.02, 8, 20]} />
          </mesh>
        </group>
      )}
    </group>
  )
}

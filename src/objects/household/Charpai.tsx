import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

interface CharpaiProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

export function Charpai({
  position = [-3.2, 0, 3.4],
  rotation = [0, 0.25, 0],
}: CharpaiProps) {
  const woodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.verandaWood,
      roughness: 0.75,
      metalness: 0.05,
    })
  }, [])

  const ropeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.charpaiRope,
      roughness: 0.85,
      metalness: 0.02,
    })
  }, [])

  // Four legs of the charpai
  const legPositions: [number, number][] = [
    [-0.88, -0.48],
    [0.88, -0.48],
    [-0.88, 0.48],
    [0.88, 0.48],
  ]

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Four Turned Wooden Legs */}
      {legPositions.map(([x, z], idx) => (
        <group key={`leg-${idx}`} position={[x, 0.22, z]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.045, 0.055, 0.44, 8]} />
          </mesh>
          {/* Leg Top Mortise Cap */}
          <mesh position={[0, 0.24, 0]} castShadow material={woodMaterial}>
            <sphereGeometry args={[0.05, 8, 8]} />
          </mesh>
        </group>
      ))}

      {/* 2. Four Wooden Side Rails */}
      {/* Long Side Rails */}
      <mesh position={[0, 0.42, -0.48]} castShadow material={woodMaterial}>
        <boxGeometry args={[1.86, 0.07, 0.06]} />
      </mesh>
      <mesh position={[0, 0.42, 0.48]} castShadow material={woodMaterial}>
        <boxGeometry args={[1.86, 0.07, 0.06]} />
      </mesh>
      {/* Short Head & Foot Rails */}
      <mesh position={[-0.88, 0.42, 0]} castShadow material={woodMaterial}>
        <boxGeometry args={[0.06, 0.07, 1.02]} />
      </mesh>
      <mesh position={[0.88, 0.42, 0]} castShadow material={woodMaterial}>
        <boxGeometry args={[0.06, 0.07, 1.02]} />
      </mesh>

      {/* 3. Woven Natural Jute/Cotton Rope Mattress Surface */}
      <mesh position={[-0.04, 0.41, 0]} receiveShadow material={ropeMaterial}>
        <boxGeometry args={[1.68, 0.03, 0.9]} />
      </mesh>

      {/* 4. Folded Cotton Gaddi / Quilt on Cot */}
      <mesh position={[0.48, 0.46, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.08, 0.8]} />
        <meshStandardMaterial color="#c0392b" roughness={0.8} />
      </mesh>
    </group>
  )
}

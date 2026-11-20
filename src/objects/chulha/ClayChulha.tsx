import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

interface ClayChulhaProps {
  position?: [number, number, number]
  isReady?: boolean
}

export function ClayChulha({ position = [3.2, 0.16, -1.8], isReady = true }: ClayChulhaProps) {
  const clayMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isReady ? GAME_CONFIG.palette.clayChulha : '#8a5035',
      roughness: 0.88,
      metalness: 0.04,
    })
  }, [isReady])

  const sootMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#3d2b24',
      roughness: 0.95,
    })
  }, [])

  const woodStickMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#5c3d26',
      roughness: 0.8,
    })
  }, [])

  return (
    <group position={position}>
      {/* 1. Mud Base Plinth (Chulha Chauki) */}
      <mesh position={[0, 0.04, 0]} receiveShadow castShadow material={clayMaterial}>
        <boxGeometry args={[0.9, 0.08, 0.9]} />
      </mesh>

      {/* 2. U-shaped Clay Stove Walls */}
      {/* Back Wall */}
      <mesh position={[0, 0.22, -0.24]} castShadow receiveShadow material={clayMaterial}>
        <boxGeometry args={[0.58, 0.28, 0.16]} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-0.24, 0.22, 0.02]} castShadow receiveShadow material={clayMaterial}>
        <boxGeometry args={[0.16, 0.28, 0.52]} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[0.24, 0.22, 0.02]} castShadow receiveShadow material={clayMaterial}>
        <boxGeometry args={[0.16, 0.28, 0.52]} />
      </mesh>

      {/* 3. Pot Rests / Horns on Rim */}
      {/* Back Rest */}
      <mesh position={[0, 0.38, -0.22]} castShadow material={clayMaterial}>
        <coneGeometry args={[0.045, 0.08, 6]} />
      </mesh>
      {/* Left Rest */}
      <mesh position={[-0.22, 0.38, 0.1]} castShadow material={clayMaterial}>
        <coneGeometry args={[0.045, 0.08, 6]} />
      </mesh>
      {/* Right Rest */}
      <mesh position={[0.22, 0.38, 0.1]} castShadow material={clayMaterial}>
        <coneGeometry args={[0.045, 0.08, 6]} />
      </mesh>

      {/* 4. Combustion Chamber Floor / Soot bed */}
      <mesh position={[0, 0.09, 0.02]} receiveShadow material={sootMaterial}>
        <boxGeometry args={[0.34, 0.02, 0.42]} />
      </mesh>

      {/* 5. Prepared Mango / Dry Wood Sticks ready for Prasad */}
      {[-0.06, 0.02, 0.08].map((x, idx) => (
        <mesh
          key={`wood-stick-${idx}`}
          position={[x, 0.11, 0.2]}
          rotation={[0.12, (idx - 1) * 0.15, 0]}
          castShadow
          material={woodStickMaterial}
        >
          <cylinderGeometry args={[0.02, 0.025, 0.38, 6]} />
        </mesh>
      ))}
    </group>
  )
}

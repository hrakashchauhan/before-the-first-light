import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

interface CourtyardGroundProps {
  isCleaned?: boolean
}

export function CourtyardGround({ isCleaned = false }: CourtyardGroundProps) {
  // Shared materials for terrain to minimize GPU state changes
  const outerGroundMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.groundEarth,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
    })
  }, [])

  const sweptGroundMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isCleaned ? '#7d583e' : GAME_CONFIG.palette.groundSwept,
      roughness: 0.85,
      metalness: 0.02,
    })
  }, [isCleaned])

  const borderMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#8d705c',
      roughness: 0.9,
    })
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* Main village ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
        material={outerGroundMaterial}
      >
        <planeGeometry args={[32, 32, 12, 12]} />
      </mesh>

      {/* Central swept courtyard zone */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 1]}
        receiveShadow
        material={sweptGroundMaterial}
      >
        <planeGeometry args={[11, 9, 8, 8]} />
      </mesh>

      {/* Courtyard edge boundary stones / compacted earth curb */}
      <mesh
        position={[0, 0.04, -3.5]}
        receiveShadow
        castShadow
        material={borderMaterial}
      >
        <boxGeometry args={[11.2, 0.08, 0.2]} />
      </mesh>
      <mesh
        position={[0, 0.04, 5.5]}
        receiveShadow
        castShadow
        material={borderMaterial}
      >
        <boxGeometry args={[11.2, 0.08, 0.2]} />
      </mesh>
      <mesh
        position={[-5.5, 0.04, 1]}
        receiveShadow
        castShadow
        material={borderMaterial}
      >
        <boxGeometry args={[0.2, 0.08, 9]} />
      </mesh>
      <mesh
        position={[5.5, 0.04, 1]}
        receiveShadow
        castShadow
        material={borderMaterial}
      >
        <boxGeometry args={[0.2, 0.08, 9]} />
      </mesh>
    </group>
  )
}

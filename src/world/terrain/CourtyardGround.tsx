import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

interface CourtyardGroundProps {
  isCleaned?: boolean
}

export function CourtyardGround({ isCleaned = false }: CourtyardGroundProps) {
  const outerGroundMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.groundEarth,
      roughness: 0.95,
      metalness: 0.02,
    })
  }, [])

  const sweptGroundMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isCleaned ? '#825f46' : GAME_CONFIG.palette.groundSwept,
      roughness: 0.82,
      metalness: 0.02,
    })
  }, [isCleaned])

  const footpathMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#634734',
      roughness: 0.9,
    })
  }, [])

  const borderCurbMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#8e715b',
      roughness: 0.92,
    })
  }, [])

  const boundaryWallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.mudWall,
      roughness: 0.9,
    })
  }, [])

  const boundaryWallCopingMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.mudWallDark,
      roughness: 0.92,
    })
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Base Village Earth Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.04, 0]}
        receiveShadow
        material={outerGroundMaterial}
      >
        <planeGeometry args={[36, 36, 16, 16]} />
      </mesh>

      {/* 2. Central Swept Courtyard (Organic Curved Oval Shape) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0.8]}
        receiveShadow
        material={sweptGroundMaterial}
      >
        <circleGeometry args={[5.2, 32]} />
      </mesh>

      {/* 3. Swept Yard Border (Subtle Limewashed / Packed Earth Rim) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0.8]}
        material={borderCurbMaterial}
      >
        <ringGeometry args={[5.1, 5.28, 32]} />
      </mesh>

      {/* 4. Beaten-Earth Footpath Leading out to Village Lane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0.35]}
        position={[4.6, 0.005, 5.2]}
        receiveShadow
        material={footpathMaterial}
      >
        <planeGeometry args={[2.4, 9.0]} />
      </mesh>

      {/* 5. Courtyard Right Perimeter Mud Boundary Wall */}
      <group position={[6.2, 0, 1.2]}>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow material={boundaryWallMaterial}>
          <boxGeometry args={[0.34, 1.5, 9.6]} />
        </mesh>
        <mesh position={[0, 1.52, 0]} castShadow material={boundaryWallCopingMaterial}>
          <boxGeometry args={[0.42, 0.08, 9.64]} />
        </mesh>
      </group>

      {/* 6. Front Courtyard Low Garden/Lane Wall */}
      <group position={[0.5, 0, 6.4]}>
        <mesh position={[-3.2, 0.5, 0]} castShadow receiveShadow material={boundaryWallMaterial}>
          <boxGeometry args={[6.0, 1.0, 0.3]} />
        </mesh>
        <mesh position={[-3.2, 1.02, 0]} castShadow material={boundaryWallCopingMaterial}>
          <boxGeometry args={[6.04, 0.06, 0.36]} />
        </mesh>
      </group>
    </group>
  )
}

import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

export function HouseBlockout() {
  const mudWallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.mudWall,
      roughness: 0.9,
      metalness: 0.05,
    })
  }, [])

  const mudWallDarkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.mudWallDark,
      roughness: 0.92,
      metalness: 0.05,
    })
  }, [])

  const woodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.verandaWood,
      roughness: 0.7,
      metalness: 0.1,
    })
  }, [])

  const roofMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.roofTile,
      roughness: 0.8,
      metalness: 0.08,
    })
  }, [])

  const verandaFloorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#82634d',
      roughness: 0.88,
    })
  }, [])

  return (
    <group position={[0, 0, -4.8]}>
      {/* 1. Main House Back & Side Walls */}
      {/* Back Wall */}
      <mesh position={[0, 1.5, -2]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[8.4, 3.0, 0.4]} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-4.0, 1.5, -0.2]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[0.4, 3.0, 3.6]} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[4.0, 1.5, -0.2]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[0.4, 3.0, 3.6]} />
      </mesh>

      {/* Front Wall - Left Section */}
      <mesh position={[-2.4, 1.5, 1.4]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[3.2, 3.0, 0.4]} />
      </mesh>
      {/* Front Wall - Right Section */}
      <mesh position={[2.4, 1.5, 1.4]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[3.2, 3.0, 0.4]} />
      </mesh>
      {/* Front Wall - Above Door Lintel */}
      <mesh position={[0, 2.6, 1.4]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[1.6, 0.8, 0.4]} />
      </mesh>

      {/* Door Frame & Recessed Wooden Doorway */}
      <mesh position={[0, 1.05, 1.25]} castShadow material={woodMaterial}>
        <boxGeometry args={[1.4, 2.1, 0.1]} />
      </mesh>

      {/* Small Village Window Openings */}
      <mesh position={[-2.4, 1.6, 1.62]} material={woodMaterial}>
        <boxGeometry args={[0.8, 0.9, 0.08]} />
      </mesh>
      <mesh position={[2.4, 1.6, 1.62]} material={woodMaterial}>
        <boxGeometry args={[0.8, 0.9, 0.08]} />
      </mesh>

      {/* 2. Raised Veranda Platform (Ooth) */}
      <mesh position={[0, 0.16, 2.4]} receiveShadow castShadow material={verandaFloorMaterial}>
        <boxGeometry args={[8.8, 0.32, 2.0]} />
      </mesh>
      {/* Veranda Step down to Courtyard */}
      <mesh position={[0, 0.08, 3.55]} receiveShadow castShadow material={verandaFloorMaterial}>
        <boxGeometry args={[3.0, 0.16, 0.35]} />
      </mesh>

      {/* 3. Veranda Pillars (Authentic Wooden Columns) */}
      {[-3.6, -1.2, 1.2, 3.6].map((x, idx) => (
        <group key={`pillar-${idx}`} position={[x, 1.5, 3.2]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.09, 0.11, 2.7, 8]} />
          </mesh>
          {/* Pillar stone base */}
          <mesh position={[0, -1.3, 0]} castShadow receiveShadow material={mudWallDarkMaterial}>
            <boxGeometry args={[0.28, 0.18, 0.28]} />
          </mesh>
        </group>
      ))}

      {/* Horizontal Veranda Support Eave Beam */}
      <mesh position={[0, 2.85, 3.2]} castShadow receiveShadow material={woodMaterial}>
        <boxGeometry args={[8.8, 0.18, 0.18]} />
      </mesh>

      {/* 4. Sloped Roof (Terracotta Tiles / Thatch Structure) */}
      <mesh
        position={[0, 3.3, 1.2]}
        rotation={[0.32, 0, 0]}
        castShadow
        receiveShadow
        material={roofMaterial}
      >
        <boxGeometry args={[9.4, 0.22, 5.2]} />
      </mesh>

      {/* 5. Sunny Boundary Wall for Goitha Drying */}
      <group position={[-5.4, 0, 2.8]}>
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow material={mudWallMaterial}>
          <boxGeometry args={[0.35, 1.8, 5.0]} />
        </mesh>
        <mesh position={[0, 1.82, 0]} castShadow material={mudWallDarkMaterial}>
          <boxGeometry args={[0.42, 0.08, 5.04]} />
        </mesh>
      </group>
    </group>
  )
}

import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

export function HouseBlockout() {
  const mudWallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.mudWall,
      roughness: 0.88,
      metalness: 0.04,
    })
  }, [])

  const mudWallDarkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.mudWallDark,
      roughness: 0.92,
      metalness: 0.04,
    })
  }, [])

  const woodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.verandaWood,
      roughness: 0.72,
      metalness: 0.08,
    })
  }, [])

  const roofTileMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.roofTile,
      roughness: 0.78,
      metalness: 0.06,
    })
  }, [])

  const roofRidgeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#8c3b1d',
      roughness: 0.8,
    })
  }, [])

  const verandaFloorMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#8a6952',
      roughness: 0.86,
    })
  }, [])

  return (
    <group position={[0, 0, -4.8]}>
      {/* 1. Raised House Foundation Plinth (Dawaar) */}
      <mesh position={[0, 0.15, 0.2]} receiveShadow castShadow material={mudWallDarkMaterial}>
        <boxGeometry args={[8.8, 0.3, 4.6]} />
      </mesh>

      {/* 2. Main Mud Wall Envelope */}
      {/* Back Wall */}
      <mesh position={[0, 1.6, -1.9]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[8.4, 2.9, 0.38]} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-4.0, 1.6, -0.1]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[0.38, 2.9, 3.8]} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[4.0, 1.6, -0.1]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[0.38, 2.9, 3.8]} />
      </mesh>

      {/* Front Wall - Left Section */}
      <mesh position={[-2.4, 1.6, 1.6]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[3.2, 2.9, 0.38]} />
      </mesh>
      {/* Front Wall - Right Section */}
      <mesh position={[2.4, 1.6, 1.6]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[3.2, 2.9, 0.38]} />
      </mesh>
      {/* Front Wall - Lintel over door */}
      <mesh position={[0, 2.65, 1.6]} castShadow receiveShadow material={mudWallMaterial}>
        <boxGeometry args={[1.6, 0.8, 0.38]} />
      </mesh>

      {/* Heavy Timber Doorway Lintel & Frame */}
      <mesh position={[0, 2.2, 1.62]} castShadow material={woodMaterial}>
        <boxGeometry args={[1.5, 0.14, 0.42]} />
      </mesh>
      {/* Wooden Door Panel (Recessed) */}
      <mesh position={[0, 1.1, 1.48]} castShadow material={woodMaterial}>
        <boxGeometry args={[1.25, 2.1, 0.08]} />
      </mesh>

      {/* Village Windows with Wooden Frames */}
      {[-2.4, 2.4].map((x, idx) => (
        <group key={`window-${idx}`} position={[x, 1.65, 1.6]}>
          <mesh material={woodMaterial}>
            <boxGeometry args={[0.85, 0.95, 0.42]} />
          </mesh>
          <mesh position={[0, 0, 0.22]} material={mudWallDarkMaterial}>
            <boxGeometry args={[0.65, 0.75, 0.04]} />
          </mesh>
        </group>
      ))}

      {/* 3. Veranda Platform (Ooth) */}
      <mesh position={[0, 0.16, 2.7]} receiveShadow castShadow material={verandaFloorMaterial}>
        <boxGeometry args={[8.6, 0.32, 1.8]} />
      </mesh>
      {/* Veranda Step down to courtyard */}
      <mesh position={[0, 0.08, 3.7]} receiveShadow castShadow material={verandaFloorMaterial}>
        <boxGeometry args={[3.2, 0.16, 0.35]} />
      </mesh>

      {/* 4. Veranda Wooden Pillar Columns */}
      {[-3.6, -1.2, 1.2, 3.6].map((x, idx) => (
        <group key={`pillar-${idx}`} position={[x, 1.55, 3.3]}>
          {/* Stone Plinth base */}
          <mesh position={[0, -1.25, 0]} castShadow receiveShadow material={mudWallDarkMaterial}>
            <boxGeometry args={[0.26, 0.2, 0.26]} />
          </mesh>
          {/* Turned timber pillar */}
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.08, 0.09, 2.6, 8]} />
          </mesh>
          {/* Top bracket capital */}
          <mesh position={[0, 1.26, 0]} castShadow material={woodMaterial}>
            <boxGeometry args={[0.32, 0.12, 0.24]} />
          </mesh>
        </group>
      ))}

      {/* Horizontal Veranda Architrave Support Beam */}
      <mesh position={[0, 2.85, 3.3]} castShadow receiveShadow material={woodMaterial}>
        <boxGeometry args={[8.8, 0.16, 0.16]} />
      </mesh>

      {/* 5. Exposed Roof Rafter Beams (Visible beneath eave!) */}
      {[-3.8, -2.8, -1.8, -0.8, 0.2, 1.2, 2.2, 3.2].map((x, idx) => (
        <mesh
          key={`rafter-${idx}`}
          position={[x, 2.95, 2.4]}
          rotation={[0.3, 0, 0]}
          castShadow
          material={woodMaterial}
        >
          <boxGeometry args={[0.08, 0.08, 2.2]} />
        </mesh>
      ))}

      {/* 6. Pitch Terracotta Tile Roof */}
      <mesh
        position={[0, 3.32, 1.1]}
        rotation={[0.28, 0, 0]}
        castShadow
        receiveShadow
        material={roofTileMaterial}
      >
        <boxGeometry args={[9.2, 0.16, 5.0]} />
      </mesh>
      {/* Terracotta Roof Ridge Cap */}
      <mesh
        position={[0, 4.02, -1.1]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        material={roofRidgeMaterial}
      >
        <cylinderGeometry args={[0.16, 0.16, 9.24, 8]} />
      </mesh>

      {/* 7. Sunny Courtyard Boundary Wall (Left Perimeter) */}
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

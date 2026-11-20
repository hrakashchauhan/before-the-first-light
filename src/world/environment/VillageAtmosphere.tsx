import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

export function VillageAtmosphere() {
  // 1. Warm morning sky dome material with gentle horizon gradient
  const skyMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: GAME_CONFIG.palette.skyHorizon,
      side: THREE.BackSide,
    })
  }, [])

  // 2. Tree canopy material (dusty neem/mango greens)
  const treeCanopyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#3d5236',
      roughness: 0.9,
      flatShading: true,
    })
  }, [])

  // 3. Tree trunk material
  const woodBarkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#4a3525',
      roughness: 0.95,
    })
  }, [])

  // 4. Distant thatched roof material
  const distantHutMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#826343',
      roughness: 0.9,
    })
  }, [])

  const distantHutWallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#b09e86',
      roughness: 0.92,
    })
  }, [])

  // Deterministic trees surrounding the village homestead
  const treePositions: [number, number, number, number][] = [
    [-11, 0, -8, 1.8],
    [-14, 0, 2, 2.2],
    [-9, 0, 11, 1.6],
    [10, 0, -10, 2.0],
    [13, 0, 1, 1.9],
    [11, 0, 10, 1.7],
    [2, 0, -14, 2.3],
  ]

  // Distant neighboring huts visible past boundary
  const distantHuts: [number, number, number, number][] = [
    [-12, 0, -4, 0.4],
    [12, 0, -5, -0.3],
    [-4, 0, -13, 0.1],
    [10, 0, 12, 0.8],
  ]

  return (
    <group>
      {/* Surrounding Sky Dome (Prevents any black void!) */}
      <mesh material={skyMaterial}>
        <sphereGeometry args={[110, 24, 16]} />
      </mesh>

      {/* Surrounding Village Earth Expansion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#422f22" roughness={0.96} />
      </mesh>

      {/* Clustered Village Trees (Neem, Mango, Peepal) */}
      {treePositions.map(([x, y, z, scale], idx) => (
        <group key={`tree-${idx}`} position={[x, y, z]} scale={scale}>
          {/* Trunk */}
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow material={woodBarkMaterial}>
            <cylinderGeometry args={[0.22, 0.34, 3.0, 7]} />
          </mesh>
          {/* Lower Canopy Tier */}
          <mesh position={[0, 3.4, 0]} castShadow receiveShadow material={treeCanopyMaterial}>
            <dodecahedronGeometry args={[1.5, 1]} />
          </mesh>
          {/* Upper Canopy Tier */}
          <mesh position={[0.2, 4.4, -0.1]} castShadow receiveShadow material={treeCanopyMaterial}>
            <dodecahedronGeometry args={[1.1, 1]} />
          </mesh>
        </group>
      ))}

      {/* Distant Neighbouring Village Huts */}
      {distantHuts.map(([x, y, z, rot], idx) => (
        <group key={`hut-${idx}`} position={[x, y, z]} rotation={[0, rot, 0]}>
          {/* Walls */}
          <mesh position={[0, 1.0, 0]} castShadow receiveShadow material={distantHutWallMaterial}>
            <boxGeometry args={[4.2, 2.0, 3.2]} />
          </mesh>
          {/* Thatched Roof */}
          <mesh position={[0, 2.3, 0]} castShadow receiveShadow material={distantHutMaterial}>
            <coneGeometry args={[3.0, 1.4, 4]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

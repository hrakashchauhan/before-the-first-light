import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

export function VillageLane() {
  // Beaten earth lane material
  const laneMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#5c4331',
      roughness: 0.92,
      metalness: 0.02,
    })
  }, [])

  // Grass and wild roadside verge material
  const vergeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#423223',
      roughness: 0.95,
    })
  }, [])

  // Bamboo stalk material
  const bambooStalkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#6e853a',
      roughness: 0.65,
    })
  }, [])

  const bambooNodeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#8f9d50',
      roughness: 0.7,
    })
  }, [])

  const bambooLeafMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#4a6b2f',
      roughness: 0.85,
      flatShading: true,
    })
  }, [])

  // Thatch & timber for artisan workshop
  const thatchMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.roofThatch,
      roughness: 0.95,
    })
  }, [])

  const timberMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.verandaWood,
      roughness: 0.88,
    })
  }, [])

  const caneBasketMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.bambooYellow,
      roughness: 0.75,
    })
  }, [])

  // Bamboo grove stalk positions (clumping naturally along the north verge)
  const bambooPositions: [number, number, number, number][] = [
    [7.5, 0, 1.2, 5.2],
    [8.1, 0, 0.8, 5.8],
    [8.7, 0, 1.5, 5.0],
    [9.4, 0, 1.0, 6.2],
    [10.0, 0, 1.6, 5.4],
    [10.8, 0, 1.1, 5.9],
    [7.2, 0, 0.4, 4.8],
    [8.9, 0, 0.5, 5.5],
  ]

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Main Beaten-Earth Footpath Extending Eastwards */}
      {/* Section 1: From Courtyard Gate turning toward artisan workshop */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0.12]}
        position={[9.5, 0.008, 4.2]}
        receiveShadow
        material={laneMaterial}
      >
        <planeGeometry args={[11.5, 3.2]} />
      </mesh>

      {/* Section 2: From Artisan Workshop toward the Ghat */}
      <mesh
        rotation={[-Math.PI / 2, 0, -0.08]}
        position={[17.0, 0.009, 3.8]}
        receiveShadow
        material={laneMaterial}
      >
        <planeGeometry args={[8.0, 3.4]} />
      </mesh>

      {/* Roadside Earthen Edging Verges */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0.1]}
        position={[13.0, 0.004, 2.3]}
        receiveShadow
        material={vergeMaterial}
      >
        <planeGeometry args={[18.0, 1.8]} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0.1]}
        position={[13.0, 0.004, 5.8]}
        receiveShadow
        material={vergeMaterial}
      >
        <planeGeometry args={[18.0, 1.8]} />
      </mesh>

      {/* 2. Natural Bamboo Grove (Baans ki Kothi) */}
      <group position={[0, 0, 0]}>
        {bambooPositions.map(([x, y, z, height], idx) => (
          <group key={`bamboo-${idx}`} position={[x, y, z]}>
            {/* Main Tall Bamboo Cane */}
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow material={bambooStalkMaterial}>
              <cylinderGeometry args={[0.07, 0.085, height, 7]} />
            </mesh>
            {/* Bamboo Joint Nodes */}
            {[1.2, 2.4, 3.6, 4.8].map((h, nIdx) =>
              h < height ? (
                <mesh key={`node-${nIdx}`} position={[0, h, 0]} material={bambooNodeMaterial}>
                  <cylinderGeometry args={[0.088, 0.088, 0.06, 7]} />
                </mesh>
              ) : null
            )}
            {/* Feathery Leaf Cluster at Upper Height */}
            <group position={[0, height - 0.4, 0]}>
              <mesh position={[0.2, 0, 0.1]} rotation={[0.4, 0.2, 0.3]} material={bambooLeafMaterial}>
                <boxGeometry args={[0.7, 0.02, 0.22]} />
              </mesh>
              <mesh position={[-0.2, 0.2, -0.1]} rotation={[-0.3, -0.4, -0.2]} material={bambooLeafMaterial}>
                <boxGeometry args={[0.65, 0.02, 0.2]} />
              </mesh>
              <mesh position={[0.1, 0.35, -0.2]} rotation={[0.2, 0.6, 0.4]} material={bambooLeafMaterial}>
                <boxGeometry args={[0.6, 0.02, 0.18]} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* 3. Artisan Workshop Porch (Mohan Kaka's Dalan) */}
      <group position={[12.5, 0, 6.6]}>
        {/* Workshop Raised Earth Floor */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[4.8, 0.2, 3.2]} />
          <meshStandardMaterial color="#6a4c38" roughness={0.94} />
        </mesh>

        {/* Timber Support Posts */}
        {[
          [-2.2, 1.1, -1.4],
          [2.2, 1.1, -1.4],
          [-2.2, 1.1, 1.4],
          [2.2, 1.1, 1.4],
        ].map(([px, py, pz], idx) => (
          <mesh key={`post-${idx}`} position={[px, py, pz]} castShadow material={timberMaterial}>
            <cylinderGeometry args={[0.07, 0.08, 2.0, 6]} />
          </mesh>
        ))}

        {/* Slanted Thatched Awning Roof */}
        <mesh position={[0, 2.15, 0]} rotation={[0.18, 0, 0]} castShadow material={thatchMaterial}>
          <boxGeometry args={[5.2, 0.16, 3.6]} />
        </mesh>

        {/* Stacks of Prepared Bamboo Offerings & Strips */}
        {/* Stack of Woven Soop (Offering Scoops) */}
        <group position={[1.4, 0.2, -0.6]} rotation={[0, 0.4, 0]}>
          <mesh castShadow material={caneBasketMaterial}>
            <boxGeometry args={[0.5, 0.08, 0.6]} />
          </mesh>
          <mesh position={[0, 0.09, 0]} castShadow material={caneBasketMaterial}>
            <boxGeometry args={[0.48, 0.08, 0.58]} />
          </mesh>
          <mesh position={[0, 0.18, 0]} castShadow material={caneBasketMaterial}>
            <boxGeometry args={[0.46, 0.08, 0.56]} />
          </mesh>
        </group>

        {/* Deep Woven Daura Baskets */}
        <group position={[1.5, 0.2, 0.6]}>
          <mesh position={[0, 0.2, 0]} castShadow material={caneBasketMaterial}>
            <cylinderGeometry args={[0.35, 0.25, 0.4, 12]} />
          </mesh>
        </group>

        {/* Bundle of Split Raw Bamboo Cane Strips */}
        <group position={[-1.6, 0.22, 0.2]} rotation={[0, 0.2, 0.1]}>
          <mesh castShadow material={bambooStalkMaterial}>
            <cylinderGeometry args={[0.12, 0.12, 2.2, 8]} />
          </mesh>
        </group>
      </group>

      {/* Rustic Roadside Limewashed Marking Stones */}
      {[
        [6.2, 0.08, 3.4],
        [8.8, 0.08, 6.2],
        [11.5, 0.08, 2.8],
        [15.2, 0.08, 6.0],
        [18.0, 0.08, 2.6],
      ].map(([sx, sy, sz], idx) => (
        <mesh key={`stone-${idx}`} position={[sx, sy, sz]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial color="#dcd5cb" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

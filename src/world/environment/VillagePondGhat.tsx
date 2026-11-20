import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

interface VillagePondGhatProps {
  isOfferingReady?: boolean
  isGhatHighlighted?: boolean
  isKoshiHighlighted?: boolean
}

export function VillagePondGhat({
  isOfferingReady = true,
  isGhatHighlighted = false,
  isKoshiHighlighted = false,
}: VillagePondGhatProps) {
  const waterRef = useRef<THREE.Mesh>(null)
  const diyaGlowRef = useRef<THREE.PointLight>(null)

  // Gentle subtle water undulation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (waterRef.current) {
      waterRef.current.position.y = -0.12 + Math.sin(t * 1.5) * 0.008
    }
    if (diyaGlowRef.current) {
      diyaGlowRef.current.intensity = 0.8 + Math.sin(t * 8.0) * 0.15 + Math.cos(t * 5.0) * 0.1
    }
  })

  // Materials
  const brickMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.brickRed,
      roughness: 0.86,
    })
  }, [])

  const brickDarkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.brickRedDark,
      roughness: 0.9,
    })
  }, [])

  const limewashTrimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#e8e2d8',
      roughness: 0.92,
    })
  }, [])

  const waterMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.pondWater,
      roughness: 0.14,
      metalness: 0.12,
      transparent: true,
      opacity: 0.88,
    })
  }, [])

  const siltBankMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#342921',
      roughness: 0.96,
    })
  }, [])

  const bananaLeafMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.bananaLeaf,
      roughness: 0.72,
      flatShading: true,
    })
  }, [])

  const bananaTrunkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#829148',
      roughness: 0.82,
    })
  }, [])

  const sugarcaneMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.sugarcaneGreen,
      roughness: 0.75,
    })
  }, [])

  const diyaClayMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.clayChulha,
      roughness: 0.85,
    })
  }, [])

  const flameMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#ff9922',
    })
  }, [])

  const marigoldOrangeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.marigoldOrange,
      roughness: 0.8,
    })
  }, [])

  const marigoldYellowMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.marigoldYellow,
      roughness: 0.8,
    })
  }, [])

  return (
    <group position={[21.0, 0, 3.5]}>
      {/* 1. Sacred Pond Water Basin (Pokhra) */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[4.0, -0.12, 0]}
        receiveShadow
        material={waterMaterial}
      >
        <planeGeometry args={[18.0, 22.0, 16, 16]} />
      </mesh>

      {/* Silt Shoreline Edge Under Water */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[4.0, -0.22, 0]}
        receiveShadow
        material={siltBankMaterial}
      >
        <planeGeometry args={[19.0, 23.0]} />
      </mesh>

      {/* 2. Terraced Red Fired Brick Steps (Ghat Paudhiyan) */}
      {/* Top Platform Walkway */}
      <mesh position={[-1.2, 0.05, 0]} castShadow receiveShadow material={brickMaterial}>
        <boxGeometry args={[2.4, 0.16, 9.6]} />
      </mesh>

      {/* Step Tier 1 */}
      <mesh position={[0.4, -0.01, 0]} castShadow receiveShadow material={brickDarkMaterial}>
        <boxGeometry args={[0.9, 0.14, 9.2]} />
      </mesh>

      {/* Step Tier 2 */}
      <mesh position={[1.2, -0.07, 0]} castShadow receiveShadow material={brickMaterial}>
        <boxGeometry args={[0.9, 0.14, 8.8]} />
      </mesh>

      {/* Step Tier 3 (Submerged in gentle water) */}
      <mesh position={[2.0, -0.13, 0]} receiveShadow material={brickDarkMaterial}>
        <boxGeometry args={[0.9, 0.14, 8.4]} />
      </mesh>

      {/* 3. Limewash Edge & Central Ritual Arpan Platform */}
      {/* White limewash geometric ritual border on top step */}
      <mesh position={[-1.2, 0.132, 0]} rotation={[-Math.PI / 2, 0, 0]} material={limewashTrimMaterial}>
        <ringGeometry args={[1.0, 1.12, 16]} />
      </mesh>
      {/* Inner floral star motif */}
      <mesh position={[-1.2, 0.133, 0]} rotation={[-Math.PI / 2, 0, 0]} material={limewashTrimMaterial}>
        <circleGeometry args={[0.35, 6]} />
      </mesh>

      {/* 4. Ceremonial Brick Pillars with Marigold Garlands */}
      {[
        [-1.8, 0.6, -4.6],
        [-1.8, 0.6, 4.6],
      ].map(([px, py, pz], idx) => (
        <group key={`ghat-pillar-${idx}`} position={[px, py, pz]}>
          <mesh castShadow receiveShadow material={brickMaterial}>
            <boxGeometry args={[0.55, 1.2, 0.55]} />
          </mesh>
          <mesh position={[0, 0.64, 0]} castShadow material={limewashTrimMaterial}>
            <boxGeometry args={[0.65, 0.08, 0.65]} />
          </mesh>
          {/* Marigold Flower Garland around pillar */}
          {[0.2, 0.4, 0.6].map((gy, gIdx) => (
            <mesh
              key={`garland-${gIdx}`}
              position={[0, gy, 0]}
              rotation={[0.1, 0, 0]}
              material={gIdx % 2 === 0 ? marigoldOrangeMaterial : marigoldYellowMaterial}
            >
              <torusGeometry args={[0.32, 0.035, 6, 12]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 5. Banana Tree Stalks (Kela ke Thaambh) at Ghat Entrance */}
      {[
        [-2.0, 0, -2.6],
        [-2.0, 0, 2.6],
      ].map(([bx, by, bz], idx) => (
        <group key={`banana-${idx}`} position={[bx, by, bz]}>
          {/* Stem */}
          <mesh position={[0, 1.3, 0]} castShadow material={bananaTrunkMaterial}>
            <cylinderGeometry args={[0.11, 0.16, 2.6, 8]} />
          </mesh>
          {/* Arching Broad Green Banana Leaves */}
          {[0, 1.2, 2.4, 3.6, 4.8].map((angle, leafIdx) => (
            <group key={`leaf-${leafIdx}`} position={[0, 2.4, 0]} rotation={[0, angle, 0.35]}>
              <mesh position={[0.6, 0.2, 0]} rotation={[0, 0, -0.4]} material={bananaLeafMaterial}>
                <boxGeometry args={[1.3, 0.02, 0.38]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* 6. Sugarcane Koshi Canopy (Koshi Bharna Setup) */}
      <group position={[-1.2, 0.1, 2.2]}>
        {/* Four Slender Sugarcane Stalks Tied in Conical Pyramid */}
        {[
          [-0.35, 1.6, -0.35, 0.14, 0.14],
          [0.35, 1.6, -0.35, 0.14, -0.14],
          [-0.35, 1.6, 0.35, -0.14, 0.14],
          [0.35, 1.6, 0.35, -0.14, -0.14],
        ].map(([sx, sy, sz, rx, rz], idx) => (
          <mesh
            key={`cane-${idx}`}
            position={[sx, sy, sz]}
            rotation={[rx, 0, rz]}
            castShadow
            material={sugarcaneMaterial}
          >
            <cylinderGeometry args={[0.035, 0.045, 3.3, 6]} />
          </mesh>
        ))}

        {/* Sugarcane Leaf Crown at the Peak */}
        <group position={[0, 3.2, 0]}>
          {[0, 1.5, 3.0, 4.5].map((angle, cIdx) => (
            <mesh
              key={`crown-${cIdx}`}
              rotation={[0.3, angle, 0]}
              position={[0.1, 0.2, 0]}
              material={bananaLeafMaterial}
            >
              <boxGeometry args={[0.55, 0.02, 0.12]} />
            </mesh>
          ))}
        </group>

        {/* Terracotta Koshi Elephant / Tiered Lamp at Center */}
        <group position={[0, 0.05, 0]}>
          <mesh castShadow material={diyaClayMaterial}>
            <cylinderGeometry args={[0.18, 0.24, 0.32, 10]} />
          </mesh>
          {/* Top Bowl with Burning Wick */}
          <mesh position={[0, 0.2, 0]} material={flameMaterial}>
            <coneGeometry args={[0.035, 0.07, 6]} />
          </mesh>
        </group>

        {/* Koshi Highlight */}
        {isKoshiHighlighted && (
          <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.65, 0.75, 20]} />
            <meshBasicMaterial color="#ffbe76" side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>

      {/* 7. Clay Diyas Placed on the Steps */}
      {isOfferingReady &&
        [
          [-0.4, 0.14, -2.8],
          [-0.4, 0.14, -1.4],
          [-0.4, 0.14, 0.0],
          [-0.4, 0.14, 1.4],
          [0.4, 0.08, -2.2],
          [0.4, 0.08, 0.0],
          [0.4, 0.08, 2.2],
          [1.2, 0.02, -1.0],
          [1.2, 0.02, 1.0],
        ].map(([dx, dy, dz], idx) => (
          <group key={`diya-${idx}`} position={[dx, dy, dz]}>
            <mesh castShadow material={diyaClayMaterial}>
              <cylinderGeometry args={[0.065, 0.045, 0.04, 8]} />
            </mesh>
            {/* Warm Flickering Flame */}
            <mesh position={[0, 0.035, 0]} material={flameMaterial}>
              <coneGeometry args={[0.02, 0.045, 5]} />
            </mesh>
          </group>
        ))}

      {/* Soft Warm Point Light from Diyas */}
      {isOfferingReady && (
        <pointLight
          ref={diyaGlowRef}
          position={[0, 0.45, 0]}
          color="#ff9f43"
          intensity={0.9}
          distance={7.0}
          decay={2}
        />
      )}

      {/* 8. Ghat Inspection Target Highlight */}
      {isGhatHighlighted && (
        <mesh position={[-1.2, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.42, 24]} />
          <meshBasicMaterial color="#ffc048" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

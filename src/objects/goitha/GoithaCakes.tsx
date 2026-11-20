import { useMemo } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

export type GoithaDryingStage = 'moist' | 'drying' | 'dry'

interface GoithaCakesProps {
  stage?: GoithaDryingStage
  placedCount?: number
}

export function GoithaCakes({ stage = 'dry', placedCount = 8 }: GoithaCakesProps) {
  const cakeMaterial = useMemo(() => {
    const color =
      stage === 'moist'
        ? GAME_CONFIG.palette.goithaMoist
        : stage === 'drying'
        ? '#573f2e'
        : GAME_CONFIG.palette.goithaDry

    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.95,
      metalness: 0.02,
      flatShading: true,
    })
  }, [stage])

  // Deterministic positions along the sunny boundary wall
  const cakes = useMemo(() => {
    const list = []
    const rows = 2
    const cols = Math.ceil(placedCount / rows)
    let count = 0

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (count >= placedCount) break
        list.push({
          id: `goitha-${count}`,
          x: -5.2,
          y: 0.55 + r * 0.42,
          z: 1.2 + c * 0.44,
          tilt: 0.05 + (count % 3) * 0.02,
        })
        count++
      }
    }
    return list
  }, [placedCount])

  return (
    <group>
      {cakes.map((cake) => (
        <group
          key={cake.id}
          position={[cake.x, cake.y, cake.z]}
          rotation={[0, 0, Math.PI / 2 + cake.tilt]}
        >
          {/* Main flattened round organic disc with thickness */}
          <mesh castShadow receiveShadow material={cakeMaterial}>
            <cylinderGeometry args={[0.15, 0.16, 0.045, 12]} />
          </mesh>
          {/* Subtle center impression */}
          <mesh position={[0, 0.02, 0]} material={cakeMaterial}>
            <cylinderGeometry args={[0.07, 0.09, 0.015, 10]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

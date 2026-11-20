import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GAME_CONFIG } from '../../game/config'

export type WheatStage = 'empty_mat' | 'sorting' | 'spread'

interface WheatDryingMatProps {
  position?: [number, number, number]
  stage?: WheatStage
}

export function WheatDryingMat({
  position = [1.2, 0.02, 1.8],
  stage = 'spread',
}: WheatDryingMatProps) {
  const matMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#d4b373',
      roughness: 0.85,
      metalness: 0.02,
    })
  }, [])

  const borderMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#8f6832',
      roughness: 0.9,
    })
  }, [])

  const grainMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.palette.wheatGrain,
      roughness: 0.65,
      metalness: 0.05,
    })
  }, [])

  const grainCount = stage === 'empty_mat' ? 0 : stage === 'sorting' ? 24 : 72
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    if (!instancedMeshRef.current || grainCount === 0) return

    const dummy = new THREE.Object3D()

    for (let i = 0; i < grainCount; i++) {
      let x = 0
      let z = 0

      if (stage === 'sorting') {
        // Concentrated in two small inspection heaps
        const heap = i % 2 === 0 ? -0.4 : 0.4
        x = heap + (Math.sin(i * 1.5) * 0.25)
        z = Math.cos(i * 1.8) * 0.25
      } else {
        // Uniformly spread across the rectangular mat
        const row = Math.floor(i / 12)
        const col = i % 12
        x = (col - 5.5) * 0.16 + Math.sin(i) * 0.04
        z = (row - 2.5) * 0.18 + Math.cos(i) * 0.04
      }

      dummy.position.set(x, 0.025, z)
      dummy.scale.set(0.045, 0.02, 0.07)
      dummy.rotation.set(0, (i * 0.7) % Math.PI, 0)
      dummy.updateMatrix()

      instancedMeshRef.current.setMatrixAt(i, dummy.matrix)
    }

    instancedMeshRef.current.instanceMatrix.needsUpdate = true
  }, [stage, grainCount])

  return (
    <group position={position}>
      {/* 1. Woven Bamboo Drying Mat Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        material={matMaterial}
      >
        <planeGeometry args={[2.2, 1.4]} />
      </mesh>

      {/* 2. Bound Bamboo Edge Ribs */}
      <mesh position={[0, 0.015, -0.71]} receiveShadow castShadow material={borderMaterial}>
        <boxGeometry args={[2.24, 0.03, 0.04]} />
      </mesh>
      <mesh position={[0, 0.015, 0.71]} receiveShadow castShadow material={borderMaterial}>
        <boxGeometry args={[2.24, 0.03, 0.04]} />
      </mesh>
      <mesh position={[-1.11, 0.015, 0]} receiveShadow castShadow material={borderMaterial}>
        <boxGeometry args={[0.04, 0.03, 1.42]} />
      </mesh>
      <mesh position={[1.11, 0.015, 0]} receiveShadow castShadow material={borderMaterial}>
        <boxGeometry args={[0.04, 0.03, 1.42]} />
      </mesh>

      {/* 3. Instanced Golden Wheat Grains */}
      {grainCount > 0 && (
        <instancedMesh
          ref={instancedMeshRef}
          args={[undefined, undefined, grainCount]}
          castShadow
          receiveShadow
          material={grainMaterial}
        >
          <sphereGeometry args={[1, 6, 6]} />
        </instancedMesh>
      )}
    </group>
  )
}

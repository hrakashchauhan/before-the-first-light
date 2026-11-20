import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NeighbourNPCProps {
  position: [number, number, number]
  rotationY?: number
  isHighlighted?: boolean
  talking?: boolean
}

export function NeighbourNPC({
  position,
  rotationY = -1.2,
  isHighlighted = false,
  talking = false,
}: NeighbourNPCProps) {
  const groupRef = useRef<THREE.Group>(null)
  const armRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (armRef.current) {
      if (talking) {
        armRef.current.rotation.x = -0.3 + Math.sin(t * 3.2) * 0.12
      } else {
        // Sweeping / cleaning motion
        armRef.current.rotation.x = -0.1 + Math.sin(t * 1.8) * 0.18
      }
    }
  })

  // Materials for Neighbour (Mustard Yellow Kurta / Dhoti)
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: '#845336',
    roughness: 0.82,
  })

  const kurtaMaterial = new THREE.MeshStandardMaterial({
    color: '#d69e2e', // Festive haldi/mustard yellow
    roughness: 0.85,
  })

  const dhotiMaterial = new THREE.MeshStandardMaterial({
    color: '#ede8df',
    roughness: 0.85,
  })

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: '#282422',
    roughness: 0.9,
  })

  const broomMaterial = new THREE.MeshStandardMaterial({
    color: '#a0855b',
    roughness: 0.9,
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* Selection indicator */}
      {isHighlighted && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.38, 24]} />
          <meshBasicMaterial color="#d4af37" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Legs (Dhoti) */}
      <group position={[0, 0.42, 0]}>
        <mesh position={[-0.09, 0, 0]} castShadow material={dhotiMaterial}>
          <cylinderGeometry args={[0.085, 0.065, 0.82, 10]} />
        </mesh>
        <mesh position={[0.09, 0, 0]} castShadow material={dhotiMaterial}>
          <cylinderGeometry args={[0.085, 0.065, 0.82, 10]} />
        </mesh>
      </group>

      {/* Torso (Mustard Kurta) */}
      <mesh position={[0, 1.15, 0]} castShadow material={kurtaMaterial}>
        <boxGeometry args={[0.36, 0.56, 0.22]} />
      </mesh>

      {/* Head */}
      <group position={[0, 1.54, 0]}>
        <mesh castShadow material={skinMaterial}>
          <cylinderGeometry args={[0.055, 0.065, 0.12, 10]} />
        </mesh>
        <mesh position={[0, 0.13, 0]} castShadow material={skinMaterial}>
          <boxGeometry args={[0.19, 0.21, 0.18]} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.23, -0.02]} castShadow material={hairMaterial}>
          <boxGeometry args={[0.2, 0.07, 0.19]} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group position={[-0.22, 1.32, 0]}>
        <mesh position={[0, -0.2, 0.08]} rotation={[0.4, 0, 0]} castShadow material={kurtaMaterial}>
          <cylinderGeometry args={[0.055, 0.045, 0.42, 8]} />
        </mesh>
      </group>

      {/* Right Arm holding broom / sweeping tool */}
      <group ref={armRef} position={[0.22, 1.32, 0]}>
        <mesh position={[0, -0.2, 0.1]} rotation={[0.5, 0, 0]} castShadow material={kurtaMaterial}>
          <cylinderGeometry args={[0.055, 0.045, 0.42, 8]} />
        </mesh>
        {/* Long Palm Broom */}
        <group position={[0, -0.4, 0.2]} rotation={[0.6, 0, 0]}>
          <mesh castShadow material={broomMaterial}>
            <cylinderGeometry args={[0.016, 0.016, 1.1, 6]} />
          </mesh>
          <mesh position={[0, -0.5, 0]} castShadow material={broomMaterial}>
            <coneGeometry args={[0.12, 0.32, 8]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

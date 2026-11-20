import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface DadiNPCProps {
  position: [number, number, number]
  rotationY?: number
  isHighlighted?: boolean
  talking?: boolean
}

export function DadiNPC({
  position,
  rotationY = 0.28,
  isHighlighted = false,
  talking = false,
}: DadiNPCProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (headRef.current) {
      headRef.current.rotation.y = talking ? Math.sin(t * 2.5) * 0.08 : Math.sin(t * 0.8) * 0.03
      headRef.current.rotation.z = Math.sin(t * 1.2) * 0.02
    }
  })

  // Materials for Grandmother (Traditional Lal-Paar White Cotton Sari)
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: '#8f5c3f',
    roughness: 0.88,
  })

  const whiteSariMaterial = new THREE.MeshStandardMaterial({
    color: '#f6f5f1',
    roughness: 0.85,
  })

  const redBorderMaterial = new THREE.MeshStandardMaterial({
    color: '#9e2a2b',
    roughness: 0.8,
  })

  const silverHairMaterial = new THREE.MeshStandardMaterial({
    color: '#d4cfc9',
    roughness: 0.9,
  })

  const beadMaterial = new THREE.MeshStandardMaterial({
    color: '#8b4513',
    roughness: 0.6,
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

      {/* Seated Folded Lap / Sari drape on charpai */}
      <group position={[0, 0.42, 0]}>
        <mesh castShadow material={whiteSariMaterial}>
          <boxGeometry args={[0.48, 0.32, 0.42]} />
        </mesh>
        {/* Red border trim along sari pleats */}
        <mesh position={[0, -0.14, 0.215]} castShadow material={redBorderMaterial}>
          <boxGeometry args={[0.48, 0.04, 0.02]} />
        </mesh>
      </group>

      {/* Torso wrapped in white cotton pallu */}
      <mesh position={[0, 0.84, -0.04]} castShadow material={whiteSariMaterial}>
        <boxGeometry args={[0.34, 0.52, 0.22]} />
      </mesh>
      {/* Red border of pallu over chest */}
      <mesh position={[-0.08, 0.88, 0.075]} rotation={[0, 0, 0.35]} castShadow material={redBorderMaterial}>
        <boxGeometry args={[0.04, 0.54, 0.02]} />
      </mesh>

      {/* Head with Sari Ghunghat (veil) */}
      <group ref={headRef} position={[0, 1.18, -0.02]}>
        {/* Face */}
        <mesh position={[0, 0.04, 0.04]} castShadow material={skinMaterial}>
          <boxGeometry args={[0.16, 0.18, 0.15]} />
        </mesh>
        {/* Silver hair visible at forehead */}
        <mesh position={[0, 0.12, 0.08]} castShadow material={silverHairMaterial}>
          <boxGeometry args={[0.14, 0.04, 0.04]} />
        </mesh>
        {/* Ghunghat hood surrounding head */}
        <mesh position={[0, 0.08, -0.02]} castShadow material={whiteSariMaterial}>
          <boxGeometry args={[0.22, 0.26, 0.24]} />
        </mesh>
        {/* Red border running along front edge of ghunghat */}
        <mesh position={[0, 0.18, 0.09]} castShadow material={redBorderMaterial}>
          <boxGeometry args={[0.22, 0.03, 0.02]} />
        </mesh>
      </group>

      {/* Arms resting on lap holding prayer beads (Tulsi Mala) */}
      <group position={[0, 0.62, 0.12]}>
        {/* Forearms */}
        <mesh position={[-0.1, 0, 0]} rotation={[0.4, 0, 0.3]} castShadow material={whiteSariMaterial}>
          <cylinderGeometry args={[0.045, 0.04, 0.3, 8]} />
        </mesh>
        <mesh position={[0.1, 0, 0]} rotation={[0.4, 0, -0.3]} castShadow material={whiteSariMaterial}>
          <cylinderGeometry args={[0.045, 0.04, 0.3, 8]} />
        </mesh>
        {/* Hands */}
        <mesh position={[0, 0.04, 0.1]} castShadow material={skinMaterial}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
        {/* Prayer bead ring */}
        <mesh position={[0, 0.04, 0.12]} rotation={[Math.PI / 4, 0, 0]} material={beadMaterial}>
          <torusGeometry args={[0.04, 0.008, 6, 12]} />
        </mesh>
      </group>
    </group>
  )
}

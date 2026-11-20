import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MotherNPCProps {
  position?: [number, number, number]
  rotationY?: number
  isHighlighted?: boolean
}

export function MotherNPC({
  position = [0.8, 0.32, -2.2],
  rotationY = 0.35,
  isHighlighted = false,
}: MotherNPCProps) {
  const torsoRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)

  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ba7738', // Warm elder skin tone
      roughness: 0.8,
      metalness: 0.05,
    })
  }, [])

  const hairMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#2d2727', // Black hair with slight graying
      roughness: 0.92,
    })
  }, [])

  // Traditional Yellow/Saffron Saree for Chhath Vrati
  const sareeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isHighlighted ? '#fffa65' : '#fbc531',
      roughness: 0.8,
      emissive: isHighlighted ? new THREE.Color('#fbc531') : new THREE.Color('#000000'),
      emissiveIntensity: isHighlighted ? 0.25 : 0,
    })
  }, [isHighlighted])

  // Sacred Red Border (Lal Kinari)
  const borderMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#c0392b',
      roughness: 0.75,
    })
  }, [])

  // Idle breathing and gentle namaste/blessing animation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const breath = Math.sin(t * 1.9) * 0.015
    if (torsoRef.current) torsoRef.current.position.y = 0.84 + breath
    if (headRef.current) headRef.current.rotation.x = breath * 0.5
  })

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Lower Draped Saree Skirt Body */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow material={sareeMaterial}>
        <cylinderGeometry args={[0.22, 0.32, 0.84, 14]} />
      </mesh>
      {/* Red Ritual Hem Border at bottom of Saree */}
      <mesh position={[0, 0.04, 0]} material={borderMaterial}>
        <cylinderGeometry args={[0.322, 0.325, 0.06, 14]} />
      </mesh>

      {/* Torso & Saree Pallu Drape */}
      <group ref={torsoRef} position={[0, 0.84, 0]}>
        {/* Blouse & Torso Form */}
        <mesh position={[0, 0.16, 0]} castShadow receiveShadow material={sareeMaterial}>
          <boxGeometry args={[0.38, 0.42, 0.22]} />
        </mesh>
        {/* Saree Anchal draped across chest diagonally */}
        <mesh position={[0.04, 0.18, 0.12]} rotation={[0, 0, -0.42]} material={borderMaterial}>
          <boxGeometry args={[0.08, 0.44, 0.02]} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.4, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.07, 0.08, 0.1, 10]} />
        </mesh>

        {/* Head & Veiled Hair */}
        <group ref={headRef} position={[0, 0.54, 0]}>
          {/* Cranium */}
          <mesh castShadow material={skinMaterial}>
            <sphereGeometry args={[0.135, 14, 14]} />
          </mesh>
          {/* Saree Pallu covering head respectfully */}
          <mesh position={[0, 0.04, -0.02]} castShadow material={sareeMaterial}>
            <sphereGeometry args={[0.146, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
          </mesh>
          <mesh position={[0, 0.12, 0.04]} rotation={[0.2, 0, 0]} material={borderMaterial}>
            <boxGeometry args={[0.2, 0.03, 0.08]} />
          </mesh>

          {/* 3D Facial Features */}
          {/* Eyes */}
          <mesh position={[-0.045, 0.015, 0.12]} material={hairMaterial}>
            <boxGeometry args={[0.024, 0.01, 0.01]} />
          </mesh>
          <mesh position={[0.045, 0.015, 0.12]} material={hairMaterial}>
            <boxGeometry args={[0.024, 0.01, 0.01]} />
          </mesh>
          {/* Red Bindi / Sindoor mark on forehead */}
          <mesh position={[0, 0.05, 0.13]} material={borderMaterial}>
            <sphereGeometry args={[0.012, 6, 6]} />
          </mesh>
          {/* Nose */}
          <mesh position={[0, -0.01, 0.135]} rotation={[0.15, 0, 0]} material={skinMaterial}>
            <coneGeometry args={[0.018, 0.04, 4]} />
          </mesh>
          {/* Gentle Smile */}
          <mesh position={[0, -0.05, 0.125]} material={skinMaterial}>
            <boxGeometry args={[0.038, 0.01, 0.01]} />
          </mesh>
        </group>

        {/* Folded Hands (Pranam / Blessing Gesture) */}
        <group position={[0, 0.14, 0.18]} rotation={[0.6, 0, 0]}>
          <mesh position={[-0.035, 0, 0]} castShadow material={skinMaterial}>
            <boxGeometry args={[0.045, 0.08, 0.03]} />
          </mesh>
          <mesh position={[0.035, 0, 0]} castShadow material={skinMaterial}>
            <boxGeometry args={[0.045, 0.08, 0.03]} />
          </mesh>
          {/* Glass bangles on wrists */}
          <mesh position={[-0.035, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={borderMaterial}>
            <torusGeometry args={[0.03, 0.008, 6, 12]} />
          </mesh>
          <mesh position={[0.035, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={borderMaterial}>
            <torusGeometry args={[0.03, 0.008, 6, 12]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

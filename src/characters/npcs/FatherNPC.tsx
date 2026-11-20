import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FatherNPCProps {
  position: [number, number, number]
  rotationY?: number
  isHighlighted?: boolean
  talking?: boolean
  activity?: 'firewood' | 'storage' | 'daura_carry' | 'standing'
}

export function FatherNPC({
  position,
  rotationY = -0.5,
  isHighlighted = false,
  talking = false,
  activity = 'firewood',
}: FatherNPCProps) {
  const groupRef = useRef<THREE.Group>(null)
  const chestRef = useRef<THREE.Mesh>(null)
  const rightArmRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (chestRef.current) {
      chestRef.current.scale.set(
        1 + Math.sin(t * 1.6) * 0.02,
        1 + Math.sin(t * 1.6) * 0.025,
        1 + Math.cos(t * 1.6) * 0.02
      )
    }
    if (rightArmRef.current) {
      if (talking) {
        rightArmRef.current.rotation.x = -0.4 + Math.sin(t * 3.5) * 0.15
      } else if (activity === 'firewood') {
        rightArmRef.current.rotation.x = -0.2 + Math.sin(t * 1.2) * 0.08
      }
    }
  })

  // Materials
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: '#8c593b',
    roughness: 0.8,
  })

  const kurtaMaterial = new THREE.MeshStandardMaterial({
    color: '#f0ebe1', // Clean handloom khadi
    roughness: 0.85,
  })

  const dhotiMaterial = new THREE.MeshStandardMaterial({
    color: '#e4ddd3',
    roughness: 0.85,
  })

  const gamchhaMaterial = new THREE.MeshStandardMaterial({
    color: '#9e3428', // Bihari checked/red cotton gamchha
    roughness: 0.78,
  })

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: '#342f2c',
    roughness: 0.9,
  })

  const woodMaterial = new THREE.MeshStandardMaterial({
    color: '#6d4c32',
    roughness: 0.92,
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* Selection indicator disc */}
      {isHighlighted && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 24]} />
          <meshBasicMaterial color="#d4af37" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Legs (Dhoti) */}
      <group position={[0, 0.42, 0]}>
        <mesh position={[-0.1, 0, 0]} castShadow material={dhotiMaterial}>
          <cylinderGeometry args={[0.09, 0.07, 0.82, 10]} />
        </mesh>
        <mesh position={[0.1, 0, 0]} castShadow material={dhotiMaterial}>
          <cylinderGeometry args={[0.09, 0.07, 0.82, 10]} />
        </mesh>
      </group>

      {/* Torso (Kurta) */}
      <mesh ref={chestRef} position={[0, 1.15, 0]} castShadow material={kurtaMaterial}>
        <boxGeometry args={[0.38, 0.58, 0.22]} />
      </mesh>

      {/* Gamchha draped across shoulder */}
      <mesh position={[-0.12, 1.18, 0.01]} rotation={[0, 0, 0.15]} castShadow material={gamchhaMaterial}>
        <boxGeometry args={[0.14, 0.62, 0.25]} />
      </mesh>

      {/* Head & Neck */}
      <group position={[0, 1.55, 0]}>
        <mesh castShadow material={skinMaterial}>
          <cylinderGeometry args={[0.06, 0.07, 0.14, 10]} />
        </mesh>
        <mesh position={[0, 0.14, 0]} castShadow material={skinMaterial}>
          <boxGeometry args={[0.2, 0.22, 0.19]} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 0.24, -0.02]} castShadow material={hairMaterial}>
          <boxGeometry args={[0.21, 0.08, 0.2]} />
        </mesh>
        {/* Moustache */}
        <mesh position={[0, 0.08, 0.105]} castShadow material={hairMaterial}>
          <boxGeometry args={[0.11, 0.03, 0.02]} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group position={[-0.24, 1.34, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow material={kurtaMaterial}>
          <cylinderGeometry args={[0.06, 0.05, 0.44, 8]} />
        </mesh>
        <mesh position={[0, -0.48, 0]} castShadow material={skinMaterial}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.24, 1.34, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow material={kurtaMaterial}>
          <cylinderGeometry args={[0.06, 0.05, 0.44, 8]} />
        </mesh>
        <mesh position={[0, -0.48, 0]} castShadow material={skinMaterial}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
      </group>

      {/* Prop: Mango Firewood Bundle beside Father */}
      {activity === 'firewood' && (
        <group position={[0.35, 0.18, 0.2]} rotation={[0, 0.4, 0]}>
          <mesh castShadow material={woodMaterial} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.035, 0.45, 6]} />
          </mesh>
          <mesh castShadow material={woodMaterial} position={[0.05, 0.02, 0.04]} rotation={[0.1, 0.2, 0]}>
            <cylinderGeometry args={[0.028, 0.032, 0.48, 6]} />
          </mesh>
          <mesh castShadow material={woodMaterial} position={[-0.04, 0.04, 0.03]} rotation={[-0.1, -0.1, 0]}>
            <cylinderGeometry args={[0.03, 0.033, 0.44, 6]} />
          </mesh>
        </group>
      )}
    </group>
  )
}

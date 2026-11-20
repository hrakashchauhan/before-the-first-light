import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ArtisanNPCProps {
  position: [number, number, number]
  isHighlighted?: boolean
}

export function ArtisanNPC({ position, isHighlighted = false }: ArtisanNPCProps) {
  const groupRef = useRef<THREE.Group>(null)
  const chestRef = useRef<THREE.Mesh>(null)
  const rightHandRef = useRef<THREE.Group>(null)

  // Subtle breathing and weaving/crafting gesture
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (chestRef.current) {
      chestRef.current.scale.set(
        1 + Math.sin(t * 1.8) * 0.025,
        1 + Math.sin(t * 1.8) * 0.03,
        1 + Math.cos(t * 1.8) * 0.025
      )
    }
    if (rightHandRef.current) {
      rightHandRef.current.rotation.z = Math.sin(t * 2.2) * 0.08
    }
  })

  // Materials for Mohan Kaka
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: '#845738',
    roughness: 0.82,
  })

  const kurtaMaterial = new THREE.MeshStandardMaterial({
    color: '#dcd3c5', // Natural handloom khadi cotton
    roughness: 0.88,
  })

  const dhotiMaterial = new THREE.MeshStandardMaterial({
    color: '#eae5dc', // Clean off-white dhoti
    roughness: 0.85,
  })

  const gamchhaMaterial = new THREE.MeshStandardMaterial({
    color: '#b23b23', // Red cotton gamchha
    roughness: 0.8,
  })

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: '#c0bbb4', // Silver-grey hair & mustache of an experienced elder
    roughness: 0.9,
  })

  const matMaterial = new THREE.MeshStandardMaterial({
    color: '#d5b273', // Woven reed mat (chatayi)
    roughness: 0.85,
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, -0.4, 0]}>
      {/* 1. Woven Reed Mat (Chatayi) on which Kaka sits */}
      <mesh position={[0, 0.02, 0]} receiveShadow material={matMaterial}>
        <boxGeometry args={[1.2, 0.03, 1.1]} />
      </mesh>

      {/* 2. Folded Legs (Cross-Legged Sitting Posture) */}
      <group position={[0, 0.16, 0]}>
        {/* Left folded thigh/shin */}
        <mesh position={[-0.26, 0, 0.08]} rotation={[0, 0.6, Math.PI / 2]} castShadow material={dhotiMaterial}>
          <cylinderGeometry args={[0.11, 0.13, 0.46, 10]} />
        </mesh>
        {/* Right folded thigh/shin */}
        <mesh position={[0.26, 0, 0.08]} rotation={[0, -0.6, -Math.PI / 2]} castShadow material={dhotiMaterial}>
          <cylinderGeometry args={[0.11, 0.13, 0.46, 10]} />
        </mesh>
        {/* Central folded lap */}
        <mesh position={[0, -0.02, 0.14]} castShadow material={dhotiMaterial}>
          <boxGeometry args={[0.38, 0.14, 0.3]} />
        </mesh>
      </group>

      {/* 3. Torso (Khadi Kurta) */}
      <mesh ref={chestRef} position={[0, 0.52, -0.02]} castShadow material={kurtaMaterial}>
        <boxGeometry args={[0.38, 0.46, 0.24]} />
      </mesh>

      {/* 4. Gamchha Draped over Left Shoulder */}
      <group position={[-0.14, 0.56, -0.02]}>
        <mesh castShadow material={gamchhaMaterial}>
          <boxGeometry args={[0.12, 0.48, 0.27]} />
        </mesh>
        {/* Hanging gamchha tail */}
        <mesh position={[0, -0.28, 0.1]} rotation={[0.1, 0, 0]} castShadow material={gamchhaMaterial}>
          <boxGeometry args={[0.1, 0.32, 0.03]} />
        </mesh>
      </group>

      {/* 5. Left Arm resting gently on knee */}
      <group position={[-0.22, 0.46, 0]}>
        <mesh position={[0, -0.16, 0.12]} rotation={[0.4, 0, -0.2]} castShadow material={kurtaMaterial}>
          <cylinderGeometry args={[0.065, 0.055, 0.34, 8]} />
        </mesh>
        <mesh position={[0.02, -0.32, 0.22]} material={skinMaterial}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
      </group>

      {/* 6. Right Arm (Holding bamboo strip) */}
      <group ref={rightHandRef} position={[0.22, 0.46, 0]}>
        <mesh position={[0, -0.14, 0.14]} rotation={[0.6, 0, 0.3]} castShadow material={kurtaMaterial}>
          <cylinderGeometry args={[0.065, 0.055, 0.32, 8]} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.04, -0.28, 0.26]} material={skinMaterial}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
        {/* Flexible bamboo weaving strip in hand */}
        <mesh position={[-0.06, -0.26, 0.3]} rotation={[0.2, 0.4, 0.8]} castShadow>
          <boxGeometry args={[0.02, 0.015, 0.5]} />
          <meshStandardMaterial color="#c4a159" roughness={0.7} />
        </mesh>
      </group>

      {/* 7. Neck & Head */}
      <mesh position={[0, 0.8, -0.02]} castShadow material={skinMaterial}>
        <cylinderGeometry args={[0.065, 0.075, 0.12, 8]} />
      </mesh>

      {/* Sculpted 3D Head */}
      <group position={[0, 0.94, -0.01]}>
        <mesh castShadow material={skinMaterial}>
          <sphereGeometry args={[0.13, 16, 16]} />
        </mesh>

        {/* Silver-grey Hair */}
        <mesh position={[0, 0.04, -0.04]} castShadow material={hairMaterial}>
          <sphereGeometry args={[0.135, 12, 12]} />
        </mesh>
        {/* Small traditional top-knot/cap */}
        <mesh position={[0, 0.13, -0.02]} castShadow material={hairMaterial}>
          <sphereGeometry args={[0.055, 8, 8]} />
        </mesh>

        {/* 3D Nose */}
        <mesh position={[0, -0.01, 0.13]} rotation={[0.2, 0, 0]} material={skinMaterial}>
          <coneGeometry args={[0.028, 0.06, 6]} />
        </mesh>

        {/* Silver-Grey Mustache */}
        <group position={[0, -0.045, 0.12]}>
          <mesh position={[-0.035, 0, 0]} rotation={[0, 0, -0.25]} material={hairMaterial}>
            <cylinderGeometry args={[0.014, 0.008, 0.07, 6]} />
          </mesh>
          <mesh position={[0.035, 0, 0]} rotation={[0, 0, 0.25]} material={hairMaterial}>
            <cylinderGeometry args={[0.014, 0.008, 0.07, 6]} />
          </mesh>
        </group>

        {/* Kind Eyes */}
        <mesh position={[-0.045, 0.02, 0.11]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshBasicMaterial color="#2c1a10" />
        </mesh>
        <mesh position={[0.045, 0.02, 0.11]}>
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshBasicMaterial color="#2c1a10" />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.13, 0, 0]} material={skinMaterial}>
          <sphereGeometry args={[0.026, 6, 6]} />
        </mesh>
        <mesh position={[0.13, 0, 0]} material={skinMaterial}>
          <sphereGeometry args={[0.026, 6, 6]} />
        </mesh>
      </group>

      {/* 8. Golden Interaction Halo Ring */}
      {isHighlighted && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.8, 24]} />
          <meshBasicMaterial color="#ffc048" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

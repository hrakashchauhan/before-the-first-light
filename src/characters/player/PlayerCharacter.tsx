import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PlayerCharacterProps {
  position: [number, number, number]
  rotationY: number
  isMoving: boolean
  moveSpeed?: number
}

export function PlayerCharacter({
  position,
  rotationY,
  isMoving,
}: PlayerCharacterProps) {
  const groupRef = useRef<THREE.Group>(null)
  const leftLegRef = useRef<THREE.Group>(null)
  const rightLegRef = useRef<THREE.Group>(null)
  const leftArmRef = useRef<THREE.Group>(null)
  const rightArmRef = useRef<THREE.Group>(null)
  const torsoRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Group>(null)

  // Materials with authentic color tones
  const skinMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#c68642', // Warm South Asian skin tone
      roughness: 0.75,
      metalness: 0.05,
    })
  }, [])

  const hairMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#1a1412',
      roughness: 0.9,
    })
  }, [])

  const eyeWhiteMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#fbfbfb' })
  }, [])

  const irisMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#2c1e18' })
  }, [])

  const eyebrowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#1a1412' })
  }, [])

  const kurtaMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f4ede2', // Clean unbleached cream cotton kurta
      roughness: 0.85,
    })
  }, [])

  const pajamaMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#eae3d5',
      roughness: 0.88,
    })
  }, [])

  const footwearMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#5d4037',
      roughness: 0.8,
    })
  }, [])

  // Procedural Animation Loop (Walk cycle + Idle Breathing)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (isMoving) {
      // Walking locomotion: frequency proportional to speed
      const walkFreq = 9.5
      const swing = Math.sin(t * walkFreq) * 0.55

      if (leftLegRef.current) leftLegRef.current.rotation.x = swing
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing

      // Arm swing in opposite phase to legs
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.75
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.75

      // Slight vertical torso bobbing while walking
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.88 + Math.abs(Math.sin(t * walkFreq)) * 0.04
      }
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(t * walkFreq) * 0.03
      }
    } else {
      // Idle state: gentle rhythmic breathing and weight shift
      const breath = Math.sin(t * 2.2) * 0.02
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1)
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1)
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, breath * 0.5, 0.1)
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, -breath * 0.5, 0.1)

      if (torsoRef.current) {
        torsoRef.current.position.y = 0.88 + breath * 0.3
      }
      if (headRef.current) {
        headRef.current.rotation.x = breath * 0.4
      }
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* ================= Torso & Garment ================= */}
      <group ref={torsoRef} position={[0, 0.88, 0]}>
        {/* Upper Chest & Kurta Body */}
        <mesh position={[0, 0.18, 0]} castShadow receiveShadow material={kurtaMaterial}>
          <boxGeometry args={[0.42, 0.48, 0.22]} />
        </mesh>
        {/* Kurta Lower Flared Hem falling past waist */}
        <mesh position={[0, -0.16, 0]} castShadow receiveShadow material={kurtaMaterial}>
          <boxGeometry args={[0.44, 0.28, 0.24]} />
        </mesh>
        {/* Kurta Mandarin Collar Band */}
        <mesh position={[0, 0.44, 0.02]} material={kurtaMaterial}>
          <cylinderGeometry args={[0.11, 0.12, 0.06, 12]} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.46, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.075, 0.085, 0.12, 10]} />
        </mesh>

        {/* ================= 3D Head & Sculpted Facial Geometry ================= */}
        <group ref={headRef} position={[0, 0.62, 0]}>
          {/* Cranium / Head Form */}
          <mesh castShadow material={skinMaterial}>
            <sphereGeometry args={[0.14, 16, 16]} />
          </mesh>

          {/* Styled Black Hair Volume */}
          <mesh position={[0, 0.04, -0.02]} castShadow material={hairMaterial}>
            <sphereGeometry args={[0.146, 14, 14]} />
          </mesh>
          {/* Front Hair Fringe */}
          <mesh position={[0, 0.1, 0.07]} rotation={[0.2, 0, 0]} material={hairMaterial}>
            <boxGeometry args={[0.19, 0.06, 0.11]} />
          </mesh>

          {/* --- Real 3D Eyes & Eyebrows (Not flat images!) --- */}
          {/* Left Eye */}
          <group position={[-0.048, 0.02, 0.125]}>
            <mesh material={eyeWhiteMaterial}>
              <sphereGeometry args={[0.022, 8, 8]} />
            </mesh>
            <mesh position={[0, 0, 0.016]} material={irisMaterial}>
              <sphereGeometry args={[0.012, 8, 8]} />
            </mesh>
            {/* Left Eyebrow */}
            <mesh position={[0, 0.026, 0.01]} rotation={[0, 0, 0.08]} material={eyebrowMaterial}>
              <boxGeometry args={[0.04, 0.008, 0.01]} />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.048, 0.02, 0.125]}>
            <mesh material={eyeWhiteMaterial}>
              <sphereGeometry args={[0.022, 8, 8]} />
            </mesh>
            <mesh position={[0, 0, 0.016]} material={irisMaterial}>
              <sphereGeometry args={[0.012, 8, 8]} />
            </mesh>
            {/* Right Eyebrow */}
            <mesh position={[0, 0.026, 0.01]} rotation={[0, 0, -0.08]} material={eyebrowMaterial}>
              <boxGeometry args={[0.04, 0.008, 0.01]} />
            </mesh>
          </group>

          {/* 3D Sculpted Nose Bridge and Base */}
          <mesh position={[0, -0.005, 0.142]} rotation={[0.15, 0, 0]} material={skinMaterial}>
            <coneGeometry args={[0.02, 0.045, 4]} />
          </mesh>

          {/* 3D Sculpted Mouth / Lips */}
          <mesh position={[0, -0.05, 0.13]} material={skinMaterial}>
            <boxGeometry args={[0.042, 0.012, 0.014]} />
          </mesh>

          {/* Left & Right 3D Ears */}
          <mesh position={[-0.142, 0, 0]} rotation={[0, -0.2, 0]} material={skinMaterial}>
            <boxGeometry args={[0.018, 0.048, 0.032]} />
          </mesh>
          <mesh position={[0.142, 0, 0]} rotation={[0, 0.2, 0]} material={skinMaterial}>
            <boxGeometry args={[0.018, 0.048, 0.032]} />
          </mesh>
        </group>

        {/* ================= Left & Right Arms ================= */}
        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.26, 0.36, 0]}>
          {/* Shoulder & Sleeve */}
          <mesh position={[0, -0.16, 0]} castShadow material={kurtaMaterial}>
            <cylinderGeometry args={[0.065, 0.06, 0.34, 8]} />
          </mesh>
          {/* Forearm (Skin) */}
          <mesh position={[0, -0.4, 0]} castShadow material={skinMaterial}>
            <cylinderGeometry args={[0.048, 0.042, 0.26, 8]} />
          </mesh>
          {/* Hand with fingers */}
          <mesh position={[0, -0.56, 0]} castShadow material={skinMaterial}>
            <boxGeometry args={[0.055, 0.09, 0.035]} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.26, 0.36, 0]}>
          {/* Shoulder & Sleeve */}
          <mesh position={[0, -0.16, 0]} castShadow material={kurtaMaterial}>
            <cylinderGeometry args={[0.065, 0.06, 0.34, 8]} />
          </mesh>
          {/* Forearm (Skin) */}
          <mesh position={[0, -0.4, 0]} castShadow material={skinMaterial}>
            <cylinderGeometry args={[0.048, 0.042, 0.26, 8]} />
          </mesh>
          {/* Hand with fingers */}
          <mesh position={[0, -0.56, 0]} castShadow material={skinMaterial}>
            <boxGeometry args={[0.055, 0.09, 0.035]} />
          </mesh>
        </group>
      </group>

      {/* ================= Left & Right Legs ================= */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.11, 0.62, 0]}>
        {/* Thigh (Pajama) */}
        <mesh position={[0, -0.22, 0]} castShadow material={pajamaMaterial}>
          <cylinderGeometry args={[0.08, 0.07, 0.38, 8]} />
        </mesh>
        {/* Shin (Pajama) */}
        <mesh position={[0, -0.52, 0]} castShadow material={pajamaMaterial}>
          <cylinderGeometry args={[0.068, 0.06, 0.34, 8]} />
        </mesh>
        {/* Foot / Traditional Sandal */}
        <mesh position={[0, -0.66, 0.05]} castShadow material={footwearMaterial}>
          <boxGeometry args={[0.09, 0.06, 0.2]} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.11, 0.62, 0]}>
        {/* Thigh (Pajama) */}
        <mesh position={[0, -0.22, 0]} castShadow material={pajamaMaterial}>
          <cylinderGeometry args={[0.08, 0.07, 0.38, 8]} />
        </mesh>
        {/* Shin (Pajama) */}
        <mesh position={[0, -0.52, 0]} castShadow material={pajamaMaterial}>
          <cylinderGeometry args={[0.068, 0.06, 0.34, 8]} />
        </mesh>
        {/* Foot / Traditional Sandal */}
        <mesh position={[0, -0.66, 0.05]} castShadow material={footwearMaterial}>
          <boxGeometry args={[0.09, 0.06, 0.2]} />
        </mesh>
      </group>
    </group>
  )
}

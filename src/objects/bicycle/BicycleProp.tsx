import { useMemo } from 'react'
import * as THREE from 'three'
import type { WorldPosition } from '../../systems/interaction/household'

interface BicyclePropProps {
  position: WorldPosition
  rotationY?: number
  steerAngle?: number
  wheelRotation?: number
  pedalRotation?: number
  isParked?: boolean
  isHighlighted?: boolean
}

export function BicycleProp({
  position,
  rotationY = 0,
  steerAngle = 0,
  wheelRotation = 0,
  pedalRotation = 0,
  isParked = true,
  isHighlighted = false,
}: BicyclePropProps) {
  // Shared procedural materials
  const materials = useMemo(() => {
    return {
      frame: new THREE.MeshStandardMaterial({
        color: isHighlighted ? '#e07a38' : '#1e2022',
        roughness: 0.35,
        metalness: 0.7,
      }),
      chrome: new THREE.MeshStandardMaterial({
        color: '#e5e7eb',
        roughness: 0.2,
        metalness: 0.9,
      }),
      tyre: new THREE.MeshStandardMaterial({
        color: '#18181b',
        roughness: 0.85,
        metalness: 0.1,
      }),
      spoke: new THREE.MeshStandardMaterial({
        color: '#d1d5db',
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85,
      }),
      leather: new THREE.MeshStandardMaterial({
        color: '#2d1810',
        roughness: 0.7,
        metalness: 0.1,
      }),
      brass: new THREE.MeshStandardMaterial({
        color: '#d4af37',
        roughness: 0.25,
        metalness: 0.85,
      }),
    }
  }, [isHighlighted])

  const wheelRadius = 0.355
  const wheelbase = 1.08
  const halfWheelbase = wheelbase / 2

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Central Diamond Frame */}
      <group position={[0, wheelRadius + 0.05, 0]}>
        {/* Bottom Bracket / Crank Axle */}
        <mesh material={materials.chrome} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.09, 12]} />
        </mesh>

        {/* Seat Tube (from Bottom Bracket up to Saddle clamp) */}
        <mesh material={materials.frame} position={[-0.1, 0.22, 0]} rotation={[0, 0, -0.32]}>
          <cylinderGeometry args={[0.016, 0.016, 0.48, 8]} />
        </mesh>

        {/* Down Tube (from Bottom Bracket up to Head Tube) */}
        <mesh material={materials.frame} position={[0.22, 0.2, 0]} rotation={[0, 0, 0.88]}>
          <cylinderGeometry args={[0.018, 0.018, 0.58, 8]} />
        </mesh>

        {/* Top Tube (horizontal upper bar) */}
        <mesh material={materials.frame} position={[0.12, 0.42, 0]} rotation={[0, 0, 0.06]}>
          <cylinderGeometry args={[0.016, 0.016, 0.54, 8]} />
        </mesh>

        {/* Chainstays (bottom bracket to rear axle) */}
        <mesh material={materials.frame} position={[-halfWheelbase / 2, -0.02, 0.03]} rotation={[0, 0, -0.04]}>
          <cylinderGeometry args={[0.012, 0.012, halfWheelbase, 8]} />
        </mesh>
        <mesh material={materials.frame} position={[-halfWheelbase / 2, -0.02, -0.03]} rotation={[0, 0, -0.04]}>
          <cylinderGeometry args={[0.012, 0.012, halfWheelbase, 8]} />
        </mesh>

        {/* Seatstays (saddle junction to rear axle) */}
        <mesh material={materials.frame} position={[-0.34, 0.2, 0.035]} rotation={[0, 0, -0.68]}>
          <cylinderGeometry args={[0.011, 0.011, 0.54, 8]} />
        </mesh>
        <mesh material={materials.frame} position={[-0.34, 0.2, -0.035]} rotation={[0, 0, -0.68]}>
          <cylinderGeometry args={[0.011, 0.011, 0.54, 8]} />
        </mesh>

        {/* Head Tube (front vertical tube holding fork) */}
        <mesh material={materials.frame} position={[halfWheelbase - 0.12, 0.44, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.02, 0.02, 0.18, 8]} />
        </mesh>

        {/* Saddle / Seat */}
        <group position={[-0.17, 0.47, 0]}>
          {/* Seatpost */}
          <mesh material={materials.chrome} position={[0, -0.04, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.12, 8]} />
          </mesh>
          {/* Spring & Leather Cushion */}
          <mesh material={materials.leather} position={[-0.02, 0.03, 0]} rotation={[0, 0, 0.05]}>
            <boxGeometry args={[0.22, 0.045, 0.18]} />
          </mesh>
          <mesh material={materials.chrome} position={[-0.08, 0.0, 0.04]}>
            <cylinderGeometry args={[0.01, 0.01, 0.05, 6]} />
          </mesh>
          <mesh material={materials.chrome} position={[-0.08, 0.0, -0.04]}>
            <cylinderGeometry args={[0.01, 0.01, 0.05, 6]} />
          </mesh>
        </group>

        {/* Rear Luggage Carrier (Heavy-duty Indian roadster carrier) */}
        <group position={[-halfWheelbase * 0.72, 0.38, 0]}>
          <mesh material={materials.frame} position={[0, 0, 0]}>
            <boxGeometry args={[0.38, 0.02, 0.14]} />
          </mesh>
          {/* Carrier vertical struts to rear hub */}
          <mesh material={materials.frame} position={[-0.1, -0.19, 0.06]} rotation={[0, 0, -0.28]}>
            <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
          </mesh>
          <mesh material={materials.frame} position={[-0.1, -0.19, -0.06]} rotation={[0, 0, -0.28]}>
            <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
          </mesh>
        </group>

        {/* Crankset & Rotating Pedals */}
        <group position={[0, 0, 0]} rotation={[pedalRotation, 0, 0]}>
          {/* Large Chainring */}
          <mesh material={materials.chrome} position={[0, 0, 0.045]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.008, 16]} />
          </mesh>
          {/* Right Crank Arm & Pedal */}
          <mesh material={materials.chrome} position={[0, 0.075, 0.055]}>
            <boxGeometry args={[0.02, 0.15, 0.01]} />
          </mesh>
          <mesh material={materials.leather} position={[0, 0.14, 0.09]}>
            <boxGeometry args={[0.05, 0.02, 0.08]} />
          </mesh>
          {/* Left Crank Arm & Pedal */}
          <mesh material={materials.chrome} position={[0, -0.075, -0.055]}>
            <boxGeometry args={[0.02, 0.15, 0.01]} />
          </mesh>
          <mesh material={materials.leather} position={[0, -0.14, -0.09]}>
            <boxGeometry args={[0.05, 0.02, 0.08]} />
          </mesh>
        </group>

        {/* Kickstand (Pivots down when parked, up when mounted) */}
        <group position={[-0.08, -0.02, 0]} rotation={[isParked ? -0.35 : -1.45, 0, 0]}>
          <mesh material={materials.frame} position={[0, -0.17, 0.08]} rotation={[0, 0, -0.1]}>
            <cylinderGeometry args={[0.009, 0.009, 0.36, 6]} />
          </mesh>
        </group>

        {/* Rear Mudguard (Fender) */}
        <mesh material={materials.frame} position={[-halfWheelbase * 0.95, 0.14, 0]} rotation={[0, 0, 0.35]}>
          <torusGeometry args={[wheelRadius + 0.025, 0.024, 8, 24, Math.PI * 0.65]} />
        </mesh>
      </group>

      {/* Rear Wheel (Spins around its axle at -halfWheelbase) */}
      <group position={[-halfWheelbase, wheelRadius, 0]}>
        <group rotation={[wheelRotation, 0, 0]}>
          {/* Rubber Tyre */}
          <mesh material={materials.tyre} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[wheelRadius, 0.022, 12, 32]} />
          </mesh>
          {/* Chrome Rim */}
          <mesh material={materials.chrome} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[wheelRadius - 0.02, 0.012, 8, 24]} />
          </mesh>
          {/* Center Hub */}
          <mesh material={materials.chrome} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 12]} />
          </mesh>
          {/* Spokes (8 crossed bars) */}
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((angle, i) => (
            <mesh key={i} material={materials.spoke} rotation={[angle, 0, 0]}>
              <cylinderGeometry args={[0.002, 0.002, wheelRadius * 1.95, 4]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Front Steering Assembly (Fork, Handlebar, Front Wheel, Bell) */}
      <group position={[halfWheelbase, wheelRadius, 0]} rotation={[0, steerAngle, 0]}>
        {/* Front Wheel */}
        <group rotation={[wheelRotation, 0, 0]}>
          {/* Rubber Tyre */}
          <mesh material={materials.tyre} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[wheelRadius, 0.022, 12, 32]} />
          </mesh>
          {/* Chrome Rim */}
          <mesh material={materials.chrome} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[wheelRadius - 0.02, 0.012, 8, 24]} />
          </mesh>
          {/* Center Hub */}
          <mesh material={materials.chrome} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.08, 12]} />
          </mesh>
          {/* Spokes */}
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((angle, i) => (
            <mesh key={i} material={materials.spoke} rotation={[angle, 0, 0]}>
              <cylinderGeometry args={[0.002, 0.002, wheelRadius * 1.95, 4]} />
            </mesh>
          ))}
        </group>

        {/* Front Fork Struts */}
        <mesh material={materials.chrome} position={[0, 0.22, 0.038]} rotation={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.012, 0.012, 0.44, 8]} />
        </mesh>
        <mesh material={materials.chrome} position={[0, 0.22, -0.038]} rotation={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.012, 0.012, 0.44, 8]} />
        </mesh>

        {/* Front Mudguard */}
        <mesh material={materials.frame} position={[0, 0.18, 0]} rotation={[0, 0, -0.45]}>
          <torusGeometry args={[wheelRadius + 0.025, 0.024, 8, 24, Math.PI * 0.52]} />
        </mesh>

        {/* Handlebars (Swept roadster curve) */}
        <group position={[-0.04, 0.54, 0]}>
          {/* Stem */}
          <mesh material={materials.chrome} position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.14, 8]} />
          </mesh>
          {/* Crossbar */}
          <mesh material={materials.chrome} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.013, 0.013, 0.44, 12]} />
          </mesh>
          {/* Left Grip */}
          <mesh material={materials.leather} position={[-0.04, 0, 0.21]} rotation={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.1, 8]} />
          </mesh>
          {/* Right Grip */}
          <mesh material={materials.leather} position={[-0.04, 0, -0.21]} rotation={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.1, 8]} />
          </mesh>

          {/* Polished Brass Bell (Left Handlebar) */}
          <mesh material={materials.brass} position={[-0.01, 0.035, 0.14]}>
            <sphereGeometry args={[0.028, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

import { useMemo } from 'react'
import * as THREE from 'three'

interface BroomPropProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  isHighlighted?: boolean
}

export function BroomProp({
  position = [-3.1, 0, -2.5],
  rotation = [0.15, 0.2, -0.25],
  isHighlighted = false,
}: BroomPropProps) {
  const broomStrawMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isHighlighted ? '#f6e58d' : '#d2b48c',
      roughness: 0.9,
      emissive: isHighlighted ? new THREE.Color('#f9ca24') : new THREE.Color('#000000'),
      emissiveIntensity: isHighlighted ? 0.35 : 0,
    })
  }, [isHighlighted])

  const bindingTwineMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#e74c3c',
      roughness: 0.7,
    })
  }, [])

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Upper bound handle section of broom */}
      <mesh position={[0, 0.75, 0]} castShadow material={broomStrawMaterial}>
        <cylinderGeometry args={[0.035, 0.045, 0.6, 8]} />
      </mesh>

      {/* 2. Red Twine Binding Rings */}
      {[0.55, 0.7, 0.85].map((y, idx) => (
        <mesh key={`twine-${idx}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={bindingTwineMaterial}>
          <torusGeometry args={[0.042, 0.01, 6, 12]} />
        </mesh>
      ))}

      {/* 3. Lower Flared Grass Bristles touching ground */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow material={broomStrawMaterial}>
        <coneGeometry args={[0.13, 0.5, 10]} />
      </mesh>
    </group>
  )
}

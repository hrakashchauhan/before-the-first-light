import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GAME_CONFIG } from '../config'

interface CameraControllerProps {
  targetPosition: [number, number, number]
  zoomDistance: number
  onZoomChange?: (newDistance: number) => void
}

export function CameraController({
  targetPosition,
  zoomDistance,
  onZoomChange,
}: CameraControllerProps) {
  const { camera, gl } = useThree()
  const currentTarget = useRef(new THREE.Vector3(...targetPosition))

  // Attach mouse wheel zoom listener to canvas element
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : -0.9
      const newDist = THREE.MathUtils.clamp(
        zoomDistance + delta,
        GAME_CONFIG.camera.minDistance,
        GAME_CONFIG.camera.maxDistance
      )
      onZoomChange?.(newDist)
    }

    const dom = gl.domElement
    dom.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      dom.removeEventListener('wheel', handleWheel)
    }
  }, [zoomDistance, onZoomChange, gl.domElement])

  // Attach keyboard zoom shortcuts (+, -, 0)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === '+' || e.key === '=') {
        const newDist = Math.max(GAME_CONFIG.camera.minDistance, zoomDistance - 1.2)
        onZoomChange?.(newDist)
      } else if (e.key === '-' || e.key === '_') {
        const newDist = Math.min(GAME_CONFIG.camera.maxDistance, zoomDistance + 1.2)
        onZoomChange?.(newDist)
      } else if (e.key === '0') {
        onZoomChange?.(GAME_CONFIG.camera.defaultDistance)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [zoomDistance, onZoomChange])

  useFrame((_, delta) => {
    // 1. Smoothly interpolate target look-at point toward player
    const desiredTarget = new THREE.Vector3(targetPosition[0], targetPosition[1] + 0.9, targetPosition[2])
    currentTarget.current.lerp(desiredTarget, delta * 5.0)

    // 2. Calculate desired camera offset in isometric direction based on zoomDistance
    const angle = GAME_CONFIG.camera.defaultAngle
    const ratio = zoomDistance / GAME_CONFIG.camera.defaultDistance
    const elevation = GAME_CONFIG.camera.defaultElevation * (ratio * 0.85 + 0.15)
    const horizontalDistance = Math.sqrt(Math.max(0, zoomDistance * zoomDistance - elevation * elevation))

    const desiredCamPos = new THREE.Vector3(
      currentTarget.current.x + Math.cos(angle) * horizontalDistance,
      currentTarget.current.y + elevation,
      currentTarget.current.z + Math.sin(angle) * horizontalDistance
    )

    // 3. Smoothly lerp camera position
    camera.position.lerp(desiredCamPos, delta * 4.5)
    camera.lookAt(currentTarget.current)
  })

  return null
}

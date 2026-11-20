import { useEffect, useRef, useState } from 'react'

interface MovementState {
  position: [number, number, number]
  rotationY: number
  isMoving: boolean
}

// Spatial Obstacle Boundaries (AABB and circles in XZ space)
interface ObstacleBox {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

const OBSTACLES: ObstacleBox[] = [
  // 1. House Front Mud Wall & Door
  { minX: -4.3, maxX: 4.3, minZ: -4.2, maxZ: -1.75 },
  // 2. Sunny Wall (Left boundary where goitha cakes dry)
  { minX: -5.7, maxX: -4.8, minZ: -0.2, maxZ: 5.6 },
  // 3. Right Perimeter Mud Wall
  { minX: 5.8, maxX: 6.6, minZ: -4.0, maxZ: 6.2 },
  // 4. Front Courtyard Wall
  { minX: -5.5, maxX: 3.8, minZ: 6.0, maxZ: 6.8 },
  // 5. Village Handpump
  { minX: 3.6, maxX: 5.6, minZ: 2.2, maxZ: 4.2 },
  // 6. Wooden Charpai
  { minX: -4.2, maxX: -2.2, minZ: 2.7, maxZ: 4.1 },
]

function isColliding(x: number, z: number, radius = 0.35): boolean {
  // Courtyard overall navigable bounds
  if (x < -4.9 || x > 5.5 || z < -1.7 || z > 5.8) {
    return true
  }

  for (const obs of OBSTACLES) {
    if (
      x + radius > obs.minX &&
      x - radius < obs.maxX &&
      z + radius > obs.minZ &&
      z - radius < obs.maxZ
    ) {
      return true
    }
  }
  return false
}

export function usePlayerMovement(initialPos: [number, number, number] = [0, 0, 1.8]) {
  const [movement, setMovement] = useState<MovementState>({
    position: initialPos,
    rotationY: 0,
    isMoving: false,
  })

  const keysDown = useRef<Record<string, boolean>>({})
  const posRef = useRef<[number, number, number]>(initialPos)
  const rotRef = useRef<number>(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      keysDown.current[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.key.toLowerCase()] = false
    }

    const handleBlur = () => {
      keysDown.current = {}
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  useEffect(() => {
    let animId: number
    let lastTime = performance.now()

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const keys = keysDown.current
      let dx = 0
      let dz = 0

      // WASD and Arrow key mappings
      if (keys['w'] || keys['arrowup']) dz -= 1
      if (keys['s'] || keys['arrowdown']) dz += 1
      if (keys['a'] || keys['arrowleft']) dx -= 1
      if (keys['d'] || keys['arrowright']) dx += 1

      const hasInput = dx !== 0 || dz !== 0

      if (hasInput) {
        // Normalize diagonal speed
        const length = Math.hypot(dx, dz)
        const moveSpeed = 3.6
        const speed = (moveSpeed * dt) / length

        // Convert input to isometric camera perspective (45-degree angle)
        const cosAngle = Math.cos(Math.PI / 4)
        const sinAngle = Math.sin(Math.PI / 4)

        const worldDx = (dx * cosAngle + dz * sinAngle) * speed
        const worldDz = (-dx * sinAngle + dz * cosAngle) * speed

        const [currX, currY, currZ] = posRef.current
        const nextX = currX + worldDx
        const nextZ = currZ + worldDz

        // Sliding collision checks along X and Z independently
        let finalX = currX
        let finalZ = currZ

        if (!isColliding(nextX, currZ)) {
          finalX = nextX
        }
        if (!isColliding(finalX, nextZ)) {
          finalZ = nextZ
        }

        posRef.current = [finalX, currY, finalZ]

        // Smoothly rotate character toward movement heading
        const targetAngle = Math.atan2(worldDx, worldDz)
        let diff = targetAngle - rotRef.current
        while (diff < -Math.PI) diff += Math.PI * 2
        while (diff > Math.PI) diff -= Math.PI * 2
        rotRef.current += diff * Math.min(1.0, dt * 14)

        setMovement({
          position: [finalX, currY, finalZ],
          rotationY: rotRef.current,
          isMoving: true,
        })
      } else {
        setMovement((prev) => (prev.isMoving ? { ...prev, isMoving: false } : prev))
      }

      animId = requestAnimationFrame(step)
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [])

  return movement
}

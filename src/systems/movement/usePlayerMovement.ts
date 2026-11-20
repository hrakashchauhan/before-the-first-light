import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { GAME_CONFIG } from '../../game/config'
import { COURTYARD_ANCHORS, PLAYER_START, type WorldPosition } from '../interaction/household'
import { isGameplayKey } from '../interaction/gameInput'
import { useGameStore } from '../quests/gameStore'
import { stepPosition } from './navigation'

type Direction = 'w' | 'a' | 's' | 'd'
const directions: Record<string, Direction> = { w: 'w', a: 'a', s: 's', d: 'd', arrowup: 'w', arrowleft: 'a', arrowdown: 's', arrowright: 'd' }

interface Motion {
  position: WorldPosition
  rotationY: number
  isMoving: boolean
}

export function usePlayerMovement(initialPos: WorldPosition = PLAYER_START, blocked = false) {
  const [movement, setMovement] = useState<Motion>({ position: initialPos, rotationY: 0.24, isMoving: false })
  const motion = useRef(movement)
  const pressed = useRef(new Set<string>())
  const blockedRef = useRef(blocked)
  useLayoutEffect(() => {
    blockedRef.current = blocked
    if (blocked) pressed.current.clear()
  }, [blocked])

  const setDirectionHeld = useCallback((direction: Direction, held: boolean) => {
    const key = `touch-${direction}`
    if (held && !blockedRef.current) pressed.current.add(key)
    else pressed.current.delete(key)
  }, [])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (!Object.hasOwn(directions, key) || blockedRef.current || !isGameplayKey(event)) return
      event.preventDefault()
      pressed.current.add(key)
    }
    const up = (event: KeyboardEvent) => { pressed.current.delete(event.key.toLowerCase()) }
    const clear = () => { pressed.current.clear() }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    document.addEventListener('visibilitychange', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', clear)
    }
  }, [])

  const step = useCallback((dt: number) => {
    const old = motion.current
    const keys = pressed.current
    const { dialogueTargetId, isDebugOpen } = useGameStore.getState()
    if (blockedRef.current || dialogueTargetId || isDebugOpen) keys.clear()
    const held = (direction: Direction, arrow: string) => Number(keys.has(direction) || keys.has(arrow) || keys.has(`touch-${direction}`))
    const dx = held('d', 'arrowright') - held('a', 'arrowleft')
    const dz = held('s', 'arrowdown') - held('w', 'arrowup')
    const position = stepPosition(old.position, dx, dz, dt)
    const isMoving = position !== old.position
    const look = dialogueTargetId ? COURTYARD_ANCHORS[dialogueTargetId] : position
    const lx = look[0] - old.position[0], lz = look[2] - old.position[2]
    let rotationY = old.rotationY
    if ((isMoving || dialogueTargetId) && Math.hypot(lx, lz) > 0.0001) {
      const diff = Math.atan2(lx, lz) - old.rotationY
      const angle = Math.atan2(Math.sin(diff), Math.cos(diff))
      if (Math.abs(angle) > 0.001) rotationY += angle * (1 - Math.exp(-GAME_CONFIG.player.turnSpeed * dt))
    }
    if (isMoving || old.isMoving || rotationY !== old.rotationY) {
      motion.current = { position, rotationY, isMoving }
      setMovement(motion.current)
    }
  }, [])
  return { ...movement, step, setDirectionHeld }
}

export function MovementClock({ step }: { step: (delta: number) => void }) {
  useFrame((_, dt) => step(dt), -2)
  return null
}

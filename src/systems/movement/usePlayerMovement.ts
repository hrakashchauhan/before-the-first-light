import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { GAME_CONFIG } from '../../game/config'
import { COURTYARD_ANCHORS, PLAYER_START, type WorldPosition } from '../interaction/household'
import { isGameplayKey } from '../interaction/gameInput'
import { useGameStore } from '../quests/gameStore'
import { stepPosition } from './navigation'
import {
  createInitialBicycleState,
  stepBicyclePhysics,
  isSafeToDismount,
  type BicycleState,
} from './bicycleController'
import { audioManager } from '../../audio/AudioManager'

type Direction = 'w' | 'a' | 's' | 'd'
const directions: Record<string, Direction> = {
  w: 'w',
  a: 'a',
  s: 's',
  d: 'd',
  arrowup: 'w',
  arrowleft: 'a',
  arrowdown: 's',
  arrowright: 'd',
}

interface Motion {
  position: WorldPosition
  rotationY: number
  isMoving: boolean
  isMounted: boolean
  bicycleState: BicycleState
}

export function usePlayerMovement(initialPos: WorldPosition = PLAYER_START, blocked = false) {
  const store = useGameStore()
  const initialBicycle = createInitialBicycleState(store.bicyclePosition)

  const [movement, setMovement] = useState<Motion>({
    position: initialPos,
    rotationY: 0.24,
    isMoving: false,
    isMounted: false,
    bicycleState: initialBicycle,
  })

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

  const teleport = useCallback((position: WorldPosition) => {
    const next: Motion = {
      position,
      rotationY: 0.24,
      isMoving: false,
      isMounted: false,
      bicycleState: createInitialBicycleState(store.bicyclePosition),
    }
    motion.current = next
    pressed.current.clear()
    setMovement(next)
  }, [store.bicyclePosition])

  const mountBicycle = useCallback(() => {
    const current = motion.current
    if (current.isMounted) return

    const distToBike = Math.hypot(
      current.position[0] - current.bicycleState.position[0],
      current.position[2] - current.bicycleState.position[2]
    )

    if (distToBike > 2.5) {
      return
    }

    const nextBike = { ...current.bicycleState, isParked: false }
    const nextMotion: Motion = {
      position: [...nextBike.position] as WorldPosition,
      rotationY: nextBike.rotationY,
      isMoving: false,
      isMounted: true,
      bicycleState: nextBike,
    }
    motion.current = nextMotion
    store.setLocomotionMode('riding')
    setMovement(nextMotion)
  }, [store])

  const dismountBicycle = useCallback(() => {
    const current = motion.current
    if (!current.isMounted) return

    if (!isSafeToDismount(current.bicycleState.speed)) {
      store.setWarningText(
        store.language === 'hi' ? 'उतरने से पहले साइकिल रोकें (Space)' : 'Slow down to stop before dismounting (Space)'
      )
      return
    }

    const parkedBike: BicycleState = {
      ...current.bicycleState,
      speed: 0,
      isParked: true,
      warningText: null,
    }

    // Dismount to the left of the bicycle
    const dismountX = parkedBike.position[0] - Math.cos(parkedBike.rotationY) * 0.55
    const dismountZ = parkedBike.position[2] + Math.sin(parkedBike.rotationY) * 0.55

    const nextMotion: Motion = {
      position: [dismountX, 0, dismountZ],
      rotationY: parkedBike.rotationY,
      isMoving: false,
      isMounted: false,
      bicycleState: parkedBike,
    }

    motion.current = nextMotion
    store.setLocomotionMode('walking')
    store.setBicycleTransform(parkedBike.position, parkedBike.rotationY, 0)
    setMovement(nextMotion)
  }, [store])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (blockedRef.current || !isGameplayKey(event)) return

      // Handle Mount / Dismount toggle on 'e'
      if (key === 'e' && !event.repeat) {
        if (motion.current.isMounted) {
          event.preventDefault()
          dismountBicycle()
          return
        } else {
          const distToBike = Math.hypot(
            motion.current.position[0] - motion.current.bicycleState.position[0],
            motion.current.position[2] - motion.current.bicycleState.position[2]
          )
          if (distToBike <= 2.3) {
            event.preventDefault()
            mountBicycle()
            return
          }
        }
      }

      // Handle bicycle bell on 'b'
      if (key === 'b' && motion.current.isMounted && !event.repeat) {
        event.preventDefault()
        audioManager.playBicycleBell()
        return
      }

      if (key === ' ' || Object.hasOwn(directions, key)) {
        event.preventDefault()
        pressed.current.add(key)
      }
    }

    const up = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      pressed.current.delete(key)
    }

    const clear = () => {
      pressed.current.clear()
    }

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
  }, [mountBicycle, dismountBicycle])

  const step = useCallback(
    (dt: number) => {
      const old = motion.current
      const keys = pressed.current
      const { dialogueTargetId, isDebugOpen, language } = useGameStore.getState()

      if (blockedRef.current || dialogueTargetId || isDebugOpen) {
        keys.clear()
      }

      // 1. RIDING MODE PHYSICS
      if (old.isMounted) {
        const bikeInput = {
          forward: keys.has('w') || keys.has('arrowup') || keys.has('touch-w'),
          backward: keys.has('s') || keys.has('arrowdown') || keys.has('touch-s'),
          left: keys.has('a') || keys.has('arrowleft') || keys.has('touch-a'),
          right: keys.has('d') || keys.has('arrowright') || keys.has('touch-d'),
          brake: keys.has(' ') || keys.has('space'),
          bell: false,
        }

        const nextBike = stepBicyclePhysics(old.bicycleState, bikeInput, dt, language)
        const isMoving = Math.abs(nextBike.speed) > 0.05
        const nextPos: WorldPosition = [nextBike.position[0], nextBike.position[1], nextBike.position[2]]

        motion.current = {
          position: nextPos,
          rotationY: nextBike.rotationY,
          isMoving,
          isMounted: true,
          bicycleState: nextBike,
        }

        if (nextBike.warningText) {
          useGameStore.getState().setWarningText(nextBike.warningText)
        }

        setMovement(motion.current)
        return
      }

      // 2. WALKING MODE PHYSICS
      const held = (direction: Direction, arrow: string) =>
        Number(keys.has(direction) || keys.has(arrow) || keys.has(`touch-${direction}`))
      const dx = held('d', 'arrowright') - held('a', 'arrowleft')
      const dz = held('s', 'arrowdown') - held('w', 'arrowup')

      const position = stepPosition(old.position, dx, dz, dt)
      const isMoving = position !== old.position

      const look = dialogueTargetId ? COURTYARD_ANCHORS[dialogueTargetId] : position
      const lx = look[0] - old.position[0]
      const lz = look[2] - old.position[2]
      let rotationY = old.rotationY

      if ((isMoving || dialogueTargetId) && Math.hypot(lx, lz) > 0.0001) {
        const diff = Math.atan2(lx, lz) - old.rotationY
        const angle = Math.atan2(Math.sin(diff), Math.cos(diff))
        if (Math.abs(angle) > 0.001) {
          rotationY += angle * (1 - Math.exp(-GAME_CONFIG.player.turnSpeed * dt))
        }
      }

      if (isMoving || old.isMoving || rotationY !== old.rotationY) {
        motion.current = {
          ...old,
          position,
          rotationY,
          isMoving,
        }
        setMovement(motion.current)
      }
    },
    []
  )

  return {
    ...movement,
    step,
    setDirectionHeld,
    teleport,
    mountBicycle,
    dismountBicycle,
  }
}

export function MovementClock({ step }: { step: (delta: number) => void }) {
  useFrame((_, dt) => step(dt), -2)
  return null
}

import type { WorldPosition } from '../interaction/household'
import { canBicycleMoveTo } from './roadZones'
import { audioManager } from '../../audio/AudioManager'

export interface BicycleState {
  position: WorldPosition
  rotationY: number
  speed: number
  steerAngle: number
  wheelRotation: number
  pedalRotation: number
  isBraking: boolean
  isParked: boolean
  warningText: string | null
}

export interface BicycleInput {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  brake: boolean
  bell: boolean
}

export const INITIAL_BICYCLE_POSITION: WorldPosition = [5.2, 0, 3.8]

const MAX_SPEED = 5.8
const MAX_REVERSE = 1.2
const ACCELERATION = 3.2
const BRAKE_DECEL = 7.8
const FRICTION = 1.4
const TURN_RATE = 2.4
const SAFE_DISMOUNT_SPEED = 0.55
const WHEEL_RADIUS = 0.355

export function createInitialBicycleState(pos: WorldPosition = INITIAL_BICYCLE_POSITION): BicycleState {
  return {
    position: [...pos] as WorldPosition,
    rotationY: 0,
    speed: 0,
    steerAngle: 0,
    wheelRotation: 0,
    pedalRotation: 0,
    isBraking: false,
    isParked: true,
    warningText: null,
  }
}

export function stepBicyclePhysics(
  current: BicycleState,
  input: BicycleInput,
  dt: number,
  language: 'en' | 'hi' = 'en'
): BicycleState {
  const clampedDt = Math.min(dt, 0.08)
  let speed = current.speed
  let rotationY = current.rotationY
  let steerAngle = 0
  let isBraking = false
  let warningText: string | null = null

  if (input.bell) {
    audioManager.playBicycleBell()
  }

  // Acceleration & Braking
  if (input.brake) {
    isBraking = true
    if (Math.abs(speed) > 2.0) {
      audioManager.playBrakeSqueal()
    }
    if (speed > 0) {
      speed = Math.max(0, speed - BRAKE_DECEL * clampedDt)
    } else if (speed < 0) {
      speed = Math.min(0, speed + BRAKE_DECEL * clampedDt)
    }
  } else if (input.forward) {
    if (speed < 0) {
      speed += BRAKE_DECEL * clampedDt
    } else {
      speed = Math.min(MAX_SPEED, speed + ACCELERATION * clampedDt)
    }
  } else if (input.backward) {
    if (speed > 0.2) {
      isBraking = true
      speed = Math.max(0, speed - BRAKE_DECEL * clampedDt)
    } else {
      speed = Math.max(-MAX_REVERSE, speed - ACCELERATION * 0.6 * clampedDt)
    }
  } else {
    // Natural friction decay
    if (speed > 0) {
      speed = Math.max(0, speed - FRICTION * clampedDt)
    } else if (speed < 0) {
      speed = Math.min(0, speed + FRICTION * clampedDt)
    }
  }

  // Steering
  if (input.left) {
    steerAngle = 0.38
    if (Math.abs(speed) > 0.05) {
      rotationY += TURN_RATE * clampedDt * (speed >= 0 ? 1 : -1)
    }
  } else if (input.right) {
    steerAngle = -0.38
    if (Math.abs(speed) > 0.05) {
      rotationY -= TURN_RATE * clampedDt * (speed >= 0 ? 1 : -1)
    }
  }

  // Velocity projection along forward heading
  // Note: Three.js coordinates: +Z forward or -Z depending on facing;
  // In our coordinate space: dx = sin(yaw) * speed * dt, dz = cos(yaw) * speed * dt
  const dist = speed * clampedDt
  const nextX = current.position[0] + Math.sin(rotationY) * dist
  const nextZ = current.position[2] + Math.cos(rotationY) * dist

  // Check road zones & collision restrictions
  const check = canBicycleMoveTo(nextX, nextZ)
  let finalPos: WorldPosition = [current.position[0], current.position[1], current.position[2]]

  if (check.allowed) {
    finalPos = [nextX, 0, nextZ]
  } else {
    // Bounce or halt at boundary
    speed = 0
    warningText = language === 'hi' ? check.warningHi ?? null : check.warningEn ?? null
  }

  // Wheel and pedal rotation
  const wheelIncrement = dist / WHEEL_RADIUS
  const wheelRotation = current.wheelRotation + wheelIncrement
  const pedalRotation = current.pedalRotation + wheelIncrement * 1.4

  // Audio click on pedal pass
  if (Math.abs(speed) > 0.8 && Math.floor(pedalRotation / Math.PI) !== Math.floor(current.pedalRotation / Math.PI)) {
    audioManager.playPedalClick()
  }

  return {
    position: finalPos,
    rotationY,
    speed,
    steerAngle,
    wheelRotation,
    pedalRotation,
    isBraking,
    isParked: false,
    warningText,
  }
}

export function isSafeToDismount(speed: number): boolean {
  return Math.abs(speed) <= SAFE_DISMOUNT_SPEED
}

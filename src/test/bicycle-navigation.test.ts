import { describe, it, expect } from 'vitest'
import {
  createInitialBicycleState,
  stepBicyclePhysics,
  isSafeToDismount,
} from '../systems/movement/bicycleController'
import { canBicycleMoveTo, getNavZone } from '../systems/movement/roadZones'

describe('Bicycle Locomotion & Road Navigation Test Suite', () => {
  it('initializes bicycle in parked state with zero velocity', () => {
    const state = createInitialBicycleState([5.2, 0, 3.8])
    expect(state.isParked).toBe(true)
    expect(state.speed).toBe(0)
    expect(state.steerAngle).toBe(0)
    expect(state.position).toEqual([5.2, 0, 3.8])
  })

  it('accelerates forward along heading when W/forward input is applied', () => {
    const initial = createInitialBicycleState([8.0, 0, 3.0])
    const input = { forward: true, backward: false, left: false, right: false, brake: false, bell: false }
    const updated = stepBicyclePhysics(initial, input, 0.1)

    expect(updated.speed).toBeGreaterThan(0)
    expect(updated.position[2]).toBeGreaterThan(3.0) // Z increases with heading
    expect(updated.isParked).toBe(false)
  })

  it('brakes and decelerates quickly when brake input is applied', () => {
    const moving = {
      ...createInitialBicycleState([8.0, 0, 3.0]),
      speed: 4.5,
      isParked: false,
    }
    const input = { forward: false, backward: false, left: false, right: false, brake: true, bell: false }
    const updated = stepBicyclePhysics(moving, input, 0.1)

    expect(updated.speed).toBeLessThan(4.5)
    expect(updated.isBraking).toBe(true)
  })

  it('steers heading left and right properly', () => {
    const moving = {
      ...createInitialBicycleState([8.0, 0, 3.0]),
      speed: 3.0,
      rotationY: 0,
      isParked: false,
    }
    const steerLeft = { forward: true, backward: false, left: true, right: false, brake: false, bell: false }
    const leftTurn = stepBicyclePhysics(moving, steerLeft, 0.1)
    expect(leftTurn.rotationY).toBeGreaterThan(0)
    expect(leftTurn.steerAngle).toBeGreaterThan(0)

    const steerRight = { forward: true, backward: false, left: false, right: true, brake: false, bell: false }
    const rightTurn = stepBicyclePhysics(moving, steerRight, 0.1)
    expect(rightTurn.rotationY).toBeLessThan(0)
    expect(rightTurn.steerAngle).toBeLessThan(0)
  })

  it('allows bicycle navigation on village lane', () => {
    // Village lane: X: 4.8 to 18.2, Z: 2.0 to 5.8
    const checkLane = canBicycleMoveTo(10.0, 3.5)
    expect(checkLane.allowed).toBe(true)

    const zone = getNavZone(10.0, 3.5)
    expect(zone.type).toBe('bicycle-road')
    expect(zone.bicyclePermitted).toBe(true)
  })

  it('restricts bicycle from entering the pedestrian courtyard', () => {
    // Courtyard: X: -4.94 to 4.8, Z: -2.86 to 5.93
    const checkCourtyard = canBicycleMoveTo(0.0, 1.0)
    expect(checkCourtyard.allowed).toBe(false)
    expect(checkCourtyard.warningEn).toContain('Pedestrian only')

    const zone = getNavZone(0.0, 1.0)
    expect(zone.type).toBe('pedestrian-only')
    expect(zone.bicyclePermitted).toBe(false)
  })

  it('restricts bicycle from entering the pond water or ritual ghat steps', () => {
    // Pond water: X > 21.5
    const checkWater = canBicycleMoveTo(22.5, 3.0)
    expect(checkWater.allowed).toBe(false)

    // Ghat steps: X: 18.1 to 21.5
    const checkGhat = canBicycleMoveTo(19.5, 3.0)
    expect(checkGhat.allowed).toBe(false)
    expect(checkGhat.warningEn).toContain('Ritual space')
  })

  it('stops and warns when bicycle attempts to ride into restricted zone', () => {
    // Moving from lane boundary X: 5.0 towards courtyard X: 4.5
    const atBoundary = {
      ...createInitialBicycleState([4.9, 0, 3.5]),
      speed: 3.0,
      rotationY: -Math.PI / 2, // Heading towards -X (courtyard)
      isParked: false,
    }
    const forward = { forward: true, backward: false, left: false, right: false, brake: false, bell: false }
    const stopped = stepBicyclePhysics(atBoundary, forward, 0.1)

    expect(stopped.speed).toBe(0)
    expect(stopped.warningText).toContain('Pedestrian only')
  })

  it('validates safe dismount speed threshold (<0.55 m/s)', () => {
    expect(isSafeToDismount(0.2)).toBe(true)
    expect(isSafeToDismount(0.0)).toBe(true)
    expect(isSafeToDismount(1.5)).toBe(false)
    expect(isSafeToDismount(4.0)).toBe(false)
  })
})

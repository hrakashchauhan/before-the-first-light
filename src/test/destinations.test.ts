import { describe, it, expect, vi } from 'vitest'
import {
  CANONICAL_DESTINATIONS,
  resolveDestinations,
  notifyDestinationArrival,
} from '../systems/destinations/destinationManager'
import { eventBus } from '../systems/events/eventBus'

describe('Destination Progression & State Machine', () => {
  it('initializes canonical destinations with valid bilingual metadata and positions', () => {
    expect(CANONICAL_DESTINATIONS.length).toBeGreaterThanOrEqual(8)
    for (const dest of CANONICAL_DESTINATIONS) {
      expect(dest.id).toBeTruthy()
      expect(dest.titleEn).toBeTruthy()
      expect(dest.titleHi).toBeTruthy()
      expect(dest.dayEn).toBeTruthy()
      expect(dest.dayHi).toBeTruthy()
      expect(dest.position.length).toBe(3)
    }
  })

  it('resolves correct initial state: home active, next available, subsequent locked', () => {
    const flags: Record<string, boolean> = {}
    const destinations = resolveDestinations(flags, 'q_arrival_talk', 'hub_home')

    const home = destinations.find((d) => d.id === 'hub_home')!
    const courtyard = destinations.find((d) => d.id === 'hub_courtyard')!
    const lane = destinations.find((d) => d.id === 'hub_artisan')!

    expect(home.state).toBe('active')
    expect(home.canTravel).toBe(true)
    expect(courtyard.canTravel).toBe(true)
    expect(courtyard.state).toBe('available')
    expect(lane.state).toBe('locked')
    expect(lane.canTravel).toBe(false)
  })

  it('advances states monotonically through completed and unlocked as flags are set', () => {
    const flags: Record<string, boolean> = {
      courtyard_cleaned: true,
      wheat_sorted: true,
    }
    const destinations = resolveDestinations(flags, 'q_bamboo_visit')

    const courtyard = destinations.find((d) => d.id === 'hub_courtyard')!
    const wheat = destinations.find((d) => d.id === 'hub_wheat_mat')!
    const artisan = destinations.find((d) => d.id === 'hub_artisan')!

    expect(courtyard.state).toBe('completed')
    expect(wheat.state).toBe('completed')
    expect(artisan.state).toBe('active')
    expect(artisan.canTravel).toBe(true)
  })

  it('marks previously completed destinations as revisited when player is currently there', () => {
    const flags: Record<string, boolean> = {
      courtyard_cleaned: true,
      wheat_sorted: true,
      bamboo_collected: true,
    }
    // Player has revisited hub_courtyard
    const destinations = resolveDestinations(flags, 'q_ghat_clean', 'hub_courtyard')
    const courtyard = destinations.find((d) => d.id === 'hub_courtyard')!

    expect(courtyard.state).toBe('revisited')
    expect(courtyard.isCurrent).toBe(true)
  })

  it('emits journey:destination-arrived event upon calling notifyDestinationArrival', () => {
    const listener = vi.fn()
    const unsubscribe = eventBus.on('journey:destination-arrived', listener)

    notifyDestinationArrival('hub_artisan', 'hub_courtyard')

    expect(listener).toHaveBeenCalledWith({
      destinationId: 'hub_artisan',
      previousDestinationId: 'hub_courtyard',
    })

    unsubscribe()
  })
})

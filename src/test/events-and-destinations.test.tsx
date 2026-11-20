import { describe, it, expect, vi, beforeEach } from 'vitest';
import { eventBus } from '../systems/events/eventBus';
import { resolveDestinations, CANONICAL_DESTINATIONS } from '../systems/destinations/destinationManager';
import { useGameStore } from '../systems/quests/gameStore';

describe('Typed Event Bus & Destination Progression', () => {
  beforeEach(() => {
    eventBus.clear();
    useGameStore.getState().resetGame();
  });

  it('subscribes, receives typed payloads, and unsubscribes cleanly', () => {
    const handler = vi.fn();
    const unsubscribe = eventBus.on('journey:destination-arrived', handler);

    eventBus.emit('journey:destination-arrived', {
      destinationId: 'hub_home',
      previousDestinationId: null,
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      destinationId: 'hub_home',
      previousDestinationId: null,
    });

    unsubscribe();
    eventBus.emit('journey:destination-arrived', {
      destinationId: 'hub_courtyard',
      previousDestinationId: 'hub_home',
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('resolves initial destination states correctly for a fresh save', () => {
    const freshFlags = {
      courtyard_cleaned: false,
      talked_to_mother: false,
      wheat_sorted: false,
      bamboo_collected: false,
      ghat_prepared: false,
      dawn_witnessed: false,
      homecoming_shared: false,
      prasad_shared: false,
    };

    const stops = resolveDestinations(freshFlags, 'q_arrival_talk');
    expect(stops).toHaveLength(CANONICAL_DESTINATIONS.length);

    // First stop is active
    expect(stops[0].id).toBe('hub_home');
    expect(stops[0].state).toBe('active');
    expect(stops[0].canTravel).toBe(true);

    // Later stops are locked
    const laneStop = stops.find((s) => s.id === 'hub_artisan');
    expect(laneStop).toBeDefined();
    expect(laneStop?.state).toBe('locked');
    expect(laneStop?.canTravel).toBe(false);
  });

  it('transitions destination states to completed/revisited as player advances', () => {
    const midFlags = {
      talked_to_mother: true,
      courtyard_cleaned: true,
      wheat_sorted: true,
      bamboo_collected: false,
      ghat_prepared: false,
      dawn_witnessed: false,
      homecoming_shared: false,
      prasad_shared: false,
    };

    const stops = resolveDestinations(midFlags, 'q_bamboo_visit');
    const home = stops.find((s) => s.id === 'hub_home');
    const courtyard = stops.find((s) => s.id === 'hub_courtyard');
    const artisan = stops.find((s) => s.id === 'hub_artisan');

    expect(home?.canTravel).toBe(true);
    expect(courtyard?.state).toBe('completed');
    expect(artisan?.state).toBe('active');
    expect(artisan?.canTravel).toBe(true);
  });

  it('emits events through useGameStore interactions', () => {
    const flagSpy = vi.fn();
    const questSpy = vi.fn();
    eventBus.on('world:flag-changed', flagSpy);
    eventBus.on('quest:completed', questSpy);

    const store = useGameStore.getState();
    store.interactWithTarget('npc_mother');

    expect(flagSpy).toHaveBeenCalledWith({ flagId: 'talked_to_mother', value: true });
    expect(questSpy).toHaveBeenCalledWith({ questId: 'q_arrival_talk' });
  });

  it('updates current destination in store and dispatches event', () => {
    const arrivalSpy = vi.fn();
    eventBus.on('journey:destination-arrived', arrivalSpy);

    const store = useGameStore.getState();
    store.setCurrentDestination('hub_courtyard');

    expect(useGameStore.getState().currentDestinationId).toBe('hub_courtyard');
    expect(arrivalSpy).toHaveBeenCalledWith({
      destinationId: 'hub_courtyard',
      previousDestinationId: 'hub_home',
    });
  });
});

import { describe, it, expect } from 'vitest'
import { GAME_CONFIG } from '../game/config'
import { useGameStore } from '../systems/quests/gameStore'
import { canStandAt } from '../systems/movement/navigation'
import { nearestInteraction } from '../systems/interaction/useInteractionTargets'

describe('Village Expansion & Ghat Systems (Milestone M08)', () => {
  it('opens the lane beside the pump while blocking the mud wall and workshop interior', () => {
    expect(canStandAt(6.2, 4.5)).toBe(true)
    expect(canStandAt(6.2, 2.3)).toBe(false)
    expect(canStandAt(12.5, 6.8)).toBe(false)
  })

  it('keeps the player on the ghat while allowing either the steps or the canopy to be inspected', () => {
    expect(canStandAt(19.7, 4.45)).toBe(true)
    expect(nearestInteraction([19.7, 0.13, 4.45])?.id).toBe('prop_ghat_spot')
    expect(canStandAt(19.7, 4.85)).toBe(true)
    expect(nearestInteraction([19.7, 0.13, 4.85])?.id).toBe('prop_sugarcane_koshi')
    expect(canStandAt(24, 4.85)).toBe(false)
  })

  it('updates the basket maker’s contextual action when the parcel is ready and when collected', () => {
    const position: [number, number, number] = [12.5, 0, 4]
    expect(nearestInteraction(position)?.actionName).toBe('Talk with Mohan Kaka')
    expect(nearestInteraction(position, { wheat_sorted: true })?.actionName).toBe('Collect the basket')
    expect(nearestInteraction(position, { wheat_sorted: true, bamboo_collected: true })?.actionName).toBe('Talk with Mohan Kaka')
  })

  it('validates brick and pond color tokens in GAME_CONFIG', () => {
    expect(GAME_CONFIG.palette.brickRed).toBe('#9e3d2b')
    expect(GAME_CONFIG.palette.pondWater).toBe('#1e4d56')
    expect(GAME_CONFIG.palette.bananaLeaf).toBe('#438038')
    expect(GAME_CONFIG.palette.marigoldOrange).toBe('#f38218')
  })

  it('progresses quest through artisan visit and ghat inspection', () => {
    const store = useGameStore.getState()
    store.resetGame()

    // 1. Initial State
    expect(useGameStore.getState().activeQuestId).toBe('q_arrival_talk')
    store.interactWithTarget('npc_mother')
    expect(useGameStore.getState().activeQuestId).toBe('q_courtyard_clean')
    store.closeDialogue()

    // 2. Clean courtyard
    store.interactWithTarget('prop_broom')
    expect(useGameStore.getState().worldFlags.courtyard_cleaned).toBe(true)
    expect(useGameStore.getState().activeQuestId).toBe('q_wheat_sort')

    // 3. Inspect wheat
    store.closeDialogue()
    store.interactWithTarget('prop_wheat')
    expect(useGameStore.getState().worldFlags.wheat_sorted).toBe(true)
    expect(useGameStore.getState().activeQuestId).toBe('q_bamboo_visit')

    // 4. Visit Mohan Kaka
    store.closeDialogue()
    store.interactWithTarget('npc_artisan')
    expect(useGameStore.getState().worldFlags.bamboo_collected).toBe(true)
    expect(useGameStore.getState().completedQuestIds).toContain('q_bamboo_visit')
    expect(useGameStore.getState().activeQuestId).toBe('q_ghat_clean')
    expect(useGameStore.getState().dialogueSpeaker).toBe('Mohan Kaka')
    expect(useGameStore.getState().inventory).toEqual(['woven_basket'])

    // 5. Inspect Ghat Platform
    store.closeDialogue()
    store.interactWithTarget('prop_ghat_spot')
    expect(useGameStore.getState().worldFlags.ghat_prepared).toBe(true)
    expect(useGameStore.getState().completedQuestIds).toContain('q_ghat_clean')
    expect(useGameStore.getState().activeQuestId).toBe('q_dawn_walk')
    store.closeDialogue()
    store.interactWithTarget('prop_ghat_spot')
    expect(useGameStore.getState().worldFlags.dawn_witnessed).toBe(true)
    expect(useGameStore.getState().activeQuestId).toBe('q_return_home')
    store.closeDialogue()
    store.interactWithTarget('npc_mother')
    expect(useGameStore.getState().worldFlags.homecoming_shared).toBe(true)
    expect(useGameStore.getState().activeQuestId).toBe('q_prasad_share')
    store.closeDialogue()
    store.interactWithTarget('npc_mother')
    expect(useGameStore.getState().worldFlags.prasad_shared).toBe(true)
    expect(useGameStore.getState().activeQuestId).toBeNull()
  })
})

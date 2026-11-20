import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { VillageLane } from '../world/terrain/VillageLane'
import { VillagePondGhat } from '../world/environment/VillagePondGhat'
import { ArtisanNPC } from '../characters/npcs/ArtisanNPC'
import { GAME_CONFIG } from '../game/config'
import { useGameStore } from '../systems/quests/gameStore'

describe('Village Expansion & Ghat Systems (Milestone M08)', () => {
  it('renders VillageLane component without errors', () => {
    const { container } = render(<VillageLane />)
    expect(container).toBeDefined()
  })

  it('renders VillagePondGhat with brick ghat, pond water, and ceremonial props', () => {
    const { container } = render(
      <VillagePondGhat
        isOfferingReady={true}
        isGhatHighlighted={true}
        isKoshiHighlighted={false}
      />
    )
    expect(container).toBeDefined()
  })

  it('renders ArtisanNPC Mohan Kaka with sculpted geometry', () => {
    const { container } = render(
      <ArtisanNPC position={[12.5, 0.2, 5.4]} isHighlighted={true} />
    )
    expect(container).toBeDefined()
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
    expect(useGameStore.getState().activeQuestId).toBe('q_courtyard_clean')

    // 2. Clean courtyard
    store.interactWithTarget('prop_broom')
    expect(useGameStore.getState().worldFlags.courtyard_cleaned).toBe(true)
    expect(useGameStore.getState().activeQuestId).toBe('q_wheat_sort')

    // 3. Inspect wheat
    store.interactWithTarget('prop_wheat')
    expect(useGameStore.getState().worldFlags.wheat_sorted).toBe(true)
    expect(useGameStore.getState().activeQuestId).toBe('q_bamboo_visit')

    // 4. Visit Mohan Kaka
    store.interactWithTarget('npc_artisan')
    expect(useGameStore.getState().worldFlags.bamboo_collected).toBe(true)
    expect(useGameStore.getState().completedQuestIds).toContain('q_bamboo_visit')
    expect(useGameStore.getState().activeQuestId).toBe('q_ghat_clean')
    expect(useGameStore.getState().dialogueSpeaker).toBe('Mohan Kaka (Artisan)')

    // 5. Inspect Ghat Platform
    store.interactWithTarget('prop_ghat_spot')
    expect(useGameStore.getState().worldFlags.ghat_prepared).toBe(true)
    expect(useGameStore.getState().completedQuestIds).toContain('q_ghat_clean')
    expect(useGameStore.getState().activeQuestId).toBe('q_dawn_walk')
  })
})

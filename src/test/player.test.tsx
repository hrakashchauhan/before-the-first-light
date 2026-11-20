import { beforeEach, describe, expect, it } from 'vitest'
import { useGameStore } from '../systems/quests/gameStore'
import { GAME_CONFIG } from '../game/config'
import { COURTYARD_ANCHORS, getObjective, PLAYER_START } from '../systems/interaction/household'
import { nearestInteraction } from '../systems/interaction/useInteractionTargets'
import { canStandAt, stepPosition } from '../systems/movement/navigation'

const state = useGameStore.getState
const key = 'before_the_first_light_save_v1'

describe('Courtyard controls and household progression', () => {
  beforeEach(() => { state().resetGame() })

  it('clamps every camera input path and recovers from nonfinite values', () => {
    for (const [attempt, expected] of [[-99, GAME_CONFIG.camera.minDistance], [400, GAME_CONFIG.camera.maxDistance], [NaN, GAME_CONFIG.camera.defaultDistance]]) {
      state().setCameraZoom(attempt)
      expect(state().cameraZoomDistance).toBe(expected)
    }
  })

  it('has Ma introduce the task and ignores input while her dialogue is open', () => {
    expect(state().activeQuestId).toBe('q_arrival_talk')
    state().interactWithTarget('prop_broom')
    expect(state().worldFlags.courtyard_cleaned).toBe(false)
    state().closeDialogue()
    state().interactWithTarget('npc_mother')
    expect(state().worldFlags.talked_to_mother).toBe(true)
    expect(state().dialogueSpeaker).toBe('Ma')
    expect(state().dialogueText).toContain('Your uncle')
    state().interactWithTarget('prop_broom')
    expect(state().worldFlags.courtyard_cleaned).toBe(false)
    state().closeDialogue()
    state().interactWithTarget('prop_broom')
    expect(state().preparationGesture).toBe('sweep')
    expect(state().activeQuestId).toBe('q_wheat_sort')
    expect(state().worldFlags.courtyard_cleaned).toBe(true)
    expect(state().completedQuestIds).toContain('q_courtyard_clean')
  })

  it('guards tasks, preserves progression on repeated inspections and offers a useful fallback', () => {
    for (const id of ['prop_wheat', 'npc_artisan', 'prop_ghat_spot']) {
      state().interactWithTarget(id)
      expect(state().activeQuestId).toBe('q_arrival_talk')
      expect(state().dialogueText).toBeTruthy()
      state().closeDialogue()
    }
    for (const id of ['npc_mother', 'prop_broom', 'prop_wheat', 'prop_broom', 'prop_wheat']) {
      state().interactWithTarget(id)
      state().closeDialogue()
    }
    expect(state().activeQuestId).toBe('q_bamboo_visit')
    expect(state().completedQuestIds).toEqual(['q_arrival_talk', 'q_courtyard_clean', 'q_wheat_sort'])
  })

  it('rejects malformed or future saves without partially mutating the store', () => {
    state().interactWithTarget('npc_mother')
    const valid = JSON.parse(localStorage.getItem(key)!)
    for (const raw of ['{', JSON.stringify({ ...valid, worldFlags: { courtyard_cleaned: 'yes' } }), JSON.stringify({ ...valid, schemaVersion: 2 })]) {
      localStorage.setItem(key, raw)
      expect(state().loadGame()).toBe(false)
      expect(state().worldFlags.talked_to_mother).toBe(true)
    }
  })

  it('restores older v1 files even when their saved objective lagged behind the completed work', () => {
    state().saveGame()
    const saved = JSON.parse(localStorage.getItem(key)!)
    saved.activeQuestId = 'q_wheat_sort'
    saved.worldFlags = { courtyard_cleaned: true, wheat_sorted: true }
    delete saved.settings
    localStorage.setItem(key, JSON.stringify(saved))
    expect(state().loadGame()).toBe(true)
    expect(state().activeQuestId).toBe('q_bamboo_visit')
    expect(state().worldFlags.chulha_ready).toBe(true)
    expect(state().dialogueActive).toBe(false)
  })

  it('can still meet Ma and finish the yard in old saves that allowed the ghat to be visited first', () => {
    state().saveGame()
    const legacy = JSON.parse(localStorage.getItem(key)!)
    legacy.worldFlags.ghat_prepared = true
    legacy.activeQuestId = 'q_dawn_walk'
    localStorage.setItem(key, JSON.stringify(legacy))
    expect(state().loadGame()).toBe(true)
    state().interactWithTarget('npc_mother')
    expect(state().activeQuestId).toBe('q_courtyard_clean')
    state().closeDialogue()
    state().interactWithTarget('prop_broom')
    expect(state().activeQuestId).toBe('q_wheat_sort')
    expect(state().worldFlags.ghat_prepared).toBe(true)
    expect(state().worldFlags.homecoming_shared).toBeUndefined()
  })

  it('localizes the objective, interaction and dialogue and persists the preference', () => {
    state().setLanguage('hi')
    expect(getObjective({}, 'hi').title).toBe('माँ से बात करें')
    expect(nearestInteraction([0.8, 0, -0.8], {}, 'hi')?.actionName).toBe('माँ से बात करें')
    state().interactWithTarget('npc_mother')
    expect(state().dialogueSpeaker).toBe('माँ')
    expect(state().dialogueText).toContain('आ गए')
    useGameStore.setState({ language: 'en' })
    expect(state().loadGame()).toBe(true)
    expect(state().language).toBe('hi')
  })

  it('aligns screen-relative locomotion with the camera and normalizes diagonal speed', () => {
    const a = stepPosition([0, 0, 0], -1, 0, 1 / 30)
    const b = stepPosition([0, 0, 0], -1, 1, 1 / 30)
    expect(a[0]).toBeLessThan(0)
    expect(a[2]).toBeGreaterThan(0)
    expect(Math.hypot(a[0], a[2])).toBeCloseTo(Math.hypot(b[0], b[2]))
    expect(canStandAt(1.4, 1.8)).toBe(false)
    expect(canStandAt(4.6, 3.2)).toBe(false)
    expect(canStandAt(-1.38, -1.57)).toBe(false)
    expect(canStandAt(1.2, -1.5)).toBe(true)
  })

  it('can reach every registered interaction from the courtyard entrance without crossing solid geometry', () => {
    const reached = new Set<string>()
    const seen = new Set<string>()
    const todo = [[Math.round(PLAYER_START[0] * 4), Math.round(PLAYER_START[2] * 4)]]
    for (let i = 0; i < todo.length; i++) {
      const [x, z] = todo[i]
      const coord = `${x}/${z}`
      if (seen.has(coord)) continue
      seen.add(coord)
      if (!canStandAt(x / 4, z / 4)) continue
      const nearby = nearestInteraction([x / 4, 0, z / 4])
      if (nearby) reached.add(nearby.id)
      todo.push([x - 1, z], [x + 1, z], [x, z - 1], [x, z + 1])
    }
    expect([...reached].sort()).toEqual(Object.keys(COURTYARD_ANCHORS).sort())
  })
})

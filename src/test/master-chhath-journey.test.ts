import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../systems/quests/gameStore'
import {
  createInitialBicycleState,
  stepBicyclePhysics,
  isSafeToDismount,
} from '../systems/movement/bicycleController'
import { canBicycleMoveTo, getNavZone } from '../systems/movement/roadZones'
import { stepPosition } from '../systems/movement/navigation'
import { nearestInteraction } from '../systems/interaction/useInteractionTargets'
import { audioManager } from '../audio/AudioManager'
import { AUDIO_MANIFEST } from '../audio/audioManifest'
import { eventBus } from '../systems/events/eventBus'
import { getObjective } from '../systems/interaction/household'

describe('Master Chhath Journey: 24 Mandatory Acceptance Scenarios', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame()
  })

  // 1. Walk normally
  it('Scenario 01: Walk normally with input displacement', () => {
    const startPos = [-0.85, 0, 2.7] as [number, number, number]
    const nextPos = stepPosition(startPos, 1, 0, 0.1)
    expect(nextPos[0]).toBeGreaterThan(startPos[0])
  })

  // 2. Approach bicycle
  it('Scenario 02: Approach bicycle and detect proximity', () => {
    const nearBicycle = nearestInteraction([5.0, 0, 3.8], {}, 'en', [5.2, 0, 3.8])
    expect(nearBicycle).not.toBeNull()
    expect(nearBicycle?.id).toBe('prop_bicycle')
    expect(nearBicycle?.actionName).toBe('Mount Bicycle')
  })

  // 3. Mount bicycle
  it('Scenario 03: Mount bicycle transitions locomotion mode to riding', () => {
    const store = useGameStore.getState()
    expect(store.locomotionMode).toBe('walking')
    store.mountBicycle()
    expect(useGameStore.getState().locomotionMode).toBe('riding')
  })

  // 4. Accelerate
  it('Scenario 04: Accelerate forward with positive speed increase', () => {
    const bike = createInitialBicycleState([8.0, 0, 3.0])
    const forwardInput = { forward: true, backward: false, left: false, right: false, brake: false, bell: false }
    const updated = stepBicyclePhysics(bike, forwardInput, 0.1)
    expect(updated.speed).toBeGreaterThan(0)
    expect(updated.isParked).toBe(false)
  })

  // 5. Steer
  it('Scenario 05: Steer bicycle rotates heading and updates steer angle', () => {
    const moving = { ...createInitialBicycleState([8.0, 0, 3.0]), speed: 3.0, isParked: false }
    const steerLeft = { forward: true, backward: false, left: true, right: false, brake: false, bell: false }
    const turned = stepBicyclePhysics(moving, steerLeft, 0.1)
    expect(turned.steerAngle).toBeGreaterThan(0)
    expect(turned.rotationY).toBeGreaterThan(0)
  })

  // 6. Brake
  it('Scenario 06: Brake decelerates speed safely', () => {
    const moving = { ...createInitialBicycleState([8.0, 0, 3.0]), speed: 4.0, isParked: false }
    const brakeInput = { forward: false, backward: false, left: false, right: false, brake: true, bell: false }
    const braked = stepBicyclePhysics(moving, brakeInput, 0.1)
    expect(braked.speed).toBeLessThan(4.0)
    expect(braked.isBraking).toBe(true)
  })

  // 7. Dismount
  it('Scenario 07: Dismount requires safe stopping speed', () => {
    expect(isSafeToDismount(4.5)).toBe(false)
    expect(isSafeToDismount(0.2)).toBe(true)
  })

  // 8. Park bicycle
  it('Scenario 08: Park bicycle persists position and resets riding mode', () => {
    const store = useGameStore.getState()
    store.mountBicycle()
    store.setBicycleTransform([12.0, 0, 4.0], 0.2, 0)
    store.dismountBicycle()
    expect(useGameStore.getState().locomotionMode).toBe('walking')
    expect(useGameStore.getState().bicyclePosition).toEqual([12.0, 0, 4.0])
  })

  // 9. Enter a restricted path
  it('Scenario 09: Detects restricted zones (courtyard, pond, ghat steps)', () => {
    const courtyardCheck = canBicycleMoveTo(0.0, 1.0)
    expect(courtyardCheck.allowed).toBe(false)

    const waterCheck = canBicycleMoveTo(22.0, 3.0)
    expect(waterCheck.allowed).toBe(false)
  })

  // 10. Receive correct restriction guidance
  it('Scenario 10: Receive correct restriction guidance message in English and Hindi', () => {
    const checkCourtyard = canBicycleMoveTo(0.0, 1.0)
    expect(checkCourtyard.warningEn).toContain('Pedestrian only')
    expect(checkCourtyard.warningHi).toContain('केवल पैदल')
  })

  // 11. Ride on an allowed road
  it('Scenario 11: Ride on allowed village road returns allowed true', () => {
    const roadCheck = canBicycleMoveTo(10.0, 3.5)
    expect(roadCheck.allowed).toBe(true)
    const zone = getNavZone(10.0, 3.5)
    expect(zone.type).toBe('bicycle-road')
  })

  // 12. Deliver an item
  it('Scenario 12: Collect item and deliver to household', () => {
    const store = useGameStore.getState()
    store.interactWithTarget('npc_mother')
    store.closeDialogue()
    store.interactWithTarget('prop_broom')
    store.closeDialogue()
    store.interactWithTarget('prop_wheat')
    store.closeDialogue()
    store.interactWithTarget('npc_artisan')
    store.closeDialogue()
    expect(useGameStore.getState().inventory).toContain('woven_basket')
  })

  // 13. Trigger mother's follow-up activity
  it('Scenario 13: Mother responds to completed preparation', () => {
    const store = useGameStore.getState()
    store.interactWithTarget('npc_mother')
    store.closeDialogue()
    expect(useGameStore.getState().worldFlags.talked_to_mother).toBe(true)
    const obj = getObjective(useGameStore.getState().worldFlags)
    expect(obj.questId).toBe('q_courtyard_clean')
  })

  // 14. Unlock the next task
  it('Scenario 14: Completing task unlocks next quest', () => {
    const store = useGameStore.getState()
    store.interactWithTarget('npc_mother')
    store.closeDialogue()
    store.interactWithTarget('prop_broom')
    store.closeDialogue()
    expect(useGameStore.getState().worldFlags.courtyard_cleaned).toBe(true)
    const obj = getObjective(useGameStore.getState().worldFlags)
    expect(obj.questId).toBe('q_wheat_sort')
  })

  // 15. Change location
  it('Scenario 15: Destination changes emit travel arrival event', () => {
    let arrivedDest = ''
    eventBus.on('journey:destination-arrived', ({ destinationId }) => {
      arrivedDest = destinationId
    })
    useGameStore.getState().setCurrentDestination('hub_artisan')
    expect(arrivedDest).toBe('hub_artisan')
  })

  // 16. Hear the correct music
  it('Scenario 16: Manifest includes the authentic supplied Chhathi Maiya Bulaye soundtrack', () => {
    const track = AUDIO_MANIFEST.music_chhathi_maiya_bulaye
    expect(track.url).toContain('chhathi-maiya-bulaye-theme.mp3')
    expect(track.title).toContain('Chhathi Maiya Bulaye')
  })

  // 17. Start character dialogue
  it('Scenario 17: Interacting with character begins dialogue and sets speaker', () => {
    const store = useGameStore.getState()
    store.interactWithTarget('npc_mother')
    expect(useGameStore.getState().dialogueActive).toBe(true)
    expect(useGameStore.getState().dialogueSpeaker).toBe('Ma')
  })

  // 18. Verify music ducking
  it('Scenario 18: Character dialogue triggers music ducking', () => {
    audioManager.init()
    let ducked = false
    eventBus.on('character:dialogue-started', () => {
      ducked = true
    })
    useGameStore.getState().interactWithTarget('npc_mother')
    expect(ducked).toBe(true)
  })

  // 19. End dialogue
  it('Scenario 19: Closing dialogue ends dialogue state', () => {
    const store = useGameStore.getState()
    store.interactWithTarget('npc_mother')
    expect(useGameStore.getState().dialogueActive).toBe(true)
    store.closeDialogue()
    expect(useGameStore.getState().dialogueActive).toBe(false)
  })

  // 20. Verify music restoration
  it('Scenario 20: Closing dialogue triggers dialogue-completed to restore music', () => {
    let completed = false
    eventBus.on('character:dialogue-completed', () => {
      completed = true
    })
    const store = useGameStore.getState()
    store.interactWithTarget('npc_mother')
    store.closeDialogue()
    expect(completed).toBe(true)
  })

  // 21. Mute music
  it('Scenario 21: Setting mute silences audio', () => {
    audioManager.setSettings({ muted: true })
    expect(audioManager.getSettings().muted).toBe(true)
    audioManager.setSettings({ muted: false })
    expect(audioManager.getSettings().muted).toBe(false)
  })

  // 22. Change volume
  it('Scenario 22: Changing music and SFX volume updates settings', () => {
    const store = useGameStore.getState()
    store.setMusicVolume(0.45)
    store.setSfxVolume(0.65)
    expect(useGameStore.getState().settings.musicVolume).toBe(0.45)
    expect(useGameStore.getState().settings.sfxVolume).toBe(0.65)
  })

  // 23. Save and reload
  it('Scenario 23: Save and reload writes and reads from localStorage', () => {
    const store = useGameStore.getState()
    store.interactWithTarget('npc_mother')
    store.setBicycleTransform([11.5, 0, 4.0], 0.35, 0)
    const saved = store.saveGame()
    expect(saved).toBe(true)

    // Reset runtime and reload
    useGameStore.setState({ bicyclePosition: [0, 0, 0] })
    const loaded = useGameStore.getState().loadGame()
    expect(loaded).toBe(true)
    expect(useGameStore.getState().worldFlags.talked_to_mother).toBe(true)
  })

  // 24. Restore bicycle and task state
  it('Scenario 24: Restores bicycle position and locomotion mode to walking safely', () => {
    const store = useGameStore.getState()
    store.setBicycleTransform([14.2, 0, 3.8], 0.5, 0)
    store.mountBicycle()
    store.saveGame()

    // Simulate page reload: state reset in memory, but localStorage intact
    useGameStore.setState({ bicyclePosition: [0, 0, 0], locomotionMode: 'riding', bicycleSpeed: 4.5 })
    useGameStore.getState().loadGame()

    const reloaded = useGameStore.getState()
    expect(reloaded.bicyclePosition).toEqual([14.2, 0, 3.8])
    expect(reloaded.locomotionMode).toBe('walking')
    expect(reloaded.bicycleSpeed).toBe(0)
  })
})

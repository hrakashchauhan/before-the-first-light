import { create } from 'zustand'
import { z } from 'zod'
import type { GameSaveV1 } from '../../../schemas/game-state'
import { GAME_CONFIG } from '../../game/config'
import { COURTYARD_ANCHORS, getObjective, type TargetId, type WorldPosition } from '../interaction/household'
import { householdStory } from './householdStory'
import { eventBus } from '../events/eventBus'
import type { LocomotionMode } from '../movement/playerLocomotionState'
import { INITIAL_BICYCLE_POSITION } from '../movement/bicycleController'
import { audioManager } from '../../audio/AudioManager'

const STORAGE_KEY = 'before_the_first_light_save_v1'
const DEFAULT_FLAGS = { courtyard_cleaned: false, talked_to_mother: false, wheat_sorted: false, chulha_ready: true, dawn_witnessed: false, prasad_shared: false }
const DEFAULT_SETTINGS = { musicVolume: 0.8, sfxVolume: 0.9, subtitles: true }
const DEFAULT_SAVE: GameSaveV1 = {
  schemaVersion: 1,
  chapterId: 'homecoming', timeOfDay: 'morning', language: 'en',
  activeQuestId: 'q_arrival_talk', completedQuestIds: [], inventory: [], worldFlags: DEFAULT_FLAGS, settings: DEFAULT_SETTINGS,
}

const saveSchema = z.object({
  schemaVersion: z.literal(1),
  chapterId: z.enum(['homecoming', 'courtyard-preparation', 'household-work', 'village-cooperation', 'festival-eve', 'sandhya-arghya', 'usha-arghya', 'parana-epilogue']),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night', 'pre-dawn', 'sunrise']),
  language: z.enum(['en', 'hi']), activeQuestId: z.string().nullable(),
  completedQuestIds: z.array(z.string()).default([]), inventory: z.array(z.string()).default([]),
  worldFlags: z.record(z.string(), z.boolean()),
  settings: z.object({
    masterVolume: z.number().min(0).max(1).optional(),
    musicVolume: z.number().min(0).max(1),
    sfxVolume: z.number().min(0).max(1),
    subtitles: z.boolean(),
  }).default(DEFAULT_SETTINGS),
  bicyclePosition: z.tuple([z.number(), z.number(), z.number()]).optional(),
  bicycleRotationY: z.number().optional(),
  currentDestinationId: z.string().optional(),
})

const CLOSED_DIALOGUE = { dialogueActive: false, dialogueSpeaker: null, dialogueText: null, dialogueTargetId: null, preparationGesture: null } as const

interface GameStateStore extends GameSaveV1 {
  dialogueActive: boolean
  dialogueSpeaker: string | null
  dialogueText: string | null
  dialogueTargetId: TargetId | null
  preparationGesture: 'sweep' | 'spread' | null
  cameraZoomDistance: number
  isDebugOpen: boolean
  currentDestinationId: string
  locomotionMode: LocomotionMode
  bicyclePosition: WorldPosition
  bicycleRotationY: number
  bicycleSpeed: number
  warningText: string | null
  setCameraZoom: (distance: number) => void
  setLanguage: (language: GameSaveV1['language']) => void
  setMasterVolume: (volume: number) => void
  setSfxVolume: (volume: number) => void
  setMusicVolume: (volume: number) => void
  setCurrentDestination: (destinationId: string) => void
  setLocomotionMode: (mode: LocomotionMode) => void
  setBicycleTransform: (pos: WorldPosition, rotY: number, speed: number) => void
  setWarningText: (text: string | null) => void
  mountBicycle: () => void
  dismountBicycle: () => void
  toggleDebug: () => void
  interactWithTarget: (targetId: string) => void
  closeDialogue: () => void
  sweepCourtyard: () => void
  saveGame: () => boolean
  loadGame: () => boolean
  resetGame: () => void
}

export function boundedZoom(distance: number) {
  const { minDistance, maxDistance, defaultDistance } = GAME_CONFIG.camera
  return Number.isFinite(distance) ? Math.min(maxDistance, Math.max(minDistance, distance)) : defaultDistance
}

function isTargetId(id: string): id is TargetId {
  return Object.hasOwn(COURTYARD_ANCHORS, id)
}

const runtimeDefaults = {
  ...CLOSED_DIALOGUE,
  cameraZoomDistance: GAME_CONFIG.camera.defaultDistance,
  isDebugOpen: false,
  currentDestinationId: 'hub_home',
  locomotionMode: 'walking' as LocomotionMode,
  bicyclePosition: [...INITIAL_BICYCLE_POSITION] as WorldPosition,
  bicycleRotationY: 0,
  bicycleSpeed: 0,
  warningText: null as string | null,
}

export const useGameStore = create<GameStateStore>((set, get) => ({
  ...DEFAULT_SAVE,
  ...runtimeDefaults,
  setCameraZoom: (distance) => set({ cameraZoomDistance: boundedZoom(distance) }),
  setLanguage: (language) => {
    set({ language })
    eventBus.emit('settings:changed', { settings: { ...get().settings } })
    get().saveGame()
  },
  setMasterVolume: (volume) => {
    if (!Number.isFinite(volume)) return
    const masterVolume = Math.min(1, Math.max(0, volume))
    set((state) => ({ settings: { ...state.settings, masterVolume } }))
    audioManager.setSettings({ masterVolume })
    eventBus.emit('settings:changed', { settings: { masterVolume } })
    get().saveGame()
  },
  setSfxVolume: (volume) => {
    if (!Number.isFinite(volume)) return
    const sfxVolume = Math.min(1, Math.max(0, volume))
    set((state) => ({ settings: { ...state.settings, sfxVolume } }))
    audioManager.setSettings({ sfxVolume })
    eventBus.emit('settings:changed', { settings: { sfxVolume } })
    get().saveGame()
  },
  setMusicVolume: (volume) => {
    if (!Number.isFinite(volume)) return
    const musicVolume = Math.min(1, Math.max(0, volume))
    set((state) => ({ settings: { ...state.settings, musicVolume } }))
    audioManager.setSettings({ musicVolume })
    eventBus.emit('settings:changed', { settings: { musicVolume } })
    get().saveGame()
  },
  setCurrentDestination: (destinationId: string) => {
    const prev = get().currentDestinationId
    if (prev === destinationId) return
    set({ currentDestinationId: destinationId })
    eventBus.emit('journey:destination-arrived', { destinationId, previousDestinationId: prev })
  },
  setLocomotionMode: (locomotionMode: LocomotionMode) => set({ locomotionMode }),
  setBicycleTransform: (bicyclePosition: WorldPosition, bicycleRotationY: number, bicycleSpeed: number) =>
    set({ bicyclePosition, bicycleRotationY, bicycleSpeed }),
  setWarningText: (warningText: string | null) => set({ warningText }),
  mountBicycle: () => {
    const state = get()
    if (state.locomotionMode === 'riding' || state.dialogueActive) return
    set({ locomotionMode: 'riding', warningText: null })
  },
  dismountBicycle: () => {
    const state = get()
    if (state.locomotionMode !== 'riding') return
    set({ locomotionMode: 'walking', bicycleSpeed: 0, warningText: null })
  },
  toggleDebug: () => set((state) => ({ isDebugOpen: !state.isDebugOpen })),
  closeDialogue: () => {
    const prevTarget = get().dialogueTargetId
    set(CLOSED_DIALOGUE)
    if (prevTarget) {
      eventBus.emit('character:dialogue-completed', { targetId: prevTarget })
    }
  },
  sweepCourtyard: () => get().interactWithTarget('prop_broom'),

  interactWithTarget: (id) => {
    const state = get()
    if (!isTargetId(id) || state.dialogueActive || state.isDebugOpen) return
    eventBus.emit('player:interact', { targetId: id })
    const { speaker, text, completed } = householdStory(id, state.worldFlags, state.language)
    const preparationGesture = completed?.flag === 'courtyard_cleaned' ? 'sweep' : completed?.flag === 'wheat_sorted' ? 'spread' : null
    const dialogue = { dialogueActive: true, dialogueTargetId: id, dialogueSpeaker: speaker, dialogueText: text, preparationGesture } as const
    eventBus.emit('character:dialogue-started', { speaker, text, targetId: id })

    if (!completed) {
      set(dialogue)
      return
    }
    const worldFlags = { ...state.worldFlags, [completed.flag]: true }
    eventBus.emit('world:flag-changed', { flagId: completed.flag, value: true })
    eventBus.emit('world:state-changed', { flag: completed.flag, value: true })
    eventBus.emit('quest:completed', { questId: completed.quest })

    if (completed.item) {
      eventBus.emit('player:item-collected', { itemId: completed.item })
    }

    if (completed.chapter && completed.chapter !== state.chapterId) {
      eventBus.emit('timeline:chapter-changed', { chapterId: completed.chapter, previousChapterId: state.chapterId })
      eventBus.emit('chapter:changed', { chapterId: completed.chapter })
    }

    const nextTimeOfDay = completed.flag === 'dawn_witnessed' ? 'sunrise' : completed.flag === 'prasad_shared' ? 'morning' : state.timeOfDay
    if (nextTimeOfDay !== state.timeOfDay) {
      eventBus.emit('timeline:phase-changed', { timeOfDay: nextTimeOfDay })
    }

    set({
      ...dialogue, worldFlags,
      chapterId: completed.chapter ?? state.chapterId,
      timeOfDay: nextTimeOfDay,
      activeQuestId: getObjective(worldFlags).questId,
      completedQuestIds: [...new Set([...state.completedQuestIds, completed.quest])],
      inventory: completed.item ? [...new Set([...state.inventory, completed.item])] : state.inventory,
    })
    get().saveGame()
  },

  saveGame: () => {
    try {
      const state = get()
      const dataToSave = {
        ...state,
        bicyclePosition: state.bicyclePosition,
        bicycleRotationY: state.bicycleRotationY,
        currentDestinationId: state.currentDestinationId,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveSchema.parse(dataToSave)))
      eventBus.emit('save:completed', { timestamp: Date.now(), chapterId: state.chapterId })
      return true
    } catch { return false }
  },
  loadGame: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return false
      const saved = saveSchema.safeParse(JSON.parse(raw))
      if (!saved.success) return false
      const worldFlags = { ...DEFAULT_FLAGS, ...saved.data.worldFlags }
      set({
        ...saved.data,
        ...CLOSED_DIALOGUE,
        worldFlags,
        activeQuestId: getObjective(worldFlags).questId,
        bicyclePosition: saved.data.bicyclePosition ?? [...INITIAL_BICYCLE_POSITION],
        bicycleRotationY: saved.data.bicycleRotationY ?? 0,
        currentDestinationId: saved.data.currentDestinationId ?? 'hub_home',
        locomotionMode: 'walking',
        bicycleSpeed: 0,
      })
      return true
    } catch { return false }
  },
  resetGame: () => {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* in-memory fallback */ }
    set({ ...DEFAULT_SAVE, ...runtimeDefaults })
  },
}))

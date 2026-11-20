import { create } from 'zustand'
import { z } from 'zod'
import type { GameSaveV1 } from '../../../schemas/game-state'
import { GAME_CONFIG } from '../../game/config'
import { COURTYARD_ANCHORS, getObjective, type TargetId } from '../interaction/household'
import { householdStory } from './householdStory'

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
  settings: z.object({ musicVolume: z.number().min(0).max(1), sfxVolume: z.number().min(0).max(1), subtitles: z.boolean() }).default(DEFAULT_SETTINGS),
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
  setCameraZoom: (distance: number) => void
  setLanguage: (language: GameSaveV1['language']) => void
  setSfxVolume: (volume: number) => void
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

const runtimeDefaults = { ...CLOSED_DIALOGUE, cameraZoomDistance: GAME_CONFIG.camera.defaultDistance, isDebugOpen: false }

export const useGameStore = create<GameStateStore>((set, get) => ({
  ...DEFAULT_SAVE,
  ...runtimeDefaults,
  setCameraZoom: (distance) => set({ cameraZoomDistance: boundedZoom(distance) }),
  setLanguage: (language) => { set({ language }); get().saveGame() },
  setSfxVolume: (volume) => {
    if (!Number.isFinite(volume)) return
    set((state) => ({ settings: { ...state.settings, sfxVolume: Math.min(1, Math.max(0, volume)) } }))
    get().saveGame()
  },
  toggleDebug: () => set((state) => ({ isDebugOpen: !state.isDebugOpen })),
  closeDialogue: () => set(CLOSED_DIALOGUE),
  sweepCourtyard: () => get().interactWithTarget('prop_broom'),

  interactWithTarget: (id) => {
    const state = get()
    if (!isTargetId(id) || state.dialogueActive || state.isDebugOpen) return
    const { speaker, text, completed } = householdStory(id, state.worldFlags, state.language)
    const preparationGesture = completed?.flag === 'courtyard_cleaned' ? 'sweep' : completed?.flag === 'wheat_sorted' ? 'spread' : null
    const dialogue = { dialogueActive: true, dialogueTargetId: id, dialogueSpeaker: speaker, dialogueText: text, preparationGesture } as const
    if (!completed) {
      set(dialogue)
      return
    }
    const worldFlags = { ...state.worldFlags, [completed.flag]: true }
    set({
      ...dialogue, worldFlags,
      chapterId: completed.chapter ?? state.chapterId,
      timeOfDay: completed.flag === 'dawn_witnessed' ? 'sunrise' : completed.flag === 'prasad_shared' ? 'morning' : state.timeOfDay,
      activeQuestId: getObjective(worldFlags).questId,
      completedQuestIds: [...new Set([...state.completedQuestIds, completed.quest])],
      inventory: completed.item ? [...new Set([...state.inventory, completed.item])] : state.inventory,
    })
    get().saveGame()
  },

  saveGame: () => {
    try {
      // The validation schema selects serializable fields and excludes all transient UI state.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveSchema.parse(get())))
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
      // Older v1 saves can have a stale objective after repeating broom/wheat or visiting the lane early.
      set({ ...saved.data, ...CLOSED_DIALOGUE, worldFlags, activeQuestId: getObjective(worldFlags).questId })
      return true
    } catch { return false }
  },
  resetGame: () => {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* A storage-blocked browser can still start over in memory. */ }
    set({ ...DEFAULT_SAVE, ...runtimeDefaults })
  },
}))

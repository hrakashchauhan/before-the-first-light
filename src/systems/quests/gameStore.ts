import { create } from 'zustand'
import type { GameSaveV1, GameSettings } from '../../../schemas/game-state'

const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.8,
  sfxVolume: 0.9,
  subtitles: true,
}

const DEFAULT_SAVE: GameSaveV1 = {
  schemaVersion: 1,
  chapterId: 'homecoming',
  timeOfDay: 'morning',
  language: 'en',
  activeQuestId: 'q_courtyard_clean',
  completedQuestIds: [],
  inventory: [],
  worldFlags: {
    courtyard_cleaned: false,
    talked_to_mother: false,
    wheat_sorted: false,
    chulha_ready: true,
  },
  settings: DEFAULT_SETTINGS,
}

const STORAGE_KEY = 'before_the_first_light_save_v1'

interface GameStateStore extends GameSaveV1 {
  // Runtime dialogue & active interaction states
  dialogueActive: boolean
  dialogueSpeaker: string | null
  dialogueText: string | null
  cameraZoomDistance: number
  isDebugOpen: boolean

  // Actions
  setCameraZoom: (distance: number) => void
  toggleDebug: () => void
  interactWithTarget: (targetId: string) => void
  closeDialogue: () => void
  sweepCourtyard: () => void
  saveGame: () => boolean
  loadGame: () => boolean
  resetGame: () => void
}

export const useGameStore = create<GameStateStore>((set, get) => ({
  ...DEFAULT_SAVE,
  dialogueActive: false,
  dialogueSpeaker: null,
  dialogueText: null,
  cameraZoomDistance: 13.5,
  isDebugOpen: false,

  setCameraZoom: (distance: number) => {
    set({ cameraZoomDistance: distance })
  },

  toggleDebug: () => {
    set((state) => ({ isDebugOpen: !state.isDebugOpen }))
  },

  closeDialogue: () => {
    set({ dialogueActive: false, dialogueSpeaker: null, dialogueText: null })
  },

  sweepCourtyard: () => {
    const currentFlags = get().worldFlags
    const completed = get().completedQuestIds
    set({
      worldFlags: { ...currentFlags, courtyard_cleaned: true },
      completedQuestIds: Array.from(new Set([...completed, 'q_courtyard_clean'])),
      activeQuestId: 'q_wheat_sort',
      dialogueActive: true,
      dialogueSpeaker: 'Devraj (You)',
      dialogueText: 'The courtyard is freshly swept. The sacred preparation ground is now clean for the wheat and offerings.',
    })
    get().saveGame()
  },

  interactWithTarget: (targetId: string) => {
    if (targetId === 'prop_broom') {
      get().sweepCourtyard()
    } else if (targetId === 'npc_mother') {
      const isSwept = get().worldFlags.courtyard_cleaned
      const isWheat = get().worldFlags.wheat_sorted
      const isBamboo = get().worldFlags.bamboo_collected
      const isGhat = get().worldFlags.ghat_prepared

      let reply = 'Welcome home, my child. The sun is rising gently. Please take the broom near the veranda and sweep the courtyard clean first.'
      if (isGhat) {
        reply = 'The village ghat is serene and ready, and our offerings are complete. The entire neighborhood is coming together for Sandhya Arghya.'
      } else if (isBamboo) {
        reply = 'Mohan Kaka’s woven baskets are so pure. Now please walk to the village pond (pokhra) to verify the ghat steps and koshi setup.'
      } else if (isWheat) {
        reply = 'Bless you, child. The wheat is safe in the morning sun. Now please walk down the village lane to Mohan Kaka’s workshop and collect our bamboo soop and daura.'
      } else if (isSwept) {
        reply = 'Bless you, child. The courtyard looks pure. Next, we must protect the wheat on the drying mat before evening.'
      }

      set({
        dialogueActive: true,
        dialogueSpeaker: 'Ma (Vrati)',
        dialogueText: reply,
        worldFlags: { ...get().worldFlags, talked_to_mother: true },
      })
      get().saveGame()
    } else if (targetId === 'prop_wheat') {
      const isSwept = get().worldFlags.courtyard_cleaned
      if (!isSwept) {
        set({
          dialogueActive: true,
          dialogueSpeaker: 'Inner Thought',
          dialogueText: 'The wheat shouldn’t be laid out until the courtyard earth is thoroughly swept.',
        })
      } else {
        const currentFlags = get().worldFlags
        const completed = get().completedQuestIds
        set({
          worldFlags: { ...currentFlags, wheat_sorted: true },
          completedQuestIds: Array.from(new Set([...completed, 'q_wheat_sort'])),
          activeQuestId: 'q_bamboo_visit',
          dialogueActive: true,
          dialogueSpeaker: 'Ma',
          dialogueText: 'The golden grain is cleaned and soaking in the pure morning sun. Now please walk down the lane to Mohan Kaka’s workshop and collect our bamboo baskets.',
        })
        get().saveGame()
      }
    } else if (targetId === 'prop_chulha') {
      set({
        dialogueActive: true,
        dialogueSpeaker: 'Inner Thought',
        dialogueText: 'The fresh clay chulha is firm, sun-cured, and sacred. Only dried mango wood will be used to prepare the Mahaprasad.',
      })
    } else if (targetId === 'prop_handpump') {
      set({
        dialogueActive: true,
        dialogueSpeaker: 'Inner Thought',
        dialogueText: 'Fresh, clear groundwater from the village handpump. The water runs cool and pure for household preparations.',
      })
    } else if (targetId === 'npc_artisan') {
      const currentFlags = get().worldFlags
      const completed = get().completedQuestIds
      set({
        worldFlags: { ...currentFlags, bamboo_collected: true },
        completedQuestIds: Array.from(new Set([...completed, 'q_bamboo_visit'])),
        activeQuestId: 'q_ghat_clean',
        dialogueActive: true,
        dialogueSpeaker: 'Mohan Kaka (Artisan)',
        dialogueText:
          'Pranam babu! Ham sab soop aur daura taiyaar kar dehli hai. Maai ke bol diha ki e saal ke daura bohot pukaar aur pavitrata se banawal ba. Pokhra par ghat safai chal rahal ba, jaa ke dekh la!',
      })
      get().saveGame()
    } else if (targetId === 'prop_ghat_spot') {
      const currentFlags = get().worldFlags
      const completed = get().completedQuestIds
      set({
        worldFlags: { ...currentFlags, ghat_prepared: true },
        completedQuestIds: Array.from(new Set([...completed, 'q_ghat_clean'])),
        activeQuestId: 'q_dawn_walk',
        dialogueActive: true,
        dialogueSpeaker: 'Devraj (You)',
        dialogueText:
          'The sacred red brick ghat is radiant. The steps are swept clean of river silt, ceremonial banana stalks stand at the entrance, and clay diyas await the evening arghya.',
      })
      get().saveGame()
    } else if (targetId === 'prop_sugarcane_koshi') {
      set({
        dialogueActive: true,
        dialogueSpeaker: 'Devraj (You)',
        dialogueText:
          'The four tall sugarcane stalks form the sacred Koshi canopy above the terracotta elephant and clay lamps. An auspicious family vow honoring the Sun God.',
      })
    }
  },

  saveGame: () => {
    try {
      const state = get()
      const payload: GameSaveV1 = {
        schemaVersion: 1,
        chapterId: state.chapterId,
        timeOfDay: state.timeOfDay,
        language: state.language,
        activeQuestId: state.activeQuestId,
        completedQuestIds: state.completedQuestIds,
        inventory: state.inventory,
        worldFlags: state.worldFlags,
        settings: state.settings,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      return true
    } catch {
      return false
    }
  },

  loadGame: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return false
      const parsed = JSON.parse(raw) as GameSaveV1
      if (parsed.schemaVersion === 1 && parsed.worldFlags) {
        set({
          chapterId: parsed.chapterId,
          timeOfDay: parsed.timeOfDay,
          language: parsed.language,
          activeQuestId: parsed.activeQuestId,
          completedQuestIds: parsed.completedQuestIds || [],
          inventory: parsed.inventory || [],
          worldFlags: parsed.worldFlags,
          settings: parsed.settings || DEFAULT_SETTINGS,
        })
        return true
      }
      return false
    } catch {
      return false
    }
  },

  resetGame: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({
      ...DEFAULT_SAVE,
      dialogueActive: false,
      dialogueSpeaker: null,
      dialogueText: null,
    })
  },
}))

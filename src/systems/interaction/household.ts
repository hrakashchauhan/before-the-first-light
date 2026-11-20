export type WorldPosition = [number, number, number]
export const VERANDA_POST_X = [-3.84, -1.38, 3.87] as const
export const VERANDA_POST_Z = -1.57

// Mesh origins in metres. Proximity uses the ground-plane projection of each origin.
export const COURTYARD_ANCHORS = {
  npc_mother: [0.8, 0.32, -2.2],
  prop_broom: [-3.1, 0, -2.5],
  prop_wheat: [1.4, 0.02, 1.8],
  prop_chulha: [3.2, 0.16, -2.4],
  prop_handpump: [4.6, 0, 3.2],
  prop_goitha: [-5.18, 0.86, 1.65],
  prop_baskets: [-1.8, 0.32, -2.2],
  npc_artisan: [12.5, 0.2, 5.4],
  prop_ghat_spot: [19.8, 0, 3.5],
  prop_sugarcane_koshi: [19.8, 0, 5.7],
} satisfies Record<string, WorldPosition>

export type TargetId = keyof typeof COURTYARD_ANCHORS
export const PLAYER_START: WorldPosition = [-0.85, 0, 2.7]

export interface HouseholdObjective {
  questId: string | null
  title: string
  description: string
  targetId: TargetId | null
}

const objectives: { flag: string; objective: HouseholdObjective }[] = [
  { flag: 'talked_to_mother', objective: { questId: 'q_arrival_talk', title: 'Speak with Ma', description: 'Ma is on the veranda. Walk over to hear her plan for the morning.', targetId: 'npc_mother' } },
  { flag: 'courtyard_cleaned', objective: { questId: 'q_courtyard_clean', title: 'Sweep the courtyard', description: 'The grass broom is at the left end of the veranda. Clear the leaves beside the mat.', targetId: 'prop_broom' } },
  { flag: 'wheat_sorted', objective: { questId: 'q_wheat_sort', title: 'Spread the wheat', description: 'Find the woven mat beside the veranda. Spread the grain while Ma watches for birds.', targetId: 'prop_wheat' } },
  { flag: 'bamboo_collected', objective: { questId: 'q_bamboo_visit', title: 'Visit the basket maker', description: 'Follow the lane past the handpump and collect the basket from Mohan Kaka.', targetId: 'npc_artisan' } },
  { flag: 'ghat_prepared', objective: { questId: 'q_ghat_clean', title: 'Walk to the ghat', description: 'Follow the lane past the workshop. Look in on the neighbours at the pond steps.', targetId: 'prop_ghat_spot' } },
  { flag: 'dawn_witnessed', objective: { questId: 'q_dawn_walk', title: 'Wait for first light', description: 'Stay at the pond steps and notice the village waking together.', targetId: 'prop_ghat_spot' } },
  { flag: 'homecoming_shared', objective: { questId: 'q_return_home', title: 'Return to Ma', description: 'Tell Ma on the veranda about the neighbours you met at the water.', targetId: 'npc_mother' } },
  { flag: 'prasad_shared', objective: { questId: 'q_prasad_share', title: 'Share the morning', description: 'Return to Ma and share what the household and neighbours made possible.', targetId: 'npc_mother' } },
]

const hindiObjectives: Record<string, [string, string]> = {
  q_arrival_talk: ['माँ से बात करें', 'माँ बरामदे में हैं। पास जाकर सुबह के काम की बात करें।'],
  q_courtyard_clean: ['आँगन बुहारें', 'बरामदे की बाईं तरफ़ झाड़ू रखी है। चटाई के पास की पत्तियाँ हटाएँ।'],
  q_wheat_sort: ['गेहूँ फैलाएँ', 'बरामदे के पास चटाई पर गेहूँ फैलाएँ। माँ चिड़ियों पर नज़र रखेंगी।'],
  q_bamboo_visit: ['मोहन काका से मिलें', 'हैंडपंप के आगे गली में मोहन काका से टोकरी लें।'],
  q_ghat_clean: ['घाट तक जाएँ', 'कारीगर की जगह से आगे तालाब की सीढ़ियों पर पड़ोसियों का हाल देखें।'],
  q_dawn_walk: ['पहली रोशनी देखें', 'तालाब की सीढ़ियों पर ठहरें और गाँव को साथ जागते देखें।'],
  q_return_home: ['माँ के पास लौटें', 'बरामदे में माँ को बताएँ कि तालाब के पास क्या देखा।'],
  q_prasad_share: ['सुबह बाँटें', 'बरामदे में माँ के पास लौटकर सबके काम को याद करें।'],
}

export function getObjective(flags: Record<string, boolean>, language: 'en' | 'hi' = 'en'): HouseholdObjective {
  const next = objectives.find(({ flag }) => !flags[flag] && !(flag === 'talked_to_mother' && flags.courtyard_cleaned))
  const objective = next?.objective ?? { questId: null, title: 'A morning together', description: 'The preparations are in hand. Stay a while and explore the household and the lane.', targetId: null }
  if (language === 'en') return objective
  const [title, description] = objective.questId ? hindiObjectives[objective.questId] : ['एक सुबह साथ', 'सुबह का काम हो गया। घर और गली में कुछ देर घूम सकते हैं।']
  return { ...objective, title, description }
}

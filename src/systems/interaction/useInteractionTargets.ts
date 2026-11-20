import { useEffect, useLayoutEffect, useRef } from 'react'
import { useGameStore } from '../quests/gameStore'
import { COURTYARD_ANCHORS, type TargetId, type WorldPosition } from './household'
import { isGameplayKey } from './gameInput'

export interface Interactable {
  id: TargetId
  label: string
  actionName: string
  position: WorldPosition
  radius: number
}

function target(id: TargetId, label: string, actionName: string, radius: number): Interactable {
  return { id, label, actionName, radius, position: COURTYARD_ANCHORS[id] }
}

const targets = [
  target('npc_mother', 'Ma', 'Talk with Ma', 2.05),
  target('prop_broom', 'Grass broom', 'Inspect the broom', 1.85),
  target('prop_wheat', 'Wheat mat', 'Inspect the mat', 1.86),
  target('prop_chulha', 'Clay chulha', 'Inspect the chulha', 1.85),
  target('prop_handpump', 'Handpump', 'Inspect the handpump', 1.7),
  target('prop_goitha', 'Goitha wall', 'Inspect the goitha', 1.55),
  target('prop_baskets', 'Bamboo baskets', 'Inspect the baskets', 1.8),
  target('npc_artisan', 'Mohan Kaka', 'Talk with Mohan Kaka', 2.1),
  target('prop_ghat_spot', 'Pond steps', 'Inspect the steps', 2.25),
  target('prop_sugarcane_koshi', 'Sugarcane canopy', 'Inspect the canopy', 1.8),
  target('prop_bicycle', 'Bicycle', 'Mount Bicycle', 2.2),
]

const hindiTargets: Record<TargetId, [string, string]> = {
  npc_mother: ['माँ', 'माँ से बात करें'], prop_broom: ['झाड़ू', 'झाड़ू देखें'], prop_wheat: ['गेहूँ की चटाई', 'चटाई देखें'],
  prop_chulha: ['मिट्टी का चूल्हा', 'चूल्हा देखें'], prop_handpump: ['हैंडपंप', 'हैंडपंप देखें'], prop_goitha: ['गोइठे', 'गोइठे देखें'],
  prop_baskets: ['बाँस की टोकरियाँ', 'टोकरियाँ देखें'], npc_artisan: ['मोहन काका', 'मोहन काका से बात करें'],
  prop_ghat_spot: ['तालाब की सीढ़ियाँ', 'सीढ़ियाँ देखें'], prop_sugarcane_koshi: ['गन्ने का मंडप', 'मंडप देखें'],
  prop_bicycle: ['साइकिल', 'साइकिल पर बैठें'],
}

export function nearestInteraction([x, , z]: WorldPosition, flags: Record<string, boolean> = {}, language: 'en' | 'hi' = 'en'): Interactable | null {
  let nearest: Interactable | null = null
  let min = Infinity
  for (const item of targets) {
    const distance = (x - item.position[0]) ** 2 + (z - item.position[2]) ** 2
    if (distance <= item.radius ** 2 && distance < min) { nearest = item; min = distance }
  }
  if (!nearest) return null
  const hindi = language === 'hi'
  if (hindi) {
    const [label, actionName] = hindiTargets[nearest.id]
    nearest = { ...nearest, label, actionName }
  }
  if (nearest.id === 'prop_broom' && flags.talked_to_mother && !flags.courtyard_cleaned) return { ...nearest, actionName: hindi ? 'आँगन बुहारें' : 'Sweep the courtyard' }
  if (nearest.id === 'prop_wheat' && flags.courtyard_cleaned && !flags.wheat_sorted) return { ...nearest, actionName: hindi ? 'गेहूँ फैलाएँ' : 'Spread the wheat' }
  if (nearest.id === 'npc_artisan' && flags.wheat_sorted && !flags.bamboo_collected) return { ...nearest, actionName: hindi ? 'टोकरी लें' : 'Collect the basket' }
  return nearest
}

export function useInteractionTargets(position: WorldPosition, onInteract: (id: TargetId) => void, blocked = false) {
  const flags = useGameStore((state) => state.worldFlags)
  const language = useGameStore((state) => state.language)
  const nearest = nearestInteraction(position, flags, language)
  const current = useRef({ nearest, onInteract, blocked })
  useLayoutEffect(() => { current.current = { nearest, onInteract, blocked } }, [nearest, onInteract, blocked])
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'e' || event.repeat || !isGameplayKey(event)) return
      const input = current.current
      const { dialogueActive, isDebugOpen } = useGameStore.getState()
      if (input.blocked || dialogueActive || isDebugOpen || !input.nearest) return
      event.preventDefault()
      input.onInteract(input.nearest.id)
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [])
  return nearest
}

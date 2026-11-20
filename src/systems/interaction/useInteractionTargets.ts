import { useEffect, useMemo, useState } from 'react'

export interface Interactable {
  id: string
  label: string
  actionName: string
  position: [number, number, number]
  radius: number
}

const INTERACTABLES: Interactable[] = [
  {
    id: 'prop_broom',
    label: 'Courtyard Broom',
    actionName: 'Sweep Courtyard',
    position: [-3.1, 0, -2.5],
    radius: 1.8,
  },
  {
    id: 'npc_mother',
    label: 'Ma (Vrati)',
    actionName: 'Talk with Ma',
    position: [0.8, 0.32, -2.2],
    radius: 2.1,
  },
  {
    id: 'prop_wheat',
    label: 'Wheat Drying Mat',
    actionName: 'Inspect Wheat',
    position: [1.4, 0.02, 1.8],
    radius: 2.0,
  },
  {
    id: 'prop_chulha',
    label: 'Clay Chulha',
    actionName: 'Inspect Chulha',
    position: [3.2, 0.16, -2.4],
    radius: 1.9,
  },
  {
    id: 'prop_handpump',
    label: 'Village Handpump',
    actionName: 'Examine Handpump',
    position: [4.6, 0, 3.2],
    radius: 2.1,
  },
  {
    id: 'npc_artisan',
    label: 'Mohan Kaka (Artisan)',
    actionName: 'Collect Baskets',
    position: [12.5, 0, 5.4],
    radius: 2.3,
  },
  {
    id: 'prop_ghat_spot',
    label: 'Sacred Ghat Platform',
    actionName: 'Inspect Ghat',
    position: [19.8, 0, 3.5],
    radius: 2.4,
  },
  {
    id: 'prop_sugarcane_koshi',
    label: 'Sugarcane Koshi Canopy',
    actionName: 'Inspect Koshi',
    position: [19.8, 0, 5.7],
    radius: 2.2,
  },
]

export function useInteractionTargets(
  playerPosition: [number, number, number],
  onInteract: (targetId: string) => void
) {
  const [nearestTarget, setNearestTarget] = useState<Interactable | null>(null)

  // Calculate distances to all registered interactable items
  const activeTarget = useMemo(() => {
    const [px, , pz] = playerPosition
    let closest: Interactable | null = null
    let minDist = Infinity

    for (const item of INTERACTABLES) {
      const [ix, , iz] = item.position
      const dist = Math.hypot(px - ix, pz - iz)
      if (dist <= item.radius && dist < minDist) {
        minDist = dist
        closest = item
      }
    }
    return closest
  }, [playerPosition])

  useEffect(() => {
    setNearestTarget(activeTarget)
  }, [activeTarget])

  // Attach debounced [E] key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key.toLowerCase() === 'e') {
        if (nearestTarget) {
          onInteract(nearestTarget.id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [nearestTarget, onInteract])

  return nearestTarget
}

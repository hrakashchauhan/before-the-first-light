import { useMemo } from 'react'
import { Check, Compass, LockKeyhole, MapPin, X } from 'lucide-react'
import { GameDialog } from '../dialogue/GameDialog'
import { interfaceCopy, type Language } from '../../data/locales/interface'
import type { HouseholdObjective } from '../../systems/interaction/household'
import type { WorldPosition } from '../../systems/interaction/household'

interface Props { language: Language; objective: HouseholdObjective; flags: Record<string, boolean>; timeOfDay: string; onTravel: (position: WorldPosition) => void; onClose: () => void }
interface Stop { id: string; title: string; day: string; position: WorldPosition; flag?: string }
const stops: Stop[] = [
  { id: 'home', title: 'Veranda', day: 'Early morning', position: [0.8, 0, -2.2] },
  { id: 'courtyard', title: 'Courtyard work', day: 'Morning work', position: [-3.1, 0, -2.5], flag: 'courtyard_cleaned' },
  { id: 'grain', title: 'Wheat mat', day: 'Morning work', position: [1.4, 0, 1.8], flag: 'wheat_sorted' },
  { id: 'lane', title: 'Basket maker', day: 'Village lane', position: [12.5, 0, 5.4], flag: 'bamboo_collected' },
  { id: 'ghat', title: 'Pond steps', day: 'First light', position: [19.8, 0, 3.5], flag: 'ghat_prepared' },
  { id: 'dawn', title: 'Dawn witness', day: 'Sunrise', position: [19.8, 0, 3.5], flag: 'dawn_witnessed' },
  { id: 'return', title: 'Homecoming', day: 'Morning return', position: [0.8, 0, -2.2], flag: 'homecoming_shared' },
  { id: 'share', title: 'Morning sharing', day: 'Morning', position: [0.8, 0, -2.2], flag: 'prasad_shared' },
]

export function RouteMap({ language, objective, flags, timeOfDay, onTravel, onClose }: Props) {
  const t = interfaceCopy[language]
  const current = objective.questId
  const unlocked = useMemo(() => {
    let open = true
    return stops.map(stop => {
      const complete = stop.flag ? Boolean(flags[stop.flag]) : false
      const available = open || complete
      if (stop.flag && !complete) open = false
      return { ...stop, complete, available }
    })
  }, [flags])
  return <GameDialog titleId="route-title" className="route-panel" onClose={onClose}>
    <div className="panel-heading"><div className="eyebrow"><Compass size={14}/>{t.route}</div><button className="panel-close" onClick={onClose} aria-label={t.close}><X size={18}/></button></div>
    <h2 id="route-title">{t.routeTitle}</h2>
    <p>{t.routeIntro}</p>
    <div className="route-cycle"><span>{t.cycle}</span><strong>{t.morning}</strong><small>{timeOfDay}</small></div>
    <ol className="route-list">
      {unlocked.map(stop => <li key={stop.id} className={`${stop.complete ? 'is-complete' : ''} ${stop.available ? 'is-open' : 'is-locked'} ${current && stop.id === current.replace('q_', '') ? 'is-current' : ''}`}>
        <button disabled={!stop.available} onClick={() => { onTravel(stop.position); onClose() }} aria-label={`${stop.title} · ${stop.available ? t.travel : t.locked}`}>
          <span className="route-marker">{stop.complete ? <Check size={14}/> : stop.available ? <MapPin size={14}/> : <LockKeyhole size={13}/>}</span>
          <span><strong>{stop.title}</strong><small>{stop.day}</small></span>
          {stop.available && <em>{t.travel}</em>}
        </button>
      </li>)}
    </ol>
    <p className="route-note">{t.routeNote}</p>
  </GameDialog>
}

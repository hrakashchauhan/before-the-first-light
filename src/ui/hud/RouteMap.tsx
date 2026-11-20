import { useMemo } from 'react'
import { Check, Compass, LockKeyhole, MapPin, X } from 'lucide-react'
import { GameDialog } from '../dialogue/GameDialog'
import { interfaceCopy, type Language } from '../../data/locales/interface'
import type { HouseholdObjective } from '../../systems/interaction/household'
import type { WorldPosition } from '../../systems/interaction/household'
import { resolveDestinations } from '../../systems/destinations/destinationManager'

interface Props {
  language: Language
  objective: HouseholdObjective
  flags: Record<string, boolean>
  timeOfDay: string
  onTravel: (position: WorldPosition) => void
  onClose: () => void
}

export function RouteMap({ language, objective, flags, timeOfDay, onTravel, onClose }: Props) {
  const t = interfaceCopy[language]
  const current = objective.questId

  const destinations = useMemo(() => {
    return resolveDestinations(flags, current)
  }, [flags, current])

  return (
    <GameDialog titleId="route-title" className="route-panel" onClose={onClose}>
      <div className="panel-heading">
        <div className="eyebrow"><Compass size={14}/>{t.route}</div>
        <button className="panel-close" onClick={onClose} aria-label={t.close}><X size={18}/></button>
      </div>
      <h2 id="route-title">{t.routeTitle}</h2>
      <p>{t.routeIntro}</p>
      <div className="route-cycle">
        <span>{t.cycle}</span>
        <strong>{t.morning}</strong>
        <small>{timeOfDay}</small>
      </div>
      <ol className="route-list">
        {destinations.map(stop => {
          const title = language === 'hi' ? stop.titleHi : stop.titleEn
          const dayLabel = language === 'hi' ? stop.dayHi : stop.dayEn
          const isComplete = stop.state === 'completed' || stop.state === 'revisited'
          const isOpen = stop.canTravel

          return (
            <li
              key={stop.id}
              className={`${isComplete ? 'is-complete' : ''} ${isOpen ? 'is-open' : 'is-locked'} ${stop.isCurrent ? 'is-current' : ''}`}
            >
              <button
                disabled={!isOpen}
                onClick={() => {
                  onTravel(stop.position)
                  onClose()
                }}
                aria-label={`${title} · ${isOpen ? t.travel : t.locked}`}
              >
                <span className="route-marker">
                  {isComplete ? <Check size={14}/> : isOpen ? <MapPin size={14}/> : <LockKeyhole size={13}/>}
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{dayLabel}</small>
                </span>
                {isOpen && <em>{t.travel}</em>}
              </button>
            </li>
          )
        })}
      </ol>
      <p className="route-note">{t.routeNote}</p>
    </GameDialog>
  )
}

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { BookOpen, Grip, Keyboard, Mouse, Move, X } from 'lucide-react'
import { GameDialog } from '../dialogue/GameDialog'
import { interfaceCopy, type Language } from '../../data/locales/interface'
import type { HouseholdObjective } from '../../systems/interaction/household'

interface Props { language: Language; objective: HouseholdObjective; onClose: () => void }

export function HowToPlay({ language, objective, onClose }: Props) {
  const t = interfaceCopy[language]
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!drag.current) return
      const nextX = drag.current.ox + event.clientX - drag.current.x
      const nextY = drag.current.oy + event.clientY - drag.current.y
      setOffset({ x: Math.max(-window.innerWidth / 2 + 190, Math.min(window.innerWidth / 2 - 190, nextX)), y: Math.max(-window.innerHeight / 2 + 160, Math.min(window.innerHeight / 2 - 160, nextY)) })
    }
    const up = () => { drag.current = null }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
  }, [])
  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y }
  }
  return <GameDialog titleId="guide-title" className="guide-panel" onClose={onClose}>
    <div className="guide-dragbar" onPointerDown={startDrag} title={t.guideMovePanel}>
      <div className="panel-heading"><div className="eyebrow"><Grip size={13}/>{t.guideMovePanel}</div><button className="panel-close" onClick={onClose} aria-label={t.close}><X size={18}/></button></div>
    </div>
    <div className="guide-content" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
      <h2 id="guide-title">{t.guideTitle}</h2>
      <p>{t.guideIntro}</p>
      <section className="guide-hint"><div className="eyebrow">{t.guideHint}</div><strong>{objective.title}</strong><p>{objective.description}</p></section>
      <ul className="guide-steps">
        <li><Keyboard size={18}/><span>{t.guideSteps[0]}</span></li>
        <li><Move size={18}/><span>{t.guideSteps[1]}</span></li>
        <li><BookOpen size={18}/><span>{t.guideSteps[2]}</span></li>
        <li><Mouse size={18}/><span>{t.guideSteps[3]}</span></li>
        <li style={{ borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '6px', marginTop: '6px' }}>
          <span style={{ fontSize: '1.1rem' }}>🚲</span>
          <span>
            {language === 'hi'
              ? 'साइकिल: पास जाकर [E] दबाएँ · [W] आगे बढ़ें · [A/D] मोड़ें · [Space/S] ब्रेक · [B] घंटी · रुकने पर [E] से उतरें।'
              : 'Bicycle: Approach & press [E] to mount · [W] Accelerate · [A/D] Steer · [Space/S] Brake · [B] Bell · [E] to dismount when stopped.'}
          </span>
        </li>
      </ul>
      <button className="resume-button" onClick={onClose}>{t.resume}</button>
    </div>
  </GameDialog>
}

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BookOpen, ChevronRight, Focus, Minus, Mouse, Pause, Plus, Sunrise, Volume2, VolumeX } from 'lucide-react'
import { DawnMark } from './DawnMark'
import { interfaceCopy, locationName, type Language } from '../../data/locales/interface'
import type { Interactable } from '../../systems/interaction/useInteractionTargets'
import { GAME_CONFIG } from '../../game/config'

interface Props {
  language: Language; objectiveTitle: string; nearestTarget: Interactable | null; locationX: number; facing: number
  zoom: number; soundOn: boolean; soundUnavailable: boolean
  onZoom: (distance: number) => void; onJournal: () => void; onPause: () => void; onSound: () => void; onInteract: () => void
  onDirection: (key: 'w' | 'a' | 's' | 'd', held: boolean) => void
}
export function PlayerHUD({language, objectiveTitle, nearestTarget, locationX, facing, zoom, soundOn, soundUnavailable, onZoom, onJournal, onPause, onSound, onInteract, onDirection}: Props) {
  const t = interfaceCopy[language]
  const soundLabel = soundUnavailable ? t.soundUnavailable : soundOn ? t.mute : t.enableSound
  const camera = GAME_CONFIG.camera
  return <div className="hud">
    <header className="masthead">
      <div className="brand"><DawnMark/><span>Before the First Light</span></div>
      <div className="masthead-actions">
        <span className="time-label"><Sunrise size={18}/>{t.morning}</span>
        <button className="plain-button sound-button" aria-label={soundLabel} title={soundLabel} onClick={onSound} aria-pressed={soundOn} disabled={soundUnavailable}>{soundOn ? <Volume2/> : <VolumeX/>}</button>
        <button className="journal-button" onClick={onJournal}><BookOpen size={17}/><span>{t.journal}</span><kbd>J</kbd></button>
        <button className="pause-button" onClick={onPause} aria-label={t.pause} title={t.pause+' (Esc)'}><Pause size={15} fill="currentColor"/></button>
      </div>
    </header>
    <section className="chapter-block" aria-label={t.objective}>
      <div className="chapter-kicker"><span className="rule"/>{t.chapter}</div>
      <h1>{t.homecoming}</h1>
      <button className="objective-link" onClick={onJournal} aria-label={t.journal+' · '+objectiveTitle}>
        <span className="quest-diamond" aria-hidden="true"/><span aria-live="polite">{objectiveTitle}</span><ChevronRight size={14}/>
      </button>
    </section>
    <div className="place-label">
      <svg className="compass" viewBox="0 0 54 54" aria-hidden="true">
        <circle cx="27" cy="27" r="22.5"/><path d="M27 2v6m0 38v6M2 27h6m38 0h6"/>
        <g transform={`rotate(${180-facing*180/Math.PI} 27 27)`}><path className="compass-needle" d="m27 12 5 18-5-3-5 3z"/><path d="m27 41-4-10 4 2 4-2z"/></g>
      </svg>
      <div><small>{t.region}</small><span>{locationName(locationX,language)}</span></div>
    </div>
    {nearestTarget && <button className="interaction" onClick={onInteract}><kbd>E</kbd>{nearestTarget.actionName}<ChevronRight size={16}/></button>}
    <div className="touch-pad" aria-label={t.move}>
      {([['w',t.up,ArrowUp],['a',t.left,ArrowLeft],['s',t.down,ArrowDown],['d',t.right,ArrowRight]] as const).map(([key,label,Icon]) =>
        <button key={key} className={'direction-'+key} aria-label={label} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);onDirection(key,true)}} onPointerUp={()=>onDirection(key,false)} onLostPointerCapture={()=>onDirection(key,false)} onPointerCancel={()=>onDirection(key,false)}><Icon size={17}/></button>)}
    </div>
    <footer className="control-bar">
      <div className="keyboard-guide" aria-label={t.controls}>
        <span className="guide-set"><span className="wasd" aria-label="W A S D">{['W','A','S','D'].map(key=><kbd key={key}>{key}</kbd>)}</span>{t.move}</span>
        <span className="guide-set"><kbd>E</kbd>{t.interact}</span>
        <span className="guide-set wheel"><Mouse size={16}/>{t.zoom}</span>
      </div>
      <div className="zoom-tools" aria-label={t.camera}>
        <button onClick={()=>onZoom(zoom-1.2)} disabled={zoom<=camera.minDistance} aria-label={t.zoomIn} title={t.zoomIn+' (+)'}><Plus size={16}/></button>
        <output aria-label={t.zoom}>{(camera.defaultDistance/zoom).toFixed(1)}×</output>
        <button onClick={()=>onZoom(zoom+1.2)} disabled={zoom>=camera.maxDistance} aria-label={t.zoomOut} title={t.zoomOut+' (−)'}><Minus size={16}/></button>
        <i/><button onClick={()=>onZoom(camera.defaultDistance)} aria-label={t.reset} title={t.reset+' (0)'}><Focus size={16}/></button>
      </div>
    </footer>
  </div>
}

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BookOpen, ChevronRight, CircleHelp, Compass, Focus, Minus, Mouse, Pause, Plus, Sunrise, Volume2, VolumeX } from 'lucide-react'
import { DawnMark } from './DawnMark'
import { interfaceCopy, locationName, type Language } from '../../data/locales/interface'
import type { Interactable } from '../../systems/interaction/useInteractionTargets'
import { GAME_CONFIG } from '../../game/config'

interface Props {
  language: Language; objectiveTitle: string; nearestTarget: Interactable | null; locationX: number; facing: number
  zoom: number; soundOn: boolean; soundUnavailable: boolean
  isMounted?: boolean; warningText?: string | null
  onZoom: (distance: number) => void; onJournal: () => void; onGuide: () => void; onMap: () => void; onPause: () => void; onSound: () => void; onInteract: () => void
  onDirection: (key: 'w' | 'a' | 's' | 'd', held: boolean) => void
}
export function PlayerHUD({language, objectiveTitle, nearestTarget, locationX, facing, zoom, soundOn, soundUnavailable, isMounted = false, warningText = null, onZoom, onJournal, onGuide, onMap, onPause, onSound, onInteract, onDirection}: Props) {
  const t = interfaceCopy[language]
  const soundLabel = soundUnavailable ? t.soundUnavailable : soundOn ? t.mute : t.enableSound
  const camera = GAME_CONFIG.camera
  return <div className="hud">
    <header className="masthead">
      <div className="brand"><DawnMark/><span>Before the First Light</span></div>
      <div className="masthead-actions">
        <span className="time-label"><Sunrise size={18}/>{t.morning}</span>
        {isMounted && <span className="time-label" style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', color: '#ffd700' }}>🚲 {language === 'hi' ? 'साइकिल' : 'Bicycle'}</span>}
        <button className="plain-button sound-button" aria-label={soundLabel} title={soundLabel} onClick={onSound} aria-pressed={soundOn} disabled={soundUnavailable}>{soundOn ? <Volume2/> : <VolumeX/>}</button>
        <button className="journal-button" onClick={onJournal}><BookOpen size={17}/><span>{t.journal}</span><kbd>J</kbd></button>
        <button className="plain-button guide-button" onClick={onGuide} aria-label={t.guide} title={t.guide}><CircleHelp size={18}/></button>
        <button className="plain-button guide-button" onClick={onMap} aria-label={t.route} title={t.route}><Compass size={18}/></button>
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
    {warningText && (
      <div style={{
        position: 'absolute', top: '75px', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(30, 20, 10, 0.88)', color: '#f8d7a4', padding: '6px 16px',
        borderRadius: '6px', border: '1px solid #d4af37', fontSize: '0.88rem', zIndex: 30,
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)', pointerEvents: 'none'
      }}>
        {warningText}
      </div>
    )}
    {isMounted ? (
      <button className="interaction" onClick={onInteract}><kbd>E</kbd>{language === 'hi' ? 'साइकिल से उतरें' : 'Dismount Bicycle'}<ChevronRight size={16}/></button>
    ) : nearestTarget ? (
      <button className="interaction" onClick={onInteract}><kbd>E</kbd>{nearestTarget.actionName}<ChevronRight size={16}/></button>
    ) : null}
    <div className="touch-pad" aria-label={t.move}>
      {([['w',t.up,ArrowUp],['a',t.left,ArrowLeft],['s',t.down,ArrowDown],['d',t.right,ArrowRight]] as const).map(([key,label,Icon]) =>
        <button key={key} className={'direction-'+key} aria-label={label} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);onDirection(key,true)}} onPointerUp={()=>onDirection(key,false)} onLostPointerCapture={()=>onDirection(key,false)} onPointerCancel={()=>onDirection(key,false)}><Icon size={17}/></button>)}
    </div>
    <footer className="control-bar">
      <div className="keyboard-guide" aria-label={t.controls}>
        {isMounted ? (
          <>
            <span className="guide-set"><span className="wasd" aria-label="W A S D">{['W','A','S','D'].map(key=><kbd key={key}>{key}</kbd>)}</span>{language === 'hi' ? 'चलाएँ/मोड़ें' : 'Ride/Steer'}</span>
            <span className="guide-set"><kbd>Space</kbd>{language === 'hi' ? 'ब्रेक' : 'Brake'}</span>
            <span className="guide-set"><kbd>B</kbd>{language === 'hi' ? 'घंटी' : 'Bell'}</span>
            <span className="guide-set"><kbd>E</kbd>{language === 'hi' ? 'उतरें' : 'Dismount'}</span>
          </>
        ) : (
          <>
            <span className="guide-set"><span className="wasd" aria-label="W A S D">{['W','A','S','D'].map(key=><kbd key={key}>{key}</kbd>)}</span>{t.move}</span>
            <span className="guide-set"><kbd>E</kbd>{t.interact}</span>
            <span className="guide-set wheel"><Mouse size={16}/>{t.zoom}</span>
          </>
        )}
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

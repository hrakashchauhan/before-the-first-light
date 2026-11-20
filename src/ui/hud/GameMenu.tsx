import { useState } from 'react'
import { ArrowRight, BookOpen, Check, MapPin, Save, Volume2, VolumeX, X } from 'lucide-react'
import { GameDialog } from '../dialogue/GameDialog'
import { interfaceCopy, journalQuests, locationName, type Language } from '../../data/locales/interface'
import type { HouseholdObjective } from '../../systems/interaction/household'
import { useGameStore } from '../../systems/quests/gameStore'
interface Props {
  mode: 'journal' | 'pause'; objective: HouseholdObjective; x: number; soundOn: boolean; soundUnavailable: boolean
  onSound: () => void; onClose: () => void
}
export function GameMenu({mode,objective,x,soundOn,soundUnavailable,onSound,onClose}:Props) {
  const {language,completedQuestIds,setLanguage,settings,setSfxVolume,saveGame} = useGameStore()
  const t = interfaceCopy[language]
  const [saved,setSaved] = useState<boolean|null>(null)
  const journal = mode === 'journal'
  return <GameDialog titleId="menu-title" onClose={onClose} className={journal?'journal-panel':'pause-panel'}
    onKeyDown={e=>{if(journal && e.key.toLowerCase()==='j' && !e.repeat){e.preventDefault();e.stopPropagation();onClose()}}}>
    <div className="panel-heading"><div className="eyebrow">{journal ? t.chapter+'  /  '+t.homecoming : t.settings}</div>
      <button autoFocus className="panel-close" onClick={onClose} aria-label={t.close}><X size={18}/></button></div>
    <h2 id="menu-title">{journal?t.notes:t.paused}</h2>
    {journal ? <>
      <div className="entry-location"><MapPin size={13}/>{locationName(x,language)}<span>·</span>{t.morning}</div>
      <section className="journal-objective"><div className="eyebrow"><span className="quest-diamond"/>{t.objective}</div><h3>{objective.title}</h3><p>{objective.description}</p></section>
      <h3 className="notes-heading"><BookOpen size={15}/>{t.entries}</h3>
      {completedQuestIds.length ? <ul className="journal-list">{journalQuests.map((id,index)=>completedQuestIds.includes(id) && <li key={id}><Check size={14}/>{t.log[index]}</li>)}</ul> : <p className="empty-notes">{t.noEntries}</p>}
    </> : <div className="settings-list">
      <label>{t.language}<select value={language} onChange={e=>setLanguage(e.target.value as Language)}><option value="en">English</option><option value="hi">हिन्दी</option></select></label>
      <div className="setting-row">{t.sound}<button className="setting-button" onClick={onSound} disabled={soundUnavailable} aria-pressed={soundOn}>{soundOn?<Volume2 size={16}/>:<VolumeX size={16}/>} {soundOn?t.mute:t.enableSound}</button></div>
      <label>{t.volume}<input type="range" min="0" max="1" step="0.05" value={settings.sfxVolume} onChange={e=>setSfxVolume(Number(e.target.value))}/></label>
      <button className="save-button" onClick={()=>setSaved(saveGame())}><Save size={15}/>{t.save}</button>
      {saved!==null && <p role="status">{saved?t.saved:t.saveFailed}</p>}
    </div>}
    <button className="resume-button" onClick={onClose}>{t.resume}<ArrowRight size={15}/></button>
  </GameDialog>
}

import { useState, useMemo } from 'react'
import { ArrowRight, Bell, BookOpen, Check, Circle, Compass, MapPin, RotateCcw, Save, Volume2, VolumeX, X } from 'lucide-react'
import { GameDialog } from '../dialogue/GameDialog'
import { interfaceCopy, journalQuests, locationName, type Language } from '../../data/locales/interface'
import type { HouseholdObjective } from '../../systems/interaction/household'
import { useGameStore } from '../../systems/quests/gameStore'
import { audioManager } from '../../audio/AudioManager'

interface Props {
  mode: 'journal' | 'pause'
  objective: HouseholdObjective
  x: number
  soundOn: boolean
  soundUnavailable: boolean
  onSound: () => void
  onClose: () => void
}

interface WalkthroughStep {
  textEn: string
  textHi: string
  done: boolean
}

export function GameMenu({ mode, objective, x, soundOn, soundUnavailable, onSound, onClose }: Props) {
  const {
    language,
    completedQuestIds,
    setLanguage,
    settings,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    saveGame,
    worldFlags,
    locomotionMode,
  } = useGameStore()

  const t = interfaceCopy[language]
  const [saved, setSaved] = useState<boolean | null>(null)
  const journal = mode === 'journal'

  const walkthroughSteps = useMemo<WalkthroughStep[]>(() => {
    const q = objective.questId
    const isMounted = locomotionMode === 'riding'
    const flags = worldFlags

    if (q === 'q_arrival_talk') {
      return [
        { textEn: 'Step 1: Walk across the courtyard towards the veranda.', textHi: 'चरण 1: आँगन पार करके बरामदे की ओर जाएँ।', done: Boolean(flags.talked_to_mother) },
        { textEn: 'Step 2: Press [E] to speak with Ma and listen to the morning plan.', textHi: 'चरण 2: [E] दबाकर माँ से बात करें और सुबह की योजना सुनें।', done: Boolean(flags.talked_to_mother) },
      ]
    }
    if (q === 'q_courtyard_clean') {
      return [
        { textEn: 'Step 1: Walk to the left end of the veranda.', textHi: 'चरण 1: बरामदे की बाईं ओर जाएँ।', done: Boolean(flags.courtyard_cleaned) },
        { textEn: 'Step 2: Press [E] to pick up the grass broom and sweep dry leaves.', textHi: 'चरण 2: [E] दबाकर झाड़ू लें और आँगन बुहारें।', done: Boolean(flags.courtyard_cleaned) },
        { textEn: 'Step 3: Confirm with Ma that the ground is sanctified.', textHi: 'चरण 3: माँ को बताएँ कि आँगन पवित्र और स्वच्छ हो गया है।', done: Boolean(flags.courtyard_cleaned) },
      ]
    }
    if (q === 'q_wheat_sort') {
      return [
        { textEn: 'Step 1: Walk to the woven grass mat beside the veranda.', textHi: 'चरण 1: बरामदे के पास चटाई पर जाएँ।', done: Boolean(flags.wheat_sorted) },
        { textEn: 'Step 2: Press [E] to spread the wheat evenly in the sun.', textHi: 'चरण 2: [E] दबाकर धूप में सुखाने के लिए गेहूँ फैलाएँ।', done: Boolean(flags.wheat_sorted) },
        { textEn: 'Step 3: Ma will keep watch for birds while you travel down the lane.', textHi: 'चरण 3: गली जाने तक माँ चिड़ियों पर नज़र रखेंगी।', done: Boolean(flags.wheat_sorted) },
      ]
    }
    if (q === 'q_bamboo_visit') {
      return [
        { textEn: 'Step 1: Approach the black roadster bicycle at the courtyard gate.', textHi: 'चरण 1: आँगन के फाटक पर खड़ी काली साइकिल के पास जाएँ।', done: Boolean(flags.bamboo_collected || isMounted) },
        { textEn: 'Step 2: Press [E] to Mount the bicycle.', textHi: 'चरण 2: [E] दबाकर साइकिल पर बैठें।', done: Boolean(flags.bamboo_collected || isMounted) },
        { textEn: 'Step 3: Ride along the village lane towards Mohan Kaka\'s workshop.', textHi: 'चरण 3: मोहन काका की दुकान की ओर सड़क पर साइकिल चलाएँ।', done: Boolean(flags.bamboo_collected) },
        { textEn: 'Step 4: Brake (Space) and press [E] to dismount at the workshop.', textHi: 'चरण 4: ब्रेक लगाएँ और [E] दबाकर साइकिल से उतरें।', done: Boolean(flags.bamboo_collected) },
        { textEn: 'Step 5: Press [E] to talk with Mohan Kaka and collect the bamboo baskets.', textHi: 'चरण 5: [E] दबाकर मोहन काका से पूजा की टोकरी लें।', done: Boolean(flags.bamboo_collected) },
      ]
    }
    if (q === 'q_ghat_clean') {
      return [
        { textEn: 'Step 1: Mount the bicycle and ride along the lane to the pond.', textHi: 'चरण 1: साइकिल पर बैठकर तालाब की ओर बढ़ें।', done: Boolean(flags.ghat_prepared) },
        { textEn: 'Step 2: Stop and dismount before the ritual boundary at the upper steps.', textHi: 'चरण 2: पवित्र सीढ़ियों से पहले साइकिल खड़ी करके उतरें।', done: Boolean(flags.ghat_prepared) },
        { textEn: 'Step 3: Walk down the brick steps to meet neighbours preparing for Arghya.', textHi: 'चरण 3: सीढ़ियों पर उतरकर घाट की सफाई में पड़ोसियों का साथ दें।', done: Boolean(flags.ghat_prepared) },
      ]
    }
    if (q === 'q_dawn_walk') {
      return [
        { textEn: 'Step 1: Stand quietly at the pond steps as the community gathers.', textHi: 'चरण 1: तालाब की सीढ़ियों पर ठहरें जहाँ गाँव वाले एकत्र हैं।', done: Boolean(flags.dawn_witnessed) },
        { textEn: 'Step 2: Witness the first light break as Chhathi Maiya Bulaye swells.', textHi: 'चरण 2: पहली रोशनी और छठी मईया का पावन संगीत सुनें।', done: Boolean(flags.dawn_witnessed) },
      ]
    }
    if (q === 'q_return_home') {
      return [
        { textEn: 'Step 1: Mount the bicycle at the ghat parking point and ride back home.', textHi: 'चरण 1: घाट से साइकिल पर बैठकर घर के आँगन में लौटें।', done: Boolean(flags.homecoming_shared) },
        { textEn: 'Step 2: Press [E] on the veranda to share the ghat preparations with Ma.', textHi: 'चरण 2: बरामदे में माँ को बताएँ कि घाट पर सब तैयार है।', done: Boolean(flags.homecoming_shared) },
      ]
    }
    if (q === 'q_prasad_share') {
      return [
        { textEn: 'Step 1: Gather with family and neighbours on the courtyard veranda.', textHi: 'चरण 1: बरामदे में परिवार और पड़ोसियों के साथ बैठें।', done: Boolean(flags.prasad_shared) },
        { textEn: 'Step 2: Share the sacred prasad (thekua, fruits, and ginger) together.', textHi: 'चरण 2: सबके साथ पावन ठेकुआ और प्रसाद बाँटें।', done: Boolean(flags.prasad_shared) },
      ]
    }

    return [
      { textEn: 'Explore the village roads, visit family members, and enjoy the festival atmosphere.', textHi: 'गाँव की सड़कों पर घूमें, परिवार से मिलें और पावन माहौल का अनुभव करें।', done: true },
    ]
  }, [objective.questId, locomotionMode, worldFlags])

  const handleTestSound = () => {
    audioManager.init()
    audioManager.playBicycleBell()
  }

  const handleRestoreDefaults = () => {
    setMasterVolume(1.0)
    setMusicVolume(0.8)
    setSfxVolume(0.9)
  }

  return (
    <GameDialog
      titleId="menu-title"
      onClose={onClose}
      className={journal ? 'journal-panel' : 'pause-panel'}
      onKeyDown={(e) => {
        if (journal && e.key.toLowerCase() === 'j' && !e.repeat) {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }
      }}
    >
      <div className="panel-heading">
        <div className="eyebrow">{journal ? `${t.chapter} / ${t.homecoming}` : t.settings}</div>
        <button autoFocus className="panel-close" onClick={onClose} aria-label={t.close}>
          <X size={18} />
        </button>
      </div>

      <h2 id="menu-title">{journal ? t.notes : t.paused}</h2>

      {journal ? (
        <>
          <div className="entry-location">
            <MapPin size={13} />
            {locationName(x, language)}
            <span>·</span>
            {t.morning}
          </div>

          <section className="journal-objective">
            <div className="eyebrow">
              <span className="quest-diamond" />
              {t.objective}
            </div>
            <h3>{objective.title}</h3>
            <p>{objective.description}</p>
          </section>

          <section style={{ margin: '12px 0', padding: '10px 14px', background: 'rgba(212,175,55,0.08)', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.2)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#ffd700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={14} />
              {language === 'hi' ? 'कार्य मार्गदर्शिका (चरण-दर-चरण)' : 'Guided Walkthrough (Step-by-Step)'}
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
              {walkthroughSteps.map((step, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: step.done ? '#a3e635' : '#f4efe6' }}>
                  {step.done ? <Check size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> : <Circle size={14} style={{ marginTop: '2px', flexShrink: 0, opacity: 0.5 }} />}
                  <span style={{ textDecoration: step.done ? 'line-through' : 'none', opacity: step.done ? 0.75 : 1 }}>
                    {language === 'hi' ? step.textHi : step.textEn}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <h3 className="notes-heading">
            <BookOpen size={15} />
            {t.entries}
          </h3>
          {completedQuestIds.length ? (
            <ul className="journal-list">
              {journalQuests.map(
                (id, index) =>
                  completedQuestIds.includes(id) && (
                    <li key={id}>
                      <Check size={14} />
                      {t.log[index]}
                    </li>
                  )
              )}
            </ul>
          ) : (
            <p className="empty-notes">{t.noEntries}</p>
          )}
        </>
      ) : (
        <div className="settings-list">
          <label>
            {t.language}
            <select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </label>

          <div className="setting-row">
            {t.sound}
            <button className="setting-button" onClick={onSound} disabled={soundUnavailable} aria-pressed={soundOn}>
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />} {soundOn ? t.mute : t.enableSound}
            </button>
          </div>

          <label>
            {language === 'hi' ? 'मुख्य आवाज़ (मास्टर)' : 'Master Volume'}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.masterVolume ?? 1.0}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
            />
          </label>

          <label>
            {language === 'hi' ? 'संगीत की आवाज़ (म्यूजिक)' : 'Music Volume'}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.musicVolume}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
            />
          </label>

          <label>
            {language === 'hi' ? 'ध्वनि प्रभाव (SFX)' : 'Sound Effects (SFX)'}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={(e) => setSfxVolume(Number(e.target.value))}
            />
          </label>

          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <button type="button" className="setting-button" onClick={handleTestSound} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Bell size={15} />
              {language === 'hi' ? 'घंटी बजाएँ (परीक्षण)' : 'Test Sound'}
            </button>
            <button type="button" className="setting-button" onClick={handleRestoreDefaults} style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title="Reset to Defaults">
              <RotateCcw size={14} />
              {language === 'hi' ? 'रीसेट' : 'Defaults'}
            </button>
          </div>

          <button className="save-button" onClick={() => setSaved(saveGame())}>
            <Save size={15} />
            {t.save}
          </button>
          {saved !== null && <p role="status">{saved ? t.saved : t.saveFailed}</p>}
        </div>
      )}

      <button className="resume-button" onClick={onClose}>
        {t.resume}
        <ArrowRight size={15} />
      </button>
    </GameDialog>
  )
}

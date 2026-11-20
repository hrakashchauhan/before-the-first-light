import { useEffect, useRef, useState } from 'react'
import { GameCanvas } from './game/GameCanvas'
import { SceneReadout, type SceneSample } from './game/SceneReadout'
import { VillageScene } from './world/VillageScene'
import { PlayerHUD } from './ui/hud/PlayerHUD'
import { DebugDrawer } from './ui/hud/DebugDrawer'
import { GameMenu } from './ui/hud/GameMenu'
import { HowToPlay } from './ui/hud/HowToPlay'
import { RouteMap } from './ui/hud/RouteMap'
import { DialogueBox } from './ui/dialogue/DialogueBox'
import { MovementClock, usePlayerMovement } from './systems/movement/usePlayerMovement'
import { useInteractionTargets } from './systems/interaction/useInteractionTargets'
import { getObjective, PLAYER_START, type WorldPosition } from './systems/interaction/household'
import { useGameStore } from './systems/quests/gameStore'
import { CANONICAL_DESTINATIONS } from './systems/destinations/destinationManager'
import { interfaceCopy } from './data/locales/interface'
import { useCourtyardSound } from './audio/useCourtyardSound'
import { audioManager } from './audio/AudioManager'
import type { WheatStage } from './objects/wheat/WheatDryingMat'
import './styles/tokens.css'
import './App.css'

const inspectEnabled = import.meta.env.DEV || new URLSearchParams(location.search).get('inspect') === '1'
type Menu = 'pause' | 'journal' | null

export default function App() {
  const store = useGameStore()
  const [menu, setMenu] = useState<Menu>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [previewClean, setPreviewClean] = useState<boolean | null>(null)
  const [previewWheat, setPreviewWheat] = useState<WheatStage | null>(null)
  const [goitha, setGoitha] = useState(8)
  const [showProps, setShowProps] = useState(true)
  const marker = useRef<HTMLDivElement>(null)
  const sample = useRef<SceneSample | null>(null)
  const blocked = Boolean(menu || showGuide || showMap || store.dialogueActive || store.isDebugOpen)
  const movement = usePlayerMovement(PLAYER_START, blocked)
  const nearest = useInteractionTargets(movement.position, store.interactWithTarget, blocked)
  const objective = getObjective(store.worldFlags, store.language)
  const sound = useCourtyardSound(Boolean(menu || store.isDebugOpen), store.settings.sfxVolume)
  const text = interfaceCopy[store.language]
  const wheat: WheatStage = store.worldFlags.wheat_sorted ? 'spread' : 'empty_mat'
  const inspected = store.isDebugOpen

  useEffect(() => { store.loadGame() }, [store.loadGame])
  useEffect(() => { document.documentElement.lang = store.language }, [store.language])

  // Clear transient warnings after 3 seconds
  useEffect(() => {
    if (!store.warningText) return
    const timer = setTimeout(() => store.setWarningText(null), 3200)
    return () => clearTimeout(timer)
  }, [store.warningText, store.setWarningText])

  const handleSoundToggle = () => {
    audioManager.init()
    if (!sound.enabled) {
      audioManager.playTrack('music_chhathi_maiya_bulaye')
    } else {
      audioManager.stopMusic()
    }
    sound.toggle()
  }

  const handleInteract = () => {
    if (blocked) return
    if (movement.isMounted) {
      movement.dismountBicycle()
      return
    }
    if (nearest?.id === 'prop_bicycle') {
      movement.mountBicycle()
      return
    }
    if (nearest) {
      store.interactWithTarget(nearest.id)
    }
  }

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return
      if (blocked || (event.target instanceof Element && event.target.closest('input, textarea, select'))) return
      const key = event.key.toLowerCase()
      if (key === 'escape' || key === 'j') {
        event.preventDefault()
        setMenu(key === 'j' ? 'journal' : 'pause')
      } else if (event.code === 'Backquote' && inspectEnabled) {
        event.preventDefault()
        store.toggleDebug()
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [blocked, store.toggleDebug])

  const handleTravel = (position: WorldPosition) => {
    movement.teleport(position)
    const matched = CANONICAL_DESTINATIONS.find(d => Math.hypot(d.position[0] - position[0], d.position[2] - position[2]) < 1.0)
    if (matched) {
      store.setCurrentDestination(matched.id)
    }
  }

  const markerTarget = blocked ? null : objective.targetId
  const projectedTarget = markerTarget === 'npc_mother' ? (store.language === 'en' ? 'Ma' : 'माँ') : null

  return <main className="game-container" data-player={inspectEnabled ? movement.position.join(',') : undefined}>
    <div className="canvas-wrapper" aria-label={text.courtyard}>
      <GameCanvas targetPosition={movement.position} zoomDistance={store.cameraZoomDistance} onZoomChange={store.setCameraZoom} paused={Boolean(menu)}>
        <MovementClock step={movement.step}/>
        <VillageScene courtyardCleaned={inspected ? previewClean ?? store.worldFlags.courtyard_cleaned : store.worldFlags.courtyard_cleaned}
          goithaCount={inspected ? goitha : 8} wheatStage={inspected ? previewWheat ?? wheat : wheat}
          showHouseholdProps={!inspected || showProps} playerPosition={movement.position} playerRotationY={movement.rotationY}
          isMoving={movement.isMoving} isMounted={movement.isMounted} bicycleState={movement.bicycleState}
          bicyclePosition={store.bicyclePosition}
          activeTargetId={nearest?.id} dialogueTargetId={store.dialogueTargetId}
          preparationGesture={store.preparationGesture} paused={Boolean(menu || inspected)}/>
        <SceneReadout marker={marker} target={markerTarget} sample={sample}/>
      </GameCanvas>
    </div>
    {markerTarget && <div ref={marker} className="world-marker" aria-hidden="true">{projectedTarget && <span>{projectedTarget}</span>}<i/></div>}
    <PlayerHUD language={store.language} objectiveTitle={objective.title} nearestTarget={blocked ? null : nearest}
      locationX={movement.position[0]} facing={movement.rotationY} zoom={store.cameraZoomDistance} soundOn={sound.enabled}
      soundUnavailable={sound.unavailable} isMounted={movement.isMounted} warningText={store.warningText}
      onZoom={store.setCameraZoom} onJournal={()=>setMenu('journal')} onGuide={()=>setShowGuide(true)} onMap={()=>setShowMap(true)} onPause={()=>setMenu('pause')}
      onSound={handleSoundToggle} onInteract={handleInteract} onDirection={movement.setDirectionHeld}/>
    {menu && <GameMenu mode={menu} objective={objective} x={movement.position[0]} soundOn={sound.enabled} soundUnavailable={sound.unavailable} onSound={handleSoundToggle} onClose={()=>setMenu(null)}/>}
    {showGuide && <HowToPlay language={store.language} objective={objective} onClose={()=>setShowGuide(false)}/>}
    {showMap && <RouteMap language={store.language} objective={objective} flags={store.worldFlags} timeOfDay={store.timeOfDay} onTravel={handleTravel} onClose={()=>setShowMap(false)}/>}
    {store.dialogueActive && store.dialogueSpeaker && store.dialogueText && <DialogueBox speaker={store.dialogueSpeaker} text={store.dialogueText} continueLabel={text.continue} onClose={store.closeDialogue}/>}
    {inspected && <DebugDrawer position={movement.position} zoom={store.cameraZoomDistance} sample={sample} clean={previewClean ?? store.worldFlags.courtyard_cleaned}
      onClean={setPreviewClean} wheat={previewWheat ?? wheat} onWheat={setPreviewWheat} goitha={goitha} onGoitha={setGoitha}
      showProps={showProps} onProps={setShowProps} onClose={store.toggleDebug}/>}
  </main>
}

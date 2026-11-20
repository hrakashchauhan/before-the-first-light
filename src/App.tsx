import { useEffect, useState } from 'react'
import { GameCanvas } from './game/GameCanvas'
import { VillageScene } from './world/VillageScene'
import { PlayerHUD } from './ui/hud/PlayerHUD'
import { DebugDrawer } from './ui/hud/DebugDrawer'
import { DialogueBox } from './ui/dialogue/DialogueBox'
import { usePlayerMovement } from './systems/movement/usePlayerMovement'
import { useInteractionTargets } from './systems/interaction/useInteractionTargets'
import { useGameStore } from './systems/quests/gameStore'
import { GAME_CONFIG } from './game/config'
import './styles/tokens.css'
import './App.css'

export default function App() {
  const store = useGameStore()
  const movement = usePlayerMovement([0, 0, 1.8])

  // Custom debug override states (or default to store state)
  const [debugGoitha, setDebugGoitha] = useState(8)
  const [debugWheat, setDebugWheat] = useState<'empty_mat' | 'sorting' | 'spread'>('spread')

  // Auto-load saved progress on startup
  useEffect(() => {
    store.loadGame()
  }, [])

  // Proximity interactable detection
  const nearestTarget = useInteractionTargets(movement.position, (targetId) => {
    store.interactWithTarget(targetId)
  })

  // Determine active objective copy based on game state
  const isCourtyardCleaned = store.worldFlags.courtyard_cleaned
  const isWheatSorted = store.worldFlags.wheat_sorted

  let activeTitle = 'Sanctify the Courtyard'
  let activeDesc = 'Take the broom near the veranda and sweep the courtyard clean.'

  if (isCourtyardCleaned && !isWheatSorted) {
    activeTitle = 'Spread the Sacred Wheat'
    activeDesc = 'Inspect the woven drying mat and lay out the wheat to dry in the sun.'
  } else if (isWheatSorted) {
    activeTitle = 'Prepare for the Holy Eve'
    activeDesc = 'Speak with Ma on the veranda to plan the festival offerings.'
  }

  // Camera Zoom actions
  const handleZoomIn = () => {
    store.setCameraZoom(Math.max(GAME_CONFIG.camera.minDistance, store.cameraZoomDistance - 1.5))
  }
  const handleZoomOut = () => {
    store.setCameraZoom(Math.min(GAME_CONFIG.camera.maxDistance, store.cameraZoomDistance + 1.5))
  }
  const handleZoomReset = () => {
    store.setCameraZoom(GAME_CONFIG.camera.defaultDistance)
  }

  return (
    <div className="game-container">
      {/* 3D Scene Viewport with Camera Tracking & Controllable Zoom */}
      <div className="canvas-wrapper">
        <GameCanvas
          targetPosition={movement.position}
          zoomDistance={store.cameraZoomDistance}
          onZoomChange={store.setCameraZoom}
        >
          <VillageScene
            courtyardCleaned={isCourtyardCleaned}
            goithaCount={debugGoitha}
            wheatStage={isWheatSorted ? 'spread' : isCourtyardCleaned ? debugWheat : 'empty_mat'}
            playerPosition={movement.position}
            playerRotationY={movement.rotationY}
            isMoving={movement.isMoving}
            activeTargetId={nearestTarget ? nearestTarget.id : null}
          />
        </GameCanvas>
      </div>

      {/* Atmospheric Player Game HUD */}
      <PlayerHUD
        activeQuestTitle={activeTitle}
        activeQuestDesc={activeDesc}
        nearestTarget={nearestTarget}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onToggleDebug={store.toggleDebug}
        onInteract={() => {
          if (nearestTarget) store.interactWithTarget(nearestTarget.id)
        }}
      />

      {/* Story Dialogue Box (Modal on interaction) */}
      {store.dialogueActive && store.dialogueSpeaker && store.dialogueText && (
        <DialogueBox
          speaker={store.dialogueSpeaker}
          text={store.dialogueText}
          onClose={store.closeDialogue}
        />
      )}

      {/* Developer Debug Drawer (Hidden by default; toggled via 'Dev' button) */}
      <DebugDrawer
        isOpen={store.isDebugOpen}
        onClose={store.toggleDebug}
        courtyardCleaned={isCourtyardCleaned}
        onToggleCleaned={store.sweepCourtyard}
        wheatStage={debugWheat}
        onCycleWheat={() =>
          setDebugWheat((prev) =>
            prev === 'empty_mat' ? 'sorting' : prev === 'sorting' ? 'spread' : 'empty_mat'
          )
        }
        goithaCount={debugGoitha}
        onCycleGoitha={() => setDebugGoitha((prev) => (prev >= 12 ? 4 : prev + 4))}
        playerPosition={movement.position}
        cameraZoom={store.cameraZoomDistance}
        onResetGame={store.resetGame}
        onSaveGame={store.saveGame}
      />
    </div>
  )
}

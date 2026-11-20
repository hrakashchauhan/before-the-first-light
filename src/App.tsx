import { useState } from 'react'
import { GameCanvas } from './game/GameCanvas'
import { VillageScene } from './world/VillageScene'
import { Sparkles, Sun, CheckCircle2, RefreshCw } from 'lucide-react'
import './styles/tokens.css'
import './App.css'

export default function App() {
  const [courtyardCleaned, setCourtyardCleaned] = useState(false)
  const [goithaCount, setGoithaCount] = useState(8)
  const [wheatStage, setWheatStage] = useState<'empty_mat' | 'sorting' | 'spread'>('spread')

  const cycleWheat = () => {
    setWheatStage(current => {
      if (current === 'empty_mat') return 'sorting'
      if (current === 'sorting') return 'spread'
      return 'empty_mat'
    })
  }

  const cycleGoitha = () => {
    setGoithaCount(prev => (prev >= 12 ? 4 : prev + 4))
  }

  return (
    <div className="game-container">
      {/* 3D Scene Viewport */}
      <div className="canvas-wrapper">
        <GameCanvas>
          <VillageScene
            courtyardCleaned={courtyardCleaned}
            goithaCount={goithaCount}
            wheatStage={wheatStage}
          />
        </GameCanvas>
      </div>

      {/* Accessible HUD Overlay */}
      <header className="hud-header">
        <div className="title-block">
          <span className="badge">
            <Sun size={14} className="icon-badge" /> Chapter: Homecoming
          </span>
          <h1>BEFORE THE FIRST LIGHT</h1>
          <p className="tagline">A living village. Sixty days of preparation. One sunrise.</p>
        </div>

        <div className="milestone-badge">
          <span className="active-dot"></span>
          <span>M01 & M02 Vertical Slice Active</span>
        </div>
      </header>

      {/* Interactive Controls & Verification Panel */}
      <footer className="hud-footer">
        <div className="hud-card">
          <div className="hud-card-header">
            <Sparkles size={16} color="#ffbe76" />
            <h2>Courtyard World State Verification</h2>
          </div>
          <p className="hud-desc">
            All structures and props are real procedural Three.js geometry. Test reactive world changes below:
          </p>

          <div className="controls-row">
            <button
              type="button"
              className={`action-btn ${courtyardCleaned ? 'btn-active' : ''}`}
              onClick={() => setCourtyardCleaned(prev => !prev)}
            >
              <CheckCircle2 size={16} />
              {courtyardCleaned ? 'Yard: Freshly Swept' : 'Yard: Unswept Earth'}
            </button>

            <button
              type="button"
              className="action-btn"
              onClick={cycleWheat}
            >
              <RefreshCw size={16} />
              Wheat: {wheatStage === 'spread' ? 'Spread in Sun' : wheatStage === 'sorting' ? 'Being Sorted' : 'Empty Mat'}
            </button>

            <button
              type="button"
              className="action-btn"
              onClick={cycleGoitha}
            >
              <Sun size={16} />
              Goitha Cakes: {goithaCount} on Wall
            </button>
          </div>

          <div className="spec-row">
            <span>• Wall Thickness: 0.35m</span>
            <span>• Real Procedural Chulha & Soop</span>
            <span>• Instanced Grain Mesh</span>
            <span>• Zero Image Planes</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

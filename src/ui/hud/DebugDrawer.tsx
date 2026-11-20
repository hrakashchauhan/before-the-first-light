import { X, RefreshCw, CheckCircle2, RotateCcw, Save } from 'lucide-react'

interface DebugDrawerProps {
  isOpen: boolean
  onClose: () => void
  courtyardCleaned: boolean
  onToggleCleaned: () => void
  wheatStage: 'empty_mat' | 'sorting' | 'spread'
  onCycleWheat: () => void
  goithaCount: number
  onCycleGoitha: () => void
  playerPosition: [number, number, number]
  cameraZoom: number
  onResetGame: () => void
  onSaveGame: () => void
}

export function DebugDrawer({
  isOpen,
  onClose,
  courtyardCleaned,
  onToggleCleaned,
  wheatStage,
  onCycleWheat,
  goithaCount,
  onCycleGoitha,
  playerPosition,
  cameraZoom,
  onResetGame,
  onSaveGame,
}: DebugDrawerProps) {
  if (!isOpen) return null

  return (
    <aside className="debug-drawer-panel" aria-label="Developer Debug Panel">
      <div className="debug-drawer-header">
        <h3>Developer Inspection Panel</h3>
        <button type="button" className="debug-close-btn" onClick={onClose} aria-label="Close Debug Panel">
          <X size={16} />
        </button>
      </div>

      <div className="debug-section">
        <span className="debug-label">World Coordinates & Camera</span>
        <div className="debug-metric-grid">
          <div>
            <span className="metric-tag">Player X</span>
            <span className="metric-val">{playerPosition[0].toFixed(2)}</span>
          </div>
          <div>
            <span className="metric-tag">Player Z</span>
            <span className="metric-val">{playerPosition[2].toFixed(2)}</span>
          </div>
          <div>
            <span className="metric-tag">Camera Zoom</span>
            <span className="metric-val">{cameraZoom.toFixed(1)}m</span>
          </div>
        </div>
      </div>

      <div className="debug-section">
        <span className="debug-label">World State Overrides</span>
        <div className="debug-btn-stack">
          <button
            type="button"
            className={`debug-action-btn ${courtyardCleaned ? 'active' : ''}`}
            onClick={onToggleCleaned}
          >
            <CheckCircle2 size={14} />
            <span>Yard: {courtyardCleaned ? 'Swept Limewash' : 'Unswept Soil'}</span>
          </button>

          <button
            type="button"
            className="debug-action-btn"
            onClick={onCycleWheat}
          >
            <RefreshCw size={14} />
            <span>Wheat: {wheatStage}</span>
          </button>

          <button
            type="button"
            className="debug-action-btn"
            onClick={onCycleGoitha}
          >
            <RefreshCw size={14} />
            <span>Goitha Cakes: {goithaCount}</span>
          </button>
        </div>
      </div>

      <div className="debug-section">
        <span className="debug-label">Persistence & Memory</span>
        <div className="debug-btn-row">
          <button type="button" className="debug-btn-save" onClick={onSaveGame}>
            <Save size={14} />
            <span>Save to LocalStorage</span>
          </button>
          <button type="button" className="debug-btn-reset" onClick={onResetGame}>
            <RotateCcw size={14} />
            <span>Reset Save</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

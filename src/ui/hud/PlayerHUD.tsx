import { ZoomIn, ZoomOut, RotateCcw, Wrench, CheckCircle, Sparkles } from 'lucide-react'
import type { Interactable } from '../../systems/interaction/useInteractionTargets'

interface PlayerHUDProps {
  activeQuestTitle: string
  activeQuestDesc: string
  nearestTarget: Interactable | null
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onToggleDebug: () => void
  onInteract: () => void
}

export function PlayerHUD({
  activeQuestTitle,
  activeQuestDesc,
  nearestTarget,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToggleDebug,
  onInteract,
}: PlayerHUDProps) {
  return (
    <div className="player-hud-overlay">
      {/* 1. Top Left: Clean Atmospheric Chapter & Objective Header */}
      <header className="hud-top-left">
        <div className="hud-chapter-pill">
          <span className="chapter-dot"></span>
          <span>Chapter 1: The Homecoming</span>
        </div>
        <div className="hud-objective-pill">
          <div className="objective-icon-wrap">
            <CheckCircle size={15} color="#2ed573" />
          </div>
          <div className="objective-content">
            <span className="objective-title">{activeQuestTitle}</span>
            <span className="objective-desc">{activeQuestDesc}</span>
          </div>
        </div>
      </header>

      {/* 2. Top Right: Camera Zoom Controls & Dev Mode Toggle */}
      <nav className="hud-top-right">
        <div className="camera-controls-group">
          <button
            type="button"
            className="hud-tool-btn"
            onClick={onZoomIn}
            title="Zoom In (+ / Wheel Up)"
            aria-label="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            type="button"
            className="hud-tool-btn"
            onClick={onZoomOut}
            title="Zoom Out (- / Wheel Down)"
            aria-label="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            type="button"
            className="hud-tool-btn"
            onClick={onZoomReset}
            title="Reset Camera (0)"
            aria-label="Reset Camera"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        <button
          type="button"
          className="hud-tool-btn dev-toggle-btn"
          onClick={onToggleDebug}
          title="Toggle Developer Debug Mode (~)"
          aria-label="Developer Mode"
        >
          <Wrench size={15} />
          <span className="dev-btn-label">Dev</span>
        </button>
      </nav>

      {/* 3. Bottom Center: Contextual Interaction Prompt (Only when target is near!) */}
      {nearestTarget && (
        <div className="hud-prompt-container">
          <button
            type="button"
            className="hud-interaction-prompt"
            onClick={onInteract}
          >
            <span className="key-badge">E</span>
            <span className="prompt-action-text">{nearestTarget.actionName}</span>
            <Sparkles size={14} className="prompt-sparkle" />
          </button>
        </div>
      )}

      {/* Subtle Controls Hint at bottom left */}
      <div className="hud-controls-hint">
        <span>WASD / Arrow Keys to Walk</span>
        <span>•</span>
        <span>Mouse Wheel to Zoom</span>
      </div>
    </div>
  )
}

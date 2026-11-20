import { useState } from 'react'
import './App.css'

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <div className="foundation-container">
      <header className="foundation-header">
        <span className="badge">Project Foundation</span>
        <h1>BEFORE THE FIRST LIGHT</h1>
        <p className="tagline">A living village. Sixty days of preparation. One sunrise.</p>
      </header>

      <main className="foundation-main">
        <div className="status-card">
          <h2>Phase 1–5 Status: Verified</h2>
          <ul>
            <li><strong>Engine Stack:</strong> React 19.3 + TypeScript + Vite 8</li>
            <li><strong>3D Framework:</strong> Three.js + React Three Fiber v9 + Drei</li>
            <li><strong>State & Validation:</strong> Zustand 5 + Zod 4</li>
            <li><strong>Utilities:</strong> GSAP, Howler, Lucide React</li>
            <li><strong>Schemas:</strong> Strict TimeOfDay, GameSettings, GameSaveV1 aligned</li>
          </ul>
          <div className="status-indicator">
            <button
              type="button"
              className="test-btn"
              onClick={() => setReady(prev => !prev)}
            >
              {ready ? 'Verified Active' : 'Test React 19 Interactivity'}
            </button>
            {ready && <p className="success-text">React 19 state & event loop responsive</p>}
          </div>
        </div>

        <p className="notice">
          Awaiting approval to begin <strong>Milestone M01 / Prompt 03</strong>: First 3D Renderer Vertical Slice.
        </p>
      </main>
    </div>
  )
}

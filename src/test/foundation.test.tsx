import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import App from '../App'
import type { GameEventMap } from '../../schemas/events'
import type { GameSaveV1 } from '../../schemas/game-state'

describe('Foundation Acceptance Tests', () => {
  it('renders application title and status header', () => {
    render(<App />)
    expect(screen.getByText('BEFORE THE FIRST LIGHT')).toBeInTheDocument()
    expect(screen.getByText(/A living village\. Sixty days of preparation\. One sunrise\./i)).toBeInTheDocument()
  })

  it('validates game event map structure typing', () => {
    const sampleEventPayload: GameEventMap['settings:changed'] = {
      settings: {
        musicVolume: 0.8,
        subtitles: true
      }
    }
    expect(sampleEventPayload.settings.musicVolume).toBe(0.8)
  })

  it('validates GameSaveV1 schema contract', () => {
    const saveBaseline: GameSaveV1 = {
      schemaVersion: 1,
      chapterId: 'homecoming',
      timeOfDay: 'morning',
      language: 'en',
      activeQuestId: 'q_arrival_talk',
      completedQuestIds: [],
      inventory: [],
      worldFlags: { hasMetFamily: false },
      settings: {
        musicVolume: 1,
        sfxVolume: 1,
        subtitles: true
      }
    }
    expect(saveBaseline.schemaVersion).toBe(1)
    expect(saveBaseline.activeQuestId).toBe('q_arrival_talk')
  })
})

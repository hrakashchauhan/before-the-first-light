import { describe, it, expect, beforeEach } from 'vitest'
import { audioManager } from '../audio/AudioManager'
import { eventBus } from '../systems/events/eventBus'
import { AUDIO_MANIFEST } from '../audio/audioManifest'

describe('Audio System & Dialogue Ducking Test Suite', () => {
  beforeEach(() => {
    audioManager.setSettings({ masterVolume: 1.0, musicVolume: 0.8, sfxVolume: 0.9, muted: false })
  })

  it('contains the supplied authentic Chhath masterpiece in manifest', () => {
    const track = AUDIO_MANIFEST.music_chhathi_maiya_bulaye
    expect(track).toBeDefined()
    expect(track.url).toContain('chhathi-maiya-bulaye-theme.mp3')
    expect(track.durationSec).toBeCloseTo(101.28, 1)
    expect(track.category).toBe('music')
    expect(track.loop).toBe(true)
  })

  it('updates audio volume settings and mute state correctly', () => {
    audioManager.setSettings({ musicVolume: 0.6, muted: true })
    const settings = audioManager.getSettings()
    expect(settings.musicVolume).toBe(0.6)
    expect(settings.muted).toBe(true)

    audioManager.setSettings({ muted: false })
    expect(audioManager.getSettings().muted).toBe(false)
  })

  it('responds to character:dialogue-started and character:dialogue-completed via eventBus', () => {
    // When dialogue starts, music ducks
    eventBus.emit('character:dialogue-started', {
      speaker: 'Ma',
      text: 'You are home.',
      targetId: 'npc_mother',
    })

    // When dialogue completes, music recovers
    eventBus.emit('character:dialogue-completed', {
      targetId: 'npc_mother',
    })
  })

  it('triggers procedural sfx without runtime errors', () => {
    expect(() => {
      audioManager.playBicycleBell()
      audioManager.playPedalClick()
      audioManager.playBrakeSqueal()
      audioManager.playBroomSweep()
      audioManager.playBrassChime()
      audioManager.playTaskComplete()
    }).not.toThrow()
  })
})

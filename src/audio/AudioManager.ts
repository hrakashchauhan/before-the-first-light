import { Howl } from 'howler'
import { AUDIO_MANIFEST } from './audioManifest'
import { eventBus } from '../systems/events/eventBus'

export interface AudioSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  ambienceVolume: number
  muted: boolean
}

class AudioManagerClass {
  private audioCtx: AudioContext | null = null
  private currentHowl: Howl | null = null
  private currentTrackId: string | null = null
  private isDucked = false
  private isUnlocked = false

  private settings: AudioSettings = {
    masterVolume: 1.0,
    musicVolume: 0.8,
    sfxVolume: 0.9,
    ambienceVolume: 0.7,
    muted: false,
  }

  constructor() {
    this.setupEventListeners()
  }

  public init() {
    if (this.isUnlocked) return
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass()
        if (this.audioCtx.state === 'suspended') {
          void this.audioCtx.resume()
        }
      }
      this.isUnlocked = true
    } catch {
      // AudioContext unavailable; fallback silently
    }
  }

  private setupEventListeners() {
    eventBus.on('character:dialogue-started', () => {
      this.duckMusic(true)
    })

    eventBus.on('character:dialogue-completed', () => {
      this.duckMusic(false)
    })

    eventBus.on('audio:music-transition', ({ trackId, fadeMs }) => {
      this.playTrack(trackId, fadeMs ?? 1000)
    })

    eventBus.on('audio:play', ({ soundId, channel }) => {
      if (channel === 'sfx') {
        this.triggerSfx(soundId)
      } else if (channel === 'music') {
        this.playTrack(soundId)
      }
    })
  }

  public setSettings(newSettings: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...newSettings }
    this.applyMusicVolume()
  }

  public getSettings(): AudioSettings {
    return { ...this.settings }
  }

  private getEffectiveMusicVolume(): number {
    if (this.settings.muted) return 0
    const base = this.settings.masterVolume * this.settings.musicVolume
    return this.isDucked ? base * 0.25 : base
  }

  private applyMusicVolume() {
    if (this.currentHowl) {
      const targetVol = this.getEffectiveMusicVolume()
      this.currentHowl.volume(targetVol)
    }
  }

  public duckMusic(duck: boolean) {
    this.isDucked = duck
    if (!this.currentHowl) return

    const targetVol = this.getEffectiveMusicVolume()
    const currentVol = this.currentHowl.volume() as number
    const duration = duck ? 350 : 800
    this.currentHowl.fade(currentVol, targetVol, duration)
  }

  public playTrack(trackId: string, fadeMs = 1200) {
    this.init()
    if (this.currentTrackId === trackId && this.currentHowl?.playing()) {
      return
    }

    const config = AUDIO_MANIFEST[trackId] ?? AUDIO_MANIFEST.music_chhathi_maiya_bulaye
    if (!config) return

    const targetVolume = this.getEffectiveMusicVolume() * config.baseVolume

    if (this.currentHowl) {
      const prevHowl = this.currentHowl
      prevHowl.fade(prevHowl.volume() as number, 0, fadeMs)
      setTimeout(() => {
        prevHowl.stop()
        prevHowl.unload()
      }, fadeMs + 100)
    }

    try {
      this.currentTrackId = trackId
      this.currentHowl = new Howl({
        src: [config.url],
        html5: true, // HTML5 audio streaming for MP3
        loop: config.loop,
        volume: 0,
        onloaderror: (_, err) => {
          console.warn('[AudioManager] Failed to load track:', config.url, err)
        },
      })

      this.currentHowl.play()
      this.currentHowl.fade(0, targetVolume, fadeMs)
    } catch (e) {
      console.warn('[AudioManager] Error instantiating music track:', e)
    }
  }

  public stopMusic(fadeMs = 800) {
    if (this.currentHowl) {
      this.currentHowl.fade(this.currentHowl.volume() as number, 0, fadeMs)
      setTimeout(() => {
        this.currentHowl?.stop()
        this.currentHowl = null
        this.currentTrackId = null
      }, fadeMs + 50)
    }
  }

  // === PROCEDURAL WEB AUDIO SFX ===

  public playBicycleBell() {
    this.init()
    const ctx = this.audioCtx
    if (!ctx || this.settings.muted || this.settings.sfxVolume <= 0) return

    const now = ctx.currentTime
    const masterGain = ctx.createGain()
    masterGain.gain.value = this.settings.masterVolume * this.settings.sfxVolume * 0.45
    masterGain.connect(ctx.destination)

    // Classic double brass ping (ding-ding)
    const pings = [0, 0.12]
    for (const delay of pings) {
      const t = now + delay
      // Fundamental 2400 Hz + harmonic 2880 Hz
      for (const freq of [2400, 2880]) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, t)
        gain.gain.setValueAtTime(0.0001, t)
        gain.gain.exponentialRampToValueAtTime(0.4, t + 0.008)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28)
        osc.connect(gain)
        gain.connect(masterGain)
        osc.start(t)
        osc.stop(t + 0.3)
      }
    }
  }

  public playPedalClick() {
    this.init()
    const ctx = this.audioCtx
    if (!ctx || this.settings.muted || this.settings.sfxVolume <= 0) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(3200, now)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.02)
    gain.gain.setValueAtTime(this.settings.masterVolume * this.settings.sfxVolume * 0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.025)
  }

  public playBrakeSqueal() {
    this.init()
    const ctx = this.audioCtx
    if (!ctx || this.settings.muted || this.settings.sfxVolume <= 0) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(1450, now)
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.18)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.linearRampToValueAtTime(this.settings.masterVolume * this.settings.sfxVolume * 0.12, now + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.22)
  }

  public playBroomSweep() {
    this.init()
    const ctx = this.audioCtx
    if (!ctx || this.settings.muted || this.settings.sfxVolume <= 0) return

    const now = ctx.currentTime
    // Filtered noise sweep
    const bufferSize = ctx.sampleRate * 0.22
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(850, now)
    filter.Q.value = 1.8

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(this.settings.masterVolume * this.settings.sfxVolume * 0.22, now + 0.06)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
    noise.stop(now + 0.22)
  }

  public playBrassChime() {
    this.init()
    const ctx = this.audioCtx
    if (!ctx || this.settings.muted || this.settings.sfxVolume <= 0) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1650, now)
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(this.settings.masterVolume * this.settings.sfxVolume * 0.35, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.95)
  }

  public playTaskComplete() {
    this.init()
    const ctx = this.audioCtx
    if (!ctx || this.settings.muted || this.settings.sfxVolume <= 0) return

    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.08
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.linearRampToValueAtTime(this.settings.masterVolume * this.settings.sfxVolume * 0.25, t + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.4)
    })
  }

  public triggerSfx(sfxId: string) {
    switch (sfxId) {
      case 'bell':
      case 'bicycle_bell':
        this.playBicycleBell()
        break
      case 'pedal':
        this.playPedalClick()
        break
      case 'brake':
        this.playBrakeSqueal()
        break
      case 'sweep':
        this.playBroomSweep()
        break
      case 'brass':
      case 'lota':
        this.playBrassChime()
        break
      case 'task_complete':
      case 'complete':
        this.playTaskComplete()
        break
      default:
        break
    }
  }
}

export const audioManager = new AudioManagerClass()

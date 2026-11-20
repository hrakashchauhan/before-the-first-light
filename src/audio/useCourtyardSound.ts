import { useCallback, useEffect, useRef, useState } from 'react'

export function useCourtyardSound(paused: boolean, volume: number) {
  const context = useRef<AudioContext | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const toggle = useCallback(async () => {
    if (enabled) { setEnabled(false); return }
    try {
      context.current ??= new AudioContext()
      await context.current.resume()
      setEnabled(true)
    } catch { setUnavailable(true) }
  }, [enabled])
  useEffect(() => () => { void context.current?.close(); context.current = null }, [])
  useEffect(() => {
    const ac = context.current
    if (!ac || !enabled || paused || volume <= 0) return
    const bus = ac.createGain()
    bus.gain.value = Math.min(1, volume) * 0.055
    bus.connect(ac.destination)
    let phrase = 0
    function call() {
      if (!ac || document.hidden) return
      const start = ac.currentTime + 0.03
      const pitch = [1850, 2310, 2050][phrase++ % 3]
      for (const [delay, scale] of [[0,1],[0.21,1.13],[0.39,0.94]]) {
        const sound = ac.createOscillator(), gain = ac.createGain(), t = start + delay
        sound.frequency.setValueAtTime(pitch * scale, t)
        sound.frequency.exponentialRampToValueAtTime(pitch * scale * 1.27, t + 0.07)
        sound.frequency.exponentialRampToValueAtTime(pitch * scale * 0.91, t + 0.14)
        gain.gain.setValueAtTime(0.0001, t)
        gain.gain.exponentialRampToValueAtTime(0.52, t + 0.035)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.15)
        sound.connect(gain).connect(bus)
        sound.start(t)
        sound.stop(t + 0.16)
        sound.onended = () => { sound.disconnect(); gain.disconnect() }
      }
    }
    call()
    const timer = window.setInterval(call, 5900)
    return () => { window.clearInterval(timer); bus.disconnect() }
  }, [enabled, paused, volume])
  return { enabled, unavailable, toggle }
}

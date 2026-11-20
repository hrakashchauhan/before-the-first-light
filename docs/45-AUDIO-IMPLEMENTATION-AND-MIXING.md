# 45 — Audio Implementation and Mixing Architecture

**Project:** BEFORE THE FIRST LIGHT  
**Date:** 2026-11-21  
**Author:** Audio & Cinematic Designer (Expert 08), Chief Technical Architect (Expert 01)

---

## 1. Central Audio Architecture

The game utilizes a hybrid audio engine combining **Howler.js** for high-fidelity stream decoding of the supplied master track (`chhathi-maiya-bulaye-theme.mp3`) and the **Web Audio API** for real-time procedural sound effects, spatial panning, filter sweeps, and automatic dialogue ducking.

```
       +---------------------------------------------+
       |               User Interaction              |
       |     (Gesture Unlock for AudioContext)       |
       +---------------------------------------------+
                              |
       +---------------------------------------------+
       |           AudioManager (Authoritative)      |
       +---------------------------------------------+
           |                 |                     |
     [Music Bus]       [Ambience Bus]         [SFX Bus]
           |                 |                     |
   Howler Master     Web Audio Procedural   Web Audio Procedural
   (Supplied Track)   (Birds, Breeze, Pond) (Bell, Pedal, Broom)
           |                 |                     |
     [Ducker Node] <---------+                     |
     (Smooth Gain            |                     |
      Ducking -12dB)         |                     |
           \                 |                    /
            \                |                   /
             +---------------+------------------+
                             |
                   AudioContext Destination
```

---

## 2. Dynamic Dialogue Ducking

When any character dialogue begins (`character:dialogue-started`), the music volume smoothly drops to preserve speech intelligibility:
- **Attack Time:** 350 ms (exponential curve)
- **Duck Volume:** 25% of user-configured master music volume (-12 dB)
- **Release Time:** 800 ms (linear ramp up)
- **Trigger:** Listeners on `eventBus` for `'character:dialogue-started'` and `'character:dialogue-completed'`.

---

## 3. Procedural Sound Effects (Zero External Asset Dependency)

To avoid heavy asset bundles or missing external WAV files, signature village and bicycle sound effects are synthesized via procedural Web Audio nodes:
1. **Bicycle Bell (`playBicycleBell()`):** Dual sinusoidal harmonics (2,400 Hz and 2,880 Hz) with a sharp attack (<5 ms) and exponential decay (320 ms) recreating the resonant ping of a classic brass bicycle bell.
2. **Pedal & Chain Ticking (`playPedalClick()`):** High-pass filtered band-limited click (4,200 Hz, 18 ms) pulsed in sync with wheel rotation.
3. **Tyre Road Rolling (`setTyreRolling(speed)`):** Pink noise filtered through a low-pass biquad (cutoff modulated by bicycle speed between 180 Hz and 650 Hz).
4. **Broom Sweeping (`playBroomSweep()`):** Filtered white noise with an envelope mimicking the rhythmic brushing of dried grass brooms against earthen courtyard floors.
5. **Brass Thali / Lota Clink (`playBrassChime()`):** High-Q resonant chime at 1,650 Hz with 1.2s sustain.

---

## 4. Volume Groups & Persistence

All volume levels are stored in the authoritative Zustand store and synchronized to `localStorage`:
- Master Music Volume (0.0 to 1.0, default 0.8)
- Ambience Volume (0.0 to 1.0, default 0.7)
- SFX Volume (0.0 to 1.0, default 0.9)
- Dialogue / Voice Volume (0.0 to 1.0, default 1.0)
- Mute State (boolean)

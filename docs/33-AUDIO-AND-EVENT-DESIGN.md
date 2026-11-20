# 33 — Audio and Event System Design

**PROJECT:** BEFORE THE FIRST LIGHT  
**AUTHOR:** Audio & Cinematic Designer (Expert 08) & Chief Technical Architect (Expert 01)  
**DATE:** 2026-11-21  
**STATUS:** Typed Audio & Event Architecture  

---

## 1. Typed Event Architecture

To decouple the UI, gameplay simulation, 3D renderer, camera, audio, and cinematic systems, the game employs a strictly typed pub/sub Event Bus.

```typescript
export interface TypedGameEvents {
  // Destination & Journey
  'journey:destination-arrived': { destinationId: string; previousDestinationId: string | null }
  'journey:destination-completed': { destinationId: string }
  'journey:destination-unlocked': { destinationId: string }

  // Quest Lifecycle
  'quest:started': { questId: string }
  'quest:objective-completed': { questId: string; flag: string }
  'quest:completed': { questId: string }

  // Character & Interaction
  'character:dialogue-started': { characterId: string; speaker: string; text: string }
  'character:dialogue-completed': { characterId: string }
  'player:item-collected': { itemId: string }
  'player:interacted': { targetId: string }

  // World & Timeline
  'world:state-changed': { flag: string; value: boolean }
  'timeline:chapter-changed': { chapterId: string; previousChapterId: string }
  'timeline:phase-changed': { timeOfDay: string }

  // Festival Progression
  'festival:stage-started': { stage: string }
  'festival:stage-completed': { stage: string }

  // Audio & Cinematics
  'audio:music-transition': { trackId: string; fadeMs?: number }
  'audio:ambience-changed': { ambienceId: string }
  'audio:sfx-triggered': { sfxId: string }
  'cinematic:started': { cinematicId: string }
  'cinematic:completed': { cinematicId: string }

  // Persistence
  'save:completed': { timestamp: number; chapterId: string }
  'save:loaded': { chapterId: string }
}
```

---

## 2. Event Dispatching & Safety Rules

1. **Deterministic Execution:** Listeners are executed in order of subscription.
2. **Circular Call Prevention:** Event handlers must not fire mutually triggering events within the same synchronous tick.
3. **Idempotent State Updates:** Handlers mutate state through authoritative store actions rather than direct object manipulation.
4. **Clean Listener Teardown:** All subscriptions return an unbind callback and are registered in React effect cleanups to prevent memory leaks.

---

## 3. Dynamic Audio Engine & Layering

Audio evolves dynamically based on the current chapter, time of day, and active destination hub:

| Phase / Destination | Musical Theme | Ambient Layer | Signature SFX |
|---|---|---|---|
| **Homecoming & Courtyard** | Gentle plucked santur & bansuri motif (warm, domestic) | Morning village birds, distant handpump metallic clank, soft breeze | Grass broom brushing dry leaves, dry wheat grain rustle on mat |
| **Village Lane & Artisan** | Rhythmic acoustic drone, rustic tanpura | Bamboo grove wind rustle, distant village voices | Bamboo knife peeling green canes, splitting strips, basket tapping |
| **Village Commons / Market** | Lively folk percussion (dholak, manjira undertones) | Cattle bells, footsteps on dry earth, vendor greetings | Earthen pot clink, brass vessel ring |
| **Ghat (Sandhya Arghya)** | Reflective, swelling strings, solemn evening prayer tone | Gentle water lapping on brick steps, evening cicadas | Diya flame flicker, brass thali chime |
| **Ghat (Night Before Dawn)** | Low ambient pads, solitary flute notes | Night crickets, cool night breeze across open water | Distant conch shell call |
| **Ghat (Usha Arghya Climax)** | Full melodic crescendo; uplifting sunrise raga (Bhairav-inspired) | Morning river mist, rising flock of herons, gentle waves | Sacred water offering splash, bell chime |
| **Parana Epilogue** | Warm, resolved acoustic celebration; familial harmony | Morning village life resumed, children laughing, warmth | Prasad sharing acknowledgement, deep bell resonance |

### Audio Compliance & Rights
- **Procedural & Synthesized Fallback:** In environments where external audio files cannot load or user gesture is pending, Web Audio API synthesis generates soft binaural drone chords and soothing white-noise filtered rustles.
- **Copyright Clearance:** Zero unlicensed commercial recordings; all authored stems and procedural generators adhere to open creative standards.

# 36 — Full Game Acceptance and Verification Plan

**PROJECT:** BEFORE THE FIRST LIGHT  
**AUTHOR:** Independent QA and Red-Team Reviewer (Expert 10)  
**DATE:** 2026-11-21  
**STATUS:** Master Verification Protocol  

---

## 1. Acceptance Criteria Matrix

| Subsystem | Requirement | Pass Condition | Verification Method |
|---|---|---|---|
| **World Geometry** | Authentic procedural 3D meshes | Zero 2D photo planes or AI texture billboards; valid Three.js geometries. | Automated test & visual inspection |
| **Destination Progression** | State machine transitions | Hubs cycle `locked` -> `available` -> `active` -> `completed` -> `revisited`. | Unit & integration tests |
| **Quest Engine** | Authoritative state mutations | Quests advance solely via verified interactions; zero state duplication. | Vitest test suite |
| **Typed Events** | Decoupled event bus | All 18 canonical game events dispatch with valid payloads; zero listener leaks. | Vitest event test suite |
| **YAML Configuration** | Strict schema validation | All 8 config files pass Zod schema validation at build and runtime. | Zod parsing test |
| **Save/Load Persistence** | Versioned localStorage | Save safely serializes/deserializes schema v1; stale saves auto-heal. | Save recovery test |
| **Bilingual Localisation** | Complete EN/HI parity | Every UI label, dialogue beat, and quest objective has valid English and Hindi strings. | Translation coverage test |
| **Performance & Budget** | Framerate & memory | Production build compiles cleanly; frame rate >= 30 FPS; draw calls <= 50. | Vite build & Lighthouse/Playwright |

---

## 2. Red-Team Probing & Resilience Gates

1. **Boundary Clipping Probe:** Verify that player cannot walk through mud walls, plunge into deep water beyond the safe ghat steps, or fall off the world boundary.
2. **Quest Re-entrance Probe:** Verify that rapid double-pressing [E] or re-talking to completed NPCs does not duplicate items or break quest sequence.
3. **Storage Corruption Probe:** Verify that corrupted JSON or unexpected values in `localStorage` trigger clean reset to default without crashing the React root.
4. **Offline / Audio-Blocked Probe:** Verify that if browser autoplay policies block Web Audio, the game remains fully playable with a visual sound indicator.

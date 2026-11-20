# 28 — Complete Game Design Document: Before the First Light

**PROJECT:** BEFORE THE FIRST LIGHT  
**TAGLINE:** A living village. Sixty days of preparation. One sunrise.  
**VERSION:** 1.0.0 Architecture Blueprint  
**LEAD AUTHORS:** Ten-Expert Studio Panel (Chief Technical Architect, Gameplay Engineer, Narrative Specialist, Graphics Engineer)  
**STATUS:** Master Specification  

---

## 1. Vision & Core Philosophy

*Before the First Light* is a contemplative, interactive 3D narrative adventure celebrating the people, communal labour, and cultural depth behind Chhath Puja in a rural Bihar village.

Rather than portraying Chhath as a passive spectacle or an arcade game, the player experiences the dignity of collective preparation. The game compresses a journey of devotion, homecoming, and community cooperation into a connected, destination-based playable progression.

### Core Tenets
1. **Geometry-First Worldbuilding:** Every building, utensil, crop, and person is modeled in authentic Three.js procedural geometry. Zero billboard photos or AI-generated image textures.
2. **Reverence without Mystification:** Sacred traditions are depicted through tangible human care—sweeping courtyards, drying grain, carrying woven baskets, and lighting clay lamps.
3. **Connected Progression:** The world expands logically from the intimate domestic hearth (household veranda and courtyard) out to the resource fields, artisan quarters, village gathering grounds, and finally the mist-laden sacred ghat at dawn.
4. **Accessible, Calming Gameplay:** Fluid third-person navigation, contextual prompts, zero fail states, bilingual English/Hindi localization, and serene visual and audio rhythms.

---

## 2. The Core Gameplay Loop

Every destination in the Bihar journey adheres to an intuitive, self-reinforcing eleven-step cycle:

```
[1. ARRIVE] ---> [2. EXPLORE] ---> [3. MEET CHARACTERS]
     |                                      |
[6. PREPARE] <-- [5. VIEW OBJECTIVES] <-- [4. UNDERSTAND PURPOSE]
     |
[7. COMPLETE ACTIVITIES] ---> [8. REVIEW TASKS] ---> [9. STORY FEEDBACK]
                                                         |
[11. TRAVEL] <--- [10. UNLOCK NEXT DESTINATION] <-------+
```

### Destination State Machine
Every destination in the journey graph transitions through explicit, immutable lifecycle states:
- `locked`: Future destination. Appears greyed out on the Journey Map with unmet requirements listed.
- `available`: Unlocked by preceding story milestones. Can be travelled to immediately.
- `active`: The player's current location. World triggers and character dialogues are engaged.
- `completed`: All primary objectives at this destination have been fulfilled.
- `revisited`: Player has returned to a previously completed location. Ambient interactions remain active while preserving world permanence.

---

## 3. High-Level System Architecture

```
+-----------------------------------------------------------------------------------+
|                                  React 19 Host                                    |
|  +-------------------------------------+  +------------------------------------+  |
|  |           UI & Overlays             |  |        Canvas & World Render       |  |
|  | - PlayerHUD (Objectives, Controls)  |  | - GameCanvas (R3F 9.8 / Three.js)  |  |
|  | - RouteMap (Destination Navigator)  |  | - CameraController (Smooth Lerp)   |  |
|  | - DialogueBox (Bilingual Story)     |  | - VillageAtmosphere (Day/Night)    |  |
|  | - HowToPlay / Journal / DebugDrawer |  | - Destination Hub Meshes           |  |
|  +-------------------------------------+  +------------------------------------+  |
+------------------------------------------^----------------------------------------+
                                           |
+------------------------------------------v----------------------------------------+
|                            Authoritative Game Store                               |
| - Zustand v5 State Machine (Save/Load, Versioned Schema)                          |
| - Destination Manager (State Graph: Locked -> Available -> Completed)             |
| - Quest & Objective Tracker (Active Quests, World Flags, Inventory)               |
+------------------------------------------^----------------------------------------+
                                           |
+------------------------------------------v----------------------------------------+
|                               Typed Event Bus                                     |
| - Pub/Sub architecture decoupling UI, Systems, Audio, and Cinematics              |
| - Events: journey:*, quest:*, character:*, timeline:*, audio:*, save:*            |
+------------------------------------------^----------------------------------------+
                                           |
+------------------------------------------v----------------------------------------+
|                          Authored YAML Content & Config                           |
| - game-world.yaml | journey.yaml | quests.yaml | characters.yaml | audio.yaml      |
| - Validated via strict Zod schemas at build and runtime                           |
+-----------------------------------------------------------------------------------+
```

---

## 4. Narrative & Journey Arc

| Act | Title | Primary Destination | Cultural Milestone | Player Goal |
|---|---|---|---|---|
| **Prologue** | The Return Home | Veranda & Courtyard | Arrival & Welcome | Meet Ma, take in the courtyard, inspect family preparations. |
| **Act I** | The Household | Courtyard & Hearth | Cleaning & Grain Care | Sweep fallen leaves with grass broom; spread wheat on drying mat. |
| **Act II** | Fields & Resources | Village Path & Fields | Agro-Ecological Bounty | Collect clean firewood/goitha, observe village harvest roots. |
| **Act III** | Artisans & Market | Artisan Workshop & Stalls | Bamboo Craftsmanship | Visit Mohan Kaka, inspect bamboo soop & daura, receive mended basket. |
| **Act IV** | Community | Shared Village Lane | Collective Responsibility | Meet neighbours, inspect pond steps, clear walkway to the water. |
| **Act V** | Nahay Khay | Kitchen & Waterbody | Day 1: Sacred Cleansing | Support satvik cooking arrangements and personal purification. |
| **Act VI** | Kharna | Household Inner Room | Day 2: Introspection | Assist with evening gur-kheer prasad, witness sacred dusk vigil. |
| **Act VII** | Sandhya Arghya | Procession Route & Ghat | Day 3: Sunset Offering | Carry offerings in daura to the ghat; participate in evening arghya. |
| **Act VIII** | Night Before Dawn | Quiet Ghat & Courtyard | Night Vigil / Kosi | Observe glowing diyas and sugarcane canopy under the starry sky. |
| **Act IX** | Usha Arghya | Sacred Pokhra (Pond) | Day 4: The Rising Sun | Stand by the misted waters at dawn; greet the first golden rays. |
| **Epilogue** | Parana | Family Veranda | Communal Feast & Blessing | Return home with the morning light; distribute prasad to all. |

---

## 5. Technology Stack Specifications

- **UI & Application Framework:** React 19, TypeScript (strict mode, zero implicit `any`), Vite 8.
- **3D Graphics & Scene Graph:** Three.js r187, React Three Fiber v9.8, `@react-three/drei` v10.7.
- **State Management:** Zustand v5 (decoupled store, selective subscriptions, localStorage persistence).
- **Data Validation & Schemas:** Zod v4, JSON Schema, YAML parser (`yaml` v2).
- **Animation & Transitions:** Code-authored procedural lerp, frame-rate independent delta time steps, GSAP v3 for UI transitions.
- **Audio Architecture:** Howler.js v2, Web Audio API procedural synthesis, multi-bus ambient/music fading.
- **Testing & Quality Gates:** Vitest v3, JSDOM, Testing Library, Playwright Core for browser smoke runs.

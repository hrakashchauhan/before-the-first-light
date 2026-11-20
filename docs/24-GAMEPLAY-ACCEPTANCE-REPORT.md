# 24 — Gameplay and Quest Acceptance Report

**Project:** BEFORE THE FIRST LIGHT  
**Lead Engineer:** Expert 05 (Gameplay and Simulation Engineer)  
**Date:** 2026-11-20

---

## 1. Core Playable Loop Architecture

```text
Player Explores Courtyard 
    -> Detects Proximity to Interactable Object / Character 
    -> Contextual HUD Prompt Displays ([E] Action)
    -> Player Presses [E] (Debounced, Key-Repeat Protected)
    -> Zustand Action Dispatched & Event Emitted
    -> World State Flags Updated & 3D Geometry Transforms Visibly
    -> Next Quest Objective Unlocks & Game State Saved to LocalStorage
```

---

## 2. Quest Catalog Progression

| Quest ID | Chapter | Target | Interaction Action | Tangible World Consequence | Status |
|---|---|---|---|---|---|
| `q_arrival_talk` | homecoming | `npc_mother` | `talk` | Introduces Chhath plan; broom unlocked in courtyard | Implemented & Tested |
| `q_courtyard_clean` | courtyard-preparation | `prop_broom_area` | `help` / `sweep` | Swept ground area visibly shifts to clean limewash boundary | Planned for M05 |
| `q_wheat_sort` | household-work | `prop_wheat_mat` | `inspect` / `sort` | Wheat grain spreads across drying mat in sun | Planned for M05 |
| `q_goitha_prepare` | household-work | `prop_goitha_wall` | `help` | Fuel cakes appear drying along sunny wall | Planned for M05 |
| `q_chulha_check` | household-work | `prop_chulha` | `inspect` | Clay chulha confirmed cured; fuel placed | Planned for M05 |
| `q_bamboo_visit` | village-cooperation | `npc_artisan` | `talk` | New soop basket delivered to veranda | Planned for M08 |
| `q_dawn_walk` | usha-arghya | `npc_family_ghat` | `advance-task` | Family enters ghat water; sunrise finale triggers | Planned for M09 |

---

## 3. Save / Load Integrity Standard
- **Format:** Versioned `GameSaveV1` in browser `localStorage.getItem('before_the_first_light_save')`.
- **Validation:** Zod schema parses save structure on startup.
- **Fail-safe:** If JSON is malformed or schema version is invalid, automatically defaults to fresh new game without crashing.

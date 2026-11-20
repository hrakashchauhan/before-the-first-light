# 24 — Gameplay and Quest Acceptance Report

**Project:** BEFORE THE FIRST LIGHT  
**Lead Engineer:** Expert 05 (Gameplay and Simulation Engineer) & Expert 04 (Character Engineer)  
**Date:** 2026-11-20  
**Status:** **PASS** (Playable Character, Camera Follow, Proximity Interaction, and World Consequence Verified)

---

## 1. Implemented & Verified Gameplay Loop

The player can now:
1. **Navigate the Courtyard:** Move freely using `W A S D` or arrow keys with smooth orientation turning and responsive foot-stepping animations.
2. **Observe Spatial Collision:** Physical collision boundaries prevent walking through mud house walls, veranda pillars, boundary walls, charpai, or the village handpump.
3. **Control Camera Zoom:** Smoothly zoom in/out via mouse wheel, `+` / `-` keys, or on-screen HUD buttons, and reset view with `0` key (clamped safely between 6.5m and 24.0m).
4. **Detect Proximity:** Walking near an interactable object highlights the target and displays an contextual prompt at the bottom of the screen (e.g. `[E] Sweep Courtyard` near the broom, `[E] Talk with Ma` near the mother).
5. **Execute Action:** Pressing `E` or clicking the prompt triggers the action, plays dialogue, updates world state flags, and visibly alters the courtyard (sweeping turns the ground into clean limewashed earth).
6. **Progress Quests:** Advances from `q_courtyard_clean` to `q_wheat_sort` to `q_goitha_prepare`.
7. **Persist State:** Automatically saves progress to browser `localStorage` and restores upon reloading.

---

## 2. Verified Interactables & Tasks

| Target ID | Object Name | Action Key | Interaction Result | World Consequence | Status |
|---|---|---|---|---|---|
| `prop_broom` | Courtyard Broom | `[E] Sweep Courtyard` | Player sweeps the courtyard ground | Courtyard earth shifts from dusty unswept soil to clean limewash border; advances quest to wheat sorting | **VERIFIED & PLAYABLE** |
| `npc_mother` | Ma (Vrati) | `[E] Talk with Ma` | Modal dialogue opens with respectful maternal guidance | Sets `talked_to_mother: true`; guides player on preparation sequence | **VERIFIED & PLAYABLE** |
| `prop_wheat` | Wheat Drying Mat | `[E] Inspect Wheat` | Checks readiness of grain; prevents premature drying if unswept | Sets `wheat_sorted: true` once yard is clean | **VERIFIED & PLAYABLE** |
| `prop_chulha` | Clay Chulha | `[E] Inspect Chulha` | Inspects combustion opening and pot rests | Confirms sacred stove is cured for Mahaprasad | **VERIFIED & PLAYABLE** |
| `prop_handpump` | Village Handpump | `[E] Examine Handpump` | Examines clear groundwater source | Confirms pure water availability for preparation | **VERIFIED & PLAYABLE** |

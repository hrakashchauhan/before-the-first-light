# 34 — Player Guidance, UX, and Localisation

**PROJECT:** BEFORE THE FIRST LIGHT  
**AUTHOR:** UI/UX and Interaction Designer (Expert 06)  
**DATE:** 2026-11-21  
**STATUS:** Master Interface Specification  

---

## 1. Interface Design Philosophy

*Before the First Light* is designed to be immediately playable by players of all ages and technical backgrounds:
1. **Low Cognitive Overhead:** Contextual prompts appear only when relevant; no cluttering min-maps or health bars.
2. **Dual-Mode Controls:** Complete support for keyboard/mouse (WASD, Arrows, E, Space, J, M, Esc) and touch/pointer on-screen buttons.
3. **High Legibility:** WCAG AAA contrast compliance, bold clear fonts, high-contrast HUD badges, and customizable text scaling.
4. **Bilingual Parity:** 100% of interface labels, dialogue text, journal entries, and error states are available in English and Hindi.

---

## 2. Comprehensive Navigation & HUD Layout

```
+-----------------------------------------------------------------------------+
| [CHAPTER BADGE: Act I - The Household]           [TIME: Morning]   [PAUSE]  |
|                                                                             |
|                                                                             |
|                               3D GAME WORLD                                 |
|                         (Courtyard / Lane / Ghat)                           |
|                                                                             |
|                                                                             |
|                           [E: Speak with Ma]                                |
|                                                                             |
| +-------------------------------------------------------------------------+ |
| | [OBJECTIVE HUD]                                                         | |
| | Current Task: Sweep the courtyard leaves beside the wheat mat           | |
| | Destination: Household Courtyard                                        | |
| | [MAP (M)]  [JOURNAL (J)]  [GUIDE (?)]  [SOUND (Vol)]  [ZOOM (+/-)]      | |
| +-------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------+
```

---

## 3. Interactive Route Map Modal

The Route Map provides both geographic orientation and travel functionality:
- **Visual Progression Line:** Connecting Home -> Courtyard -> Wheat Mat -> Village Lane -> Artisan Workshop -> Ghat Steps -> Sunrise Platform.
- **State Badging:**
  - `Completed`: Green checkmark with completion timestamp.
  - `Available`: Active pin icon with vibrant amber outline and "Travel" action.
  - `Current`: Highlighted pulse indicating Devraj's live position.
  - `Locked`: Padlock icon with requirement description (e.g. *"Complete courtyard preparations first"*).
- **Direct Travel:** Clicking an available or completed stop smoothly relocates the character and updates environmental framing.

---

## 4. Contextual Guidance & Tutorial Steps

| Step | Action Taught | Visual Cue | Completion Trigger |
|---|---|---|---|
| **Tut-1: Movement** | WASD or Arrow Keys | "Use W/A/S/D or Arrow Keys to move Devraj" | Player moves > 1.5 metres |
| **Tut-2: Camera** | Mouse Wheel or +/- Zoom | "Zoom in for detail, zoom out for wide view" | Player adjusts zoom level |
| **Tut-3: Interaction** | Press [E] or Click Prompt | "[E] Talk to Ma on the veranda" | Dialogue opens |
| **Tut-4: Route Map** | Press [M] or Click Route | "Open the Route Map to view unlocked village paths" | Map modal opens |
| **Tut-5: Journal** | Press [J] or Click Journal | "Check your Journal for completed tasks and lore" | Journal modal opens |

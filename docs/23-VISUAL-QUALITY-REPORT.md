# 23 — Visual Quality, Art Direction and Geometry Standards Report

**Project:** BEFORE THE FIRST LIGHT  
**Lead Review Panel:** Film Production Designer, Cinematographer, AAA Environment Artist, Character Modeller, UX Designer, Cultural Specialist, Technical Director  
**Date:** 2026-11-20  
**Current Status:** Upgraded to Production Vertical Slice (Inhabitation, Camera & Architectural Transformation)

---

## 1. Multi-Perspective Critical Review of Prototype Baseline

An independent review of the initial prototype identified critical visual and technical deficiencies:
1. **Empty Black Void (Cinematographer):** The scene was rendered against a stark black background, destroying the sense of a living outdoor village atmosphere at sunrise.
2. **Dominant Monolithic Roof (Production Designer):** The house roof appeared as an oversized, flat terracotta block dominating the camera composition rather than authentic hand-laid rural tiles and exposed timber rafters.
3. **Flat Ground Planes (Environment Artist):** The courtyard was composed of sharp rectangular planes rather than organic swept earth transitions and beaten-path contours.
4. **Uninhabited World (Character Modeller):** The courtyard felt like an abandoned archaeological set without human scale, player embodiment, or family presence.
5. **Intrusive Debug UI (UX Designer):** The verification panel occupied ~40% of the viewport, obscuring the 3D art and conflating gameplay with debugging.
6. **Rigid Prop Placement (Cultural Specialist):** Goitha cakes and baskets were arranged in computer-like grid rows rather than natural handmade village groupings.
7. **Fixed Camera (Technical Director):** Lack of player-controlled zoom prevented players from examining prop craftsmanship up close or surveying the village expanse.

---

## 2. Evaluation of Five Art Direction Approaches

| Approach | Aesthetic Description | Cultural Authenticity | Performance (Integrated GPU) | Character Integration | Verdict |
|---|---|---|---|---|---|
| **Approach 1: Photorealistic PBR** | High-density meshes, 4K textures, heavy SSAO & screen-space reflections | Moderate | **FAIL** (< 20 FPS on laptop, massive bundle) | Uncanny valley risks | **REJECTED** |
| **Approach 2: Flat-Shaded Low-Poly** | Low triangle counts, faceted faces, bright saturated pastel colors | Low (feels like generic mobile template) | Excellent (> 60 FPS) | Cartoonish, trivializes ritual reverence | **REJECTED** |
| **Approach 3: Handcrafted Stylized Diorama (Grounded Rural Realism)** | Tactile procedural geometry, authentic material roughness, warm morning daylight, stylized 3D human figures with expressive facial geometry | **HIGH** (tactile, respectful, warm) | **EXCELLENT** (60 FPS, draw calls < 50) | Warm, human, believable proportions | **SELECTED** |
| **Approach 4: 2.5D Isometric Pixel** | Sprite-based isometric pixel rendering | Medium | Good | 2D sprites violate 3D geometry-first rule | **REJECTED** |
| **Approach 5: Monochromatic Clay Sculpture** | Uniform untextured clay diorama | Low | Excellent | Strips away the golden sun, saffron cloth, and brass luster | **REJECTED** |

### Selected Art Direction: Approach 3 — Handcrafted Stylized Diorama (Grounded Rural Realism)
**Why it is superior:** It delivers rich visual warmth and tactile physical presence using real procedural 3D geometry without relying on photo textures or heavy post-processing. Characters possess sculpted 3D facial features, expressive everyday attire, and natural locomotion that fits the scale of the rural Bihar household.

---

## 3. Visual Transformation Specifications

### 3.1 Sky and Horizon Environment
- **Warm Morning Horizon Dome:** Inverted hemisphere gradient shifting from pale golden amber (`#ffcf75`) at the horizon to soft morning azure (`#74b9ff`) overhead.
- **Distant Village Silhouette:** Atmospheric backdrop featuring clustered neem/mango tree canopies, distant thatched hut roofs, and paddy field margins to eliminate the black void.

### 3.2 Architectural Upgrade (Rural Bihar House)
- **Wall Plinth & Plaster:** Thick mud walls (0.35m) with recessed doorway, wooden door frame, lintel, and subtle corner weathering.
- **Rafters & Eave Structure:** Exposed cylindrical bamboo/timber rafters beneath the roof overhang supporting the veranda eave.
- **Terracotta Tile Detailing:** Overlapping corrugated clay tile tiers with authentic ridge-capping.
- **Veranda (Ooth):** Elevated compacted platform with authentic stone-based wooden columns and carved head brackets.

### 3.3 Courtyard Ground & Path Transitions
- **Organic Swept Soil:** Circular hand-swept zone with soft edge fading and limewashed chalk perimeter boundary.
- **Perimeter Mud Boundary Wall:** Sturdy wall with rounded earthen coping where goitha cakes dry in the sun.
- **Footpath:** Beaten-earth trail leading from the veranda toward the village lane.

### 3.4 Inhabitation & Household Props
- **Full-Body 3D Player Character:** Stylized young family member with sculpted 3D face (eyes, eyebrows, nose, mouth, hair, ears), wearing traditional cotton kurta-pajama, fully animated with procedural walk cycle and idle breathing.
- **Vrati Mother NPC:** Respected elder matriarch draped in traditional yellow/ochre ritual border saree, positioned near the veranda cooking zone with responsive dialogue.
- **Village Handpump (Chapakal):** Authentic cast-iron water pump with handle, spout, and concrete soakage apron.
- **Woven Charpai (Khatia):** Traditional wooden four-legged cot with woven rope webbing.
- **Courtyard Broom (Kharhara):** Hand-tied broom leaning against the wall, serving as the first gameplay interaction target.

## 2026-11-20 household pass

The selected direction remains the handcrafted semi-realistic stylised 3D diorama. The rebuilt view uses a low three-quarter sunrise composition with an open yard, tiled veranda, distant fields, shaped foliage, shared household anchors, and two close-readable procedural human characters. Evidence is recorded in `references/evidence/courtyard/overview.jpg`, `portrait-study.jpg`, `player-close.jpg`, and `ma-conversation.jpg`.

The player and Ma use original Three.js geometry with sculpted face volumes, eyes, brows, nose, lips, ears, hair, hands, clothing, sandals, and procedural breathing, walking, conversation, and preparation poses. External GLB models were evaluated and excluded because the repository has no verified model or animation licence. Remaining visual limitation is that Mohan Kaka is a simpler block-built NPC than the two household figures.

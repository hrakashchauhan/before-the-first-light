# 23 — Visual Quality and Geometry Standards Report

**Project:** BEFORE THE FIRST LIGHT  
**Lead Artist:** Expert 03 (Procedural Environment Artist) & Expert 02 (Graphics Engineer)  
**Date:** 2026-11-20

---

## 1. Compliance with the Geometry-First Mandate

- **Strict Ban on Photographic & AI Billboard Textures:** Confirmed **PASS**. Zero photo wallpapers, flat billboard cutouts, or AI-generated texture sheets are present in the repository.
- **Real 3D Mesh Specification:** All structural and ritual items are modeled from actual procedural Three.js geometry:
  - **Mud walls & House:** Extruded volumes with physical wall depth (0.35m thickness), recessed doorways, and wooden pillar supports.
  - **Courtyard Ground:** Mesh with subtle vertex displacement and distinct material boundary zones (swept ritual area vs outer ground).
  - **Goitha:** Flattened organic elliptical geometry with visible thickness, hand-pressed indentation, and procedural drying stage hue shifts.
  - **Clay Chulha:** Modeled U-shaped combustion cavity, curved pot rests, and burnished terracotta clay finish.
  - **Bamboo Soop & Daura:** Authentic flared curved scoop geometry with split-bamboo woven patterns.
  - **Wheat Drying Mat:** Woven surface with instanced golden grain geometry.

---

## 2. Color Palette & Lighting Tokens

| Material Tone | Hex Tokens | Surface Behavior |
|---|---|---|
| Earth / Mud Soil | `#2b1f1a`, `#593d2c`, `#8c6239` | High roughness (0.85), low specular |
| Limewashed Plaster | `#f7f1e3`, `#d1ccc0` | Matte, slight weathered vertex noise |
| Bamboo Woven Strips | `#f5cd79`, `#e58e26` | Medium roughness (0.45), subtle sheen |
| Clay Terracotta | `#b5542b`, `#8a3b1d` | Warm, earthen, burnished highlight |
| Pond Water | `#2c5364`, `#203a43`, `#0f2027` | Subtle wave vertex displacement, gentle opacity |
| Morning Dawn Sun | `#ffbe76`, `#f8c291`, `#e58e26` | Directional key warmth with soft ambient bounce |

---

## 3. Lighting Strategy & Budgets
- **Key Light:** 1 DirectionalLight (`#fff3e0`, intensity: 1.6, castShadow: true, shadowMap: 1024x1024).
- **Ambient Light:** 1 AmbientLight (`#dff9fb`, intensity: 0.55).
- **Shadow Quality:** Soft PCF shadows; static architecture baked or cached.

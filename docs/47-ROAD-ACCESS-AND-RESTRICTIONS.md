# 47 — Road Access and Restrictions Specification

**Project:** BEFORE THE FIRST LIGHT  
**Date:** 2026-11-21  
**Author:** Procedural Environment Artist (Expert 03), QA Red Team Reviewer (Expert 10)

---

## 1. World Navigation Zones

The village world is divided into strict functional navigation zones to ensure spatial realism and ritual decorum. Bicycles are allowed only on suitable thoroughfares and strictly forbidden inside living quarters, ritual spaces, or water bodies.

```
+-----------------------------------------------------------------------------------------+
| [Courtyard: Pedestrian Only]   | [Village Lane: Bicycle Road]      | [Ghat: Ritual Platform]|
| - Inner veranda (Restricted)   | - Unpaved dirt lane (Allowed)     | - Bicycle Parking (Allowed)
| - Wheat drying mat (Forbidden) | - Roadside neem trees             | - Brick steps (Pedestrian)
| - Clay chulha nook (Forbidden) | - Artisan workshop frontage       | - Sacred pond water (Blocked)
| - Bicycle Parking Hub (Allowed)|                                   |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Zone Taxonomy & Behavior

| Zone Type | Allowed Locomotion | Description & Boundaries | Behavior on Violation Attempt |
|---|---|---|---|
| `bicycle-road` | Walking & Riding | Main Village Lane (X: 4.8 to 18.2, Z: 2.2 to 5.4). Wide, packed earthen road connecting home to artisan and ghat. | Unrestricted vehicle movement. |
| `bicycle-parking` | Walking & Parking | Designated parking stands at Household entrance (`[5.2, 0, 3.8]`), Artisan frontage (`[11.8, 0, 4.2]`), and Upper Ghat threshold (`[18.0, 0, 3.2]`). | Ideal dismount and parking location. |
| `pedestrian-only` | Walking Only | Household Courtyard interior (X: -4.9 to 4.8, Z: -2.8 to 5.8). | If mounted player approaches, vehicle automatically slows to a halt with on-screen guidance: *"Pedestrian courtyard: Dismount to enter on foot."* |
| `indoor-zone` | Walking Only | Veranda and house interiors. | Physical colliders prevent bicycle entry. |
| `ritual-zone` | Walking Only (Barefoot) | Sacred cooking corner (chulha), wheat drying mat, and ghat offering platforms. | Strict vehicle restriction. |
| `water-zone` | Forbidden | Village pond water body (X > 21.5). | Invisible barrier preventing bicycle from entering water. |

---

## 3. Edge Case Handling

1. **Stuck against obstacle:** Bicycle velocity is zeroed along collision normal; player can reverse (`S` / Down) or dismount immediately.
2. **High-speed dismount attempt:** Dismount key is disabled if speed exceeds 0.5 m/s, displaying notice: *"Brake before dismounting (Space / S)"*.
3. **Leaving bicycle behind:** The bicycle remains parked at its exact world position and is marked with a subtle icon on the mini-compass.
4. **Reloading / Saving while riding:** Save game records bicycle coordinates and automatically restores player in safe dismounted posture beside the bicycle upon reload.

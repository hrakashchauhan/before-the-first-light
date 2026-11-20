# 50 — Family Task and NPC Workflows Specification

**Project:** BEFORE THE FIRST LIGHT  
**Date:** 2026-11-21  
**Author:** Cultural & Research Specialist (Expert 07), Gameplay & Simulation Engineer (Expert 05)

---

## 1. Character Roster & Division of Responsibilities

No single character bears the entire burden of Chhath Puja; preparation is an organic harmony of family roles, artisans, and community solidarity:

| Character | Role / Archetype | Key Responsibilities | Visible Behavior in World |
|---|---|---|---|
| **Devraj (Player)** | Son / Returnee | Logistics, errands, bicycle travel to market/artisan, sweeping, carrying offerings. | Controllable player avatar (walking / bicycle riding). |
| **Shanti Devi (Ma)** | Mother / Vrati (Fasting Devotee) | Sacred vows, purity supervision, sorting wheat, cooking kheer, offering arghya in water. | Seated / standing on veranda or at ghat edge with respectful gestures. |
| **Ramakant ji (Bauji)** | Father | Preparing clay chulha, chopping mango wood, carrying the heavy bamboo daura on head to the ghat. | Near the courtyard woodpile or carrying daura in procession. |
| **Parvati Devi (Dadi)** | Grandmother | Oral tradition, singing folk songs, reciting legends, blessing family members. | Seated on charpai in courtyard, guiding grandchildren. |
| **Mohan Kaka** | Artisan / Bamboo Craftsman | Handcrafting traditional soop, daura, and fan from fresh green bamboo cane. | In workshop on village lane, weaving bamboo strips. |
| **Malti Chachi** | Neighbour | Community cooperation, sharing clay lamps, preparing thekua moulds (*saancha*). | Roadside courtyard or ghat steps assisting the vrati. |

---

## 2. Event-Driven Workflow Chains

```
[Player Completes Task]
        |
        v
(eventBus: 'quest:completed')
        |
        +---> [World State Flag Set in GameStore]
        |
        +---> [NPC Reaction Triggered]
        |         - Ma inspects swept ground / baskets
        |         - Bauji prepares next ritual material
        |
        +---> [Audio Transition / Ducking Restored]
        |
        +---> [Next Objective & Journal Step Unlocked]
```

---

## 3. Cultural Validation & Respect Rules

1. **No Gamified Suffering:** Fasting (nirjala) is represented with solemn reverence and dignity; it is never depicted as an energy drain, hunger bar, or penalty mechanic.
2. **Sacred Fire Safety:** Fire handling around the clay chulha is depicted with domestic care and traditional respect.
3. **Purity (*Pavitrata*):** Bicycles and unwashed shoes are never brought onto the sacred offering areas or near the cooking hearth.

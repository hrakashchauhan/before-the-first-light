# 31 — Quest and Progression Design

**PROJECT:** BEFORE THE FIRST LIGHT  
**AUTHOR:** Gameplay & Simulation Engineer (Expert 05)  
**DATE:** 2026-11-21  
**STATUS:** Canonical Quest Engine Specification  

---

## 1. Quest Architecture

Every quest is an authored contract defining:
- Unique identifier (`id`).
- Narrative chapter binding (`chapterId`).
- Target interactable entity (`targetId`).
- Prerequisites (`dependencies` in world flags or quest completions).
- World mutations on completion (`flag`, `item`, `timeShift`, `chapterAdvance`).
- Localized titles and task prompts (`title`, `description` in English and Hindi).

---

## 2. Canonical Quest Registry

```typescript
export interface QuestDefinition {
  id: string
  chapterId: ChapterId
  titleEn: string
  titleHi: string
  descEn: string
  descHi: string
  targetId: string
  requiredFlags: string[]
  completionFlag: string
  rewardItem?: string
  nextChapter?: ChapterId
  timeOfDayShift?: TimeOfDay
}
```

### Complete Quest Chain

| Quest ID | Chapter | Name (EN / HI) | Target ID | Prerequisite | Completion Flag | Outcome |
|---|---|---|---|---|---|---|
| `q_arrival_talk` | `homecoming` | Speak with Ma / माँ से बात करें | `npc_mother` | None | `talked_to_mother` | Chapter advances to `courtyard-preparation` |
| `q_courtyard_clean` | `courtyard-preparation` | Sweep the courtyard / आँगन बुहारें | `prop_broom` | `talked_to_mother` | `courtyard_cleaned` | Leaves cleared, courtyard ground opens |
| `q_wheat_sort` | `household-work` | Spread the wheat / गेहूँ फैलाएँ | `prop_wheat` | `courtyard_cleaned` | `wheat_sorted` | Wheat spread on mat, lane unblocks |
| `q_bamboo_visit` | `village-cooperation` | Visit basket maker / मोहन काका से मिलें | `npc_artisan` | `wheat_sorted` | `bamboo_collected` | Receives `woven_basket` item |
| `q_ghat_clean` | `festival-eve` | Walk to the ghat / घाट तक जाएँ | `prop_ghat_spot` | `bamboo_collected` | `ghat_prepared` | Ghat steps inspected, arpan confirmed |
| `q_dawn_walk` | `usha-arghya` | Wait for first light / पहली रोशनी देखें | `prop_ghat_spot` | `ghat_prepared` | `dawn_witnessed` | Time shifts to `sunrise`, sun ascends |
| `q_return_home` | `usha-arghya` | Return to Ma / माँ के पास लौटें | `npc_mother` | `dawn_witnessed` | `homecoming_shared` | Ma acknowledges the community effort |
| `q_prasad_share` | `parana-epilogue` | Share the morning / सुबह बाँटें | `npc_mother` | `homecoming_shared` | `prasad_shared` | Journey climax: prasad shared, journey logged |

---

## 3. Objective Determination & Fault Tolerance

The active objective is computed deterministically from the authoritative `worldFlags` dictionary.
If an earlier save lacks an updated flag or if the player repeats an optional inspection, the objective resolver finds the next unsatisfied required milestone.

```typescript
export function resolveCurrentObjective(flags: Record<string, boolean>, language: 'en' | 'hi')
```

### Non-Linear Safeguards
- **Revisiting:** Returning to Mohan Kaka after collecting the basket provides reflective dialogue praising the craftsmanship without resetting quest state.
- **Inspection Safety:** Interacting with non-quest props (e.g. `prop_handpump`, `prop_chulha`, `prop_goitha`) displays atmospheric lore without interfering with active quests.
- **Fail-Safe Recovery:** If an invalid state occurs in localStorage, the store safely falls back to the nearest valid chapter checkpoint.

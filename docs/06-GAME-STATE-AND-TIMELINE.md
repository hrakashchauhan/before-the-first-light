# 06 — Game state, calendar and time progression

## Time model
The game depicts a long preparation period through authored chapters. Do not make the player wait 60 real days. A chapter transition represents elapsed time and applies defined changes to the world.

Suggested chapter labels:
- `homecoming`
- `courtyard-preparation`
- `household-work`
- `village-cooperation`
- `festival-eve`
- `sandhya-arghya`
- `usha-arghya`
- `parana-epilogue`

## Time of day
Use a controlled game clock with named phases: `morning`, `afternoon`, `evening`, `night`, `pre-dawn`, `sunrise`. Transitions are authored, not tied to the user's computer clock.

## Fixed-step update
For systems that need simulation updates, use a fixed simulation step (for example 1/30 second) with an accumulator and a maximum number of catch-up steps. Rendering remains driven by R3F. Do not create a second uncontrolled animation loop. For simple MVP tasks, event-driven state updates are preferable to continuous simulation.

## State principles
- Explicit enums, no magic strings spread through components.
- Each task has an ID and explicit status.
- World changes derive from state.
- Save data has a schema version.
- Invalid or old saves must fail safely and offer a new game rather than crash.

## Example state
```ts
type ChapterId =
  | "homecoming"
  | "courtyard-preparation"
  | "household-work"
  | "village-cooperation"
  | "festival-eve"
  | "sandhya-arghya"
  | "usha-arghya"
  | "parana-epilogue";

type QuestStatus = "locked" | "available" | "active" | "completed";

interface GameState {
  schemaVersion: 1;
  chapterId: ChapterId;
  timeOfDay: "morning" | "afternoon" | "evening" | "night" | "pre-dawn" | "sunrise";
  language: "en" | "hi";
  completedQuestIds: string[];
  inventory: string[];
  worldFlags: Record<string, boolean>;
  settings: { musicVolume: number; sfxVolume: number; subtitles: boolean };
}
```

## Save rules
Save after meaningful milestones and on explicit pause/menu actions. Debounce frequent writes. Never store runtime Three.js objects, meshes, materials, callbacks or audio handles in save data.

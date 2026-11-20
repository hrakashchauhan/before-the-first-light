import type { ChapterId, GameSettings, TimeOfDay } from "./game-state";

export interface GameEventMap {
  // Destination & Journey events
  "journey:destination-arrived": { destinationId: string; previousDestinationId: string | null };
  "journey:destination-completed": { destinationId: string };
  "journey:destination-unlocked": { destinationId: string };

  // Quest Lifecycle
  "quest:started": { questId: string };
  "quest:objective-completed": { questId: string; flag: string };
  "quest:completed": { questId: string };

  // Character, Dialogue & Player Interaction
  "player:interact": { targetId: string };
  "player:item-collected": { itemId: string };
  "character:dialogue-started": { speaker: string; text: string; targetId: string };
  "character:dialogue-completed": { targetId: string };
  "dialogue:started": { dialogueId: string; speakerId: string };
  "dialogue:completed": { dialogueId: string };

  // World State & Timeline
  "world:flag-changed": { flagId: string; value: boolean };
  "world:state-changed": { flag: string; value: boolean };
  "chapter:changed": { chapterId: ChapterId };
  "timeline:chapter-changed": { chapterId: ChapterId; previousChapterId?: ChapterId };
  "timeline:phase-changed": { timeOfDay: TimeOfDay };

  // Festival Stages
  "festival:stage-started": { stage: string };
  "festival:stage-completed": { stage: string };

  // Audio & Cinematics
  "audio:play": { soundId: string; channel: "music" | "sfx" | "ambience" };
  "audio:music-transition": { trackId: string; fadeMs?: number };
  "audio:ambience-changed": { ambienceId: string };
  "cinematic:started": { cinematicId: string };
  "cinematic:completed": { cinematicId: string };

  // Persistence & Settings
  "save:requested": { reason: "checkpoint" | "manual" | "settings" };
  "save:completed": { timestamp: number; chapterId: ChapterId };
  "settings:changed": { settings: Partial<GameSettings> };
}

import type { ChapterId, GameSettings, TimeOfDay } from "./game-state";

export interface GameEventMap {
  "player:interact": { targetId: string };
  "dialogue:started": { dialogueId: string; speakerId: string };
  "dialogue:completed": { dialogueId: string };
  "quest:started": { questId: string };
  "quest:completed": { questId: string };
  "world:flag-changed": { flagId: string; value: boolean };
  "chapter:changed": { chapterId: ChapterId };
  "timeline:phase-changed": { timeOfDay: TimeOfDay };
  "audio:play": { soundId: string; channel: "music" | "sfx" | "ambience" };
  "save:requested": { reason: "checkpoint" | "manual" | "settings" };
  "settings:changed": { settings: Partial<GameSettings> };
}

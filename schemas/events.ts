export interface GameEventMap {
  "player:interact": { targetId: string };
  "dialogue:started": { dialogueId: string; speakerId: string };
  "dialogue:completed": { dialogueId: string };
  "quest:started": { questId: string };
  "quest:completed": { questId: string };
  "world:flag-changed": { flagId: string; value: boolean };
  "chapter:changed": { chapterId: string };
  "timeline:phase-changed": { timeOfDay: string };
  "audio:play": { soundId: string; channel: "music" | "sfx" | "ambience" };
  "save:requested": { reason: "checkpoint" | "manual" | "settings" };
}

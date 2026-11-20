export type ChapterId =
  | "homecoming"
  | "courtyard-preparation"
  | "household-work"
  | "village-cooperation"
  | "festival-eve"
  | "sandhya-arghya"
  | "usha-arghya"
  | "parana-epilogue";

export type TimeOfDay =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "pre-dawn"
  | "sunrise";

export type QuestStatus = "locked" | "available" | "active" | "completed";

export interface GameSaveV1 {
  schemaVersion: 1;
  chapterId: ChapterId;
  timeOfDay: TimeOfDay;
  language: "en" | "hi";
  completedQuestIds: string[];
  inventory: string[];
  worldFlags: Record<string, boolean>;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    subtitles: boolean;
  };
}

export interface InteractableDefinition {
  id: string;
  labelKey: string;
  action:
    | "talk"
    | "inspect"
    | "help"
    | "pick-up"
    | "advance-task";
  radius: number;
  enabled: boolean;
}

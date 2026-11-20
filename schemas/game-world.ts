import { z } from 'zod';

export const LocationStateSchema = z.enum([
  'locked',
  'available',
  'active',
  'completed',
  'revisited',
]);

export type LocationState = z.infer<typeof LocationStateSchema>;

export const DestinationSchema = z.object({
  id: z.string().min(1),
  region_id: z.string().min(1),
  name: z.string().min(1),
  name_hi: z.string().min(1),
  day_label: z.string().min(1),
  day_label_hi: z.string().min(1),
  position: z.tuple([z.number(), z.number(), z.number()]),
  interactable_targets: z.array(z.string()).default([]),
  primary_quest: z.string().optional(),
});

export type Destination = z.infer<typeof DestinationSchema>;

export const RegionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  name_hi: z.string().min(1),
  description: z.string().min(1),
  bounds: z.object({
    min_x: z.number(),
    max_x: z.number(),
    min_z: z.number(),
    max_z: z.number(),
  }),
  default_spawn: z.tuple([z.number(), z.number(), z.number()]),
});

export type Region = z.infer<typeof RegionSchema>;

export const GameWorldConfigSchema = z.object({
  world: z.object({
    id: z.string(),
    name: z.string(),
    scale_unit: z.string(),
    coordinate_system: z.string(),
  }),
  regions: z.array(RegionSchema),
  destinations: z.array(DestinationSchema),
});

export type GameWorldConfig = z.infer<typeof GameWorldConfigSchema>;

export const JourneyChapterSchema = z.object({
  id: z.string(),
  order: z.number(),
  name_en: z.string(),
  name_hi: z.string(),
  time_of_day: z.enum(['morning', 'afternoon', 'evening', 'night', 'pre-dawn', 'sunrise']),
  destination_id: z.string(),
  required_quest: z.string(),
  story_hook: z.string(),
});

export type JourneyChapter = z.infer<typeof JourneyChapterSchema>;

export const JourneyConfigSchema = z.object({
  journey: z.object({
    title: z.string(),
    version: z.string(),
  }),
  chapters: z.array(JourneyChapterSchema),
});

export type JourneyConfig = z.infer<typeof JourneyConfigSchema>;

export const QuestConfigItemSchema = z.object({
  id: z.string(),
  chapter_id: z.string(),
  title_en: z.string(),
  title_hi: z.string(),
  desc_en: z.string(),
  desc_hi: z.string(),
  target_id: z.string(),
  required_flags: z.array(z.string()).default([]),
  completion_flag: z.string(),
  reward_item: z.string().optional(),
  time_shift: z.enum(['morning', 'afternoon', 'evening', 'night', 'pre-dawn', 'sunrise']).optional(),
  advances_chapter: z.string().optional(),
});

export type QuestConfigItem = z.infer<typeof QuestConfigItemSchema>;

export const QuestsConfigSchema = z.object({
  quests: z.array(QuestConfigItemSchema),
});

export type QuestsConfig = z.infer<typeof QuestsConfigSchema>;

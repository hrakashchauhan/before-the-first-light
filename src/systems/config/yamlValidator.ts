import { parse } from 'yaml'
import { z } from 'zod'

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
})

export const DestinationConfigSchema = z.object({
  id: z.string().min(1),
  region_id: z.string().min(1),
  name: z.string().min(1),
  name_hi: z.string().min(1),
  day_label: z.string().min(1),
  day_label_hi: z.string().min(1),
  position: z.tuple([z.number(), z.number(), z.number()]),
  interactable_targets: z.array(z.string()).default([]),
  primary_quest: z.string().optional(),
})

export const GameWorldYamlSchema = z.object({
  world: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    scale_unit: z.string().min(1),
    coordinate_system: z.string().min(1),
  }),
  regions: z.array(RegionSchema),
  destinations: z.array(DestinationConfigSchema),
})

export const JourneyChapterYamlSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().min(0),
  name_en: z.string().min(1),
  name_hi: z.string().min(1),
  time_of_day: z.enum(['morning', 'afternoon', 'evening', 'night', 'pre-dawn', 'sunrise']),
  destination_id: z.string().min(1),
  required_quest: z.string().min(1),
  story_hook: z.string().min(1),
})

export const JourneyYamlSchema = z.object({
  journey: z.object({
    title: z.string().min(1),
    version: z.string().min(1),
  }),
  chapters: z.array(JourneyChapterYamlSchema),
})

export const QuestYamlItemSchema = z.object({
  id: z.string().min(1),
  chapter_id: z.string().min(1),
  title_en: z.string().min(1),
  title_hi: z.string().min(1),
  desc_en: z.string().min(1),
  desc_hi: z.string().min(1),
  target_id: z.string().min(1),
  required_flags: z.array(z.string()),
  completion_flag: z.string().min(1),
  reward_item: z.string().optional(),
  time_shift: z.string().optional(),
  advances_chapter: z.string().optional(),
})

export const QuestsYamlSchema = z.object({
  quests: z.array(QuestYamlItemSchema),
})

export const CharacterYamlItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  name_hi: z.string().min(1),
  role: z.string().min(1),
  relationship_to_player: z.string().min(1),
  location_id: z.string().optional(),
  attire: z.string().min(1),
  voice_tone: z.string().min(1),
})

export const CharactersYamlSchema = z.object({
  characters: z.array(CharacterYamlItemSchema),
})

export const AudioYamlSchema = z.object({
  audio: z.object({
    master: z.object({
      default_music_volume: z.number().min(0).max(1),
      default_sfx_volume: z.number().min(0).max(1),
      fade_duration_ms: z.number().positive(),
    }),
    tracks: z.array(
      z.object({
        id: z.string().min(1),
        chapter: z.string().min(1),
        location: z.string().min(1),
        channel: z.literal('music'),
        description: z.string().min(1),
        licensing: z.string().min(1),
      })
    ),
    ambience: z.array(
      z.object({
        id: z.string().min(1),
        location: z.string().min(1),
        channel: z.literal('ambience'),
        description: z.string().min(1),
      })
    ),
  }),
})

export const EventYamlItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  payload_fields: z.array(z.string()),
})

export const EventsYamlSchema = z.object({
  events: z.array(EventYamlItemSchema),
})

export const UiLabelsYamlSchema = z.object({
  labels: z.object({
    en: z.record(z.string(), z.string()),
    hi: z.record(z.string(), z.string()),
  }),
})

export const QualityGateYamlItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  required_commands: z.array(z.string()).optional(),
  pass_criteria: z.array(z.string()),
  status: z.string().optional(),
})

export const QualityGatesYamlSchema = z.object({
  gates: z.array(QualityGateYamlItemSchema),
})

export const BicycleYamlSchema = z.object({
  bicycle: z.object({
    model: z.object({
      name: z.string().min(1),
      name_hi: z.string().min(1),
      color_frame: z.string(),
      color_chrome: z.string(),
      wheel_radius: z.number().positive(),
      wheelbase: z.number().positive(),
      carrier_capacity_baskets: z.number().int().nonnegative(),
    }),
    physics: z.object({
      max_forward_speed: z.number().positive(),
      max_reverse_speed: z.number().positive(),
      acceleration: z.number().positive(),
      brake_deceleration: z.number().positive(),
      natural_friction: z.number().positive(),
      turn_rate: z.number().positive(),
      max_lean_angle_rad: z.number().positive(),
      safe_dismount_speed: z.number().positive(),
    }),
    controls: z.record(z.string(), z.array(z.string())),
    parking_defaults: z.record(z.string(), z.tuple([z.number(), z.number(), z.number()])),
  }),
})

export const RoadZonesYamlSchema = z.object({
  road_zones: z.object({
    zones: z.array(
      z.object({
        id: z.string().min(1),
        type: z.enum(['pedestrian-only', 'bicycle-road', 'bicycle-path', 'ritual-zone', 'water-zone', 'indoor-zone', 'parking-zone']),
        name: z.string().min(1),
        name_hi: z.string().min(1),
        bounds: z.object({
          min_x: z.number(),
          max_x: z.number(),
          min_z: z.number(),
          max_z: z.number(),
        }),
        bicycle_permitted: z.boolean(),
        speed_limit: z.number().optional(),
        restriction_message_en: z.string().optional(),
        restriction_message_hi: z.string().optional(),
      })
    ),
  }),
})

export const TaskWorkflowsYamlSchema = z.object({
  workflows: z.array(
    z.object({
      id: z.string().min(1),
      chapter_id: z.string().min(1),
      steps: z.array(
        z.object({
          step: z.number().int().positive(),
          instruction_en: z.string().min(1),
          instruction_hi: z.string().min(1),
          target_id: z.string().min(1),
          action: z.string().min(1),
        })
      ),
    })
  ),
})

export const NpcSchedulesYamlSchema = z.object({
  schedules: z.array(
    z.object({
      character_id: z.string().min(1),
      phases: z.array(
        z.object({
          time_of_day: z.string().min(1),
          location_anchor: z.string().min(1),
          activity: z.string().min(1),
          activity_hi: z.string().min(1),
        })
      ),
    })
  ),
})

export const TutorialYamlSchema = z.object({
  tutorial: z.object({
    hints: z.array(
      z.object({
        id: z.string().min(1),
        trigger: z.string().min(1),
        text_en: z.string().min(1),
        text_hi: z.string().min(1),
      })
    ),
  }),
})

export function parseYamlContent<T>(raw: string, schema: z.ZodType<T>): T {
  const parsed = parse(raw)
  return schema.parse(parsed)
}

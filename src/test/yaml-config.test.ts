import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import {
  parseYamlContent,
  GameWorldYamlSchema,
  JourneyYamlSchema,
  QuestsYamlSchema,
  CharactersYamlSchema,
  AudioYamlSchema,
  EventsYamlSchema,
  UiLabelsYamlSchema,
  QualityGatesYamlSchema,
  BicycleYamlSchema,
  RoadZonesYamlSchema,
  TaskWorkflowsYamlSchema,
  NpcSchedulesYamlSchema,
  TutorialYamlSchema,
} from '../systems/config/yamlValidator'
import { COURTYARD_ANCHORS } from '../systems/interaction/household'

const configDir = path.resolve(__dirname, '../../config')

function readConfig(filename: string): string {
  return fs.readFileSync(path.join(configDir, filename), 'utf-8')
}

describe('YAML Configuration Validation Suite', () => {
  it('validates config/game-world.yaml schema and structure', () => {
    const raw = readConfig('game-world.yaml')
    const parsed = parseYamlContent(raw, GameWorldYamlSchema)

    expect(parsed.world.id).toBe('bihar_village_world')
    expect(parsed.regions.length).toBeGreaterThanOrEqual(4)
    expect(parsed.destinations.length).toBeGreaterThanOrEqual(6)

    // Check unique destination IDs
    const destIds = parsed.destinations.map((d) => d.id)
    const uniqueDestIds = new Set(destIds)
    expect(uniqueDestIds.size).toBe(destIds.length)

    // Check region references
    const regionIds = new Set(parsed.regions.map((r) => r.id))
    for (const dest of parsed.destinations) {
      expect(regionIds.has(dest.region_id)).toBe(true)
    }
  })

  it('validates config/journey.yaml schema and chapter flow', () => {
    const raw = readConfig('journey.yaml')
    const parsed = parseYamlContent(raw, JourneyYamlSchema)

    expect(parsed.journey.title).toContain('Bihar')
    expect(parsed.chapters.length).toBeGreaterThanOrEqual(7)

    // Ensure order is monotonic and non-negative
    for (let i = 0; i < parsed.chapters.length; i++) {
      expect(parsed.chapters[i].order).toBe(i)
    }

    // Ensure unique chapter IDs
    const chapterIds = parsed.chapters.map((c) => c.id)
    expect(new Set(chapterIds).size).toBe(chapterIds.length)
  })

  it('validates config/quests.yaml schema and dependencies', () => {
    const raw = readConfig('quests.yaml')
    const parsed = parseYamlContent(raw, QuestsYamlSchema)

    expect(parsed.quests.length).toBeGreaterThanOrEqual(7)

    const questIds = parsed.quests.map((q) => q.id)
    expect(new Set(questIds).size).toBe(questIds.length)

    // Verify all targets are known anchors
    for (const quest of parsed.quests) {
      expect(Object.hasOwn(COURTYARD_ANCHORS, quest.target_id)).toBe(true)
      expect(quest.completion_flag).toBeTruthy()
    }
  })

  it('validates config/characters.yaml schema', () => {
    const raw = readConfig('characters.yaml')
    const parsed = parseYamlContent(raw, CharactersYamlSchema)

    expect(parsed.characters.length).toBeGreaterThanOrEqual(3)
    const ids = parsed.characters.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)

    const devraj = parsed.characters.find((c) => c.id === 'char_devraj')
    const mother = parsed.characters.find((c) => c.id === 'npc_mother')
    expect(devraj).toBeDefined()
    expect(mother).toBeDefined()
  })

  it('validates config/audio.yaml schema and volume limits', () => {
    const raw = readConfig('audio.yaml')
    const parsed = parseYamlContent(raw, AudioYamlSchema)

    expect(parsed.audio.master.default_music_volume).toBeGreaterThan(0)
    expect(parsed.audio.master.default_music_volume).toBeLessThanOrEqual(1)
    expect(parsed.audio.master.default_sfx_volume).toBeGreaterThan(0)
    expect(parsed.audio.master.default_sfx_volume).toBeLessThanOrEqual(1)
    expect(parsed.audio.tracks.length).toBeGreaterThanOrEqual(3)
    expect(parsed.audio.ambience.length).toBeGreaterThanOrEqual(2)
  })

  it('validates config/events.yaml schema', () => {
    const raw = readConfig('events.yaml')
    const parsed = parseYamlContent(raw, EventsYamlSchema)

    expect(parsed.events.length).toBeGreaterThanOrEqual(8)
    const eventNames = parsed.events.map((e) => e.name)
    expect(eventNames).toContain('journey:destination-arrived')
    expect(eventNames).toContain('quest:completed')
    expect(eventNames).toContain('world:state-changed')
  })

  it('validates config/ui-labels.yaml bilingual parity', () => {
    const raw = readConfig('ui-labels.yaml')
    const parsed = parseYamlContent(raw, UiLabelsYamlSchema)

    const enKeys = Object.keys(parsed.labels.en)
    const hiKeys = Object.keys(parsed.labels.hi)

    expect(enKeys.length).toBeGreaterThan(10)
    expect(hiKeys.length).toBeGreaterThan(10)

    // Check that every English label key has a corresponding Hindi label key
    for (const key of enKeys) {
      expect(parsed.labels.hi[key]).toBeDefined()
      expect(parsed.labels.hi[key].length).toBeGreaterThan(0)
    }
  })

  it('validates config/quality-gates.yaml', () => {
    const raw = readConfig('quality-gates.yaml')
    const parsed = parseYamlContent(raw, QualityGatesYamlSchema)

    expect(parsed.gates.length).toBeGreaterThanOrEqual(5)
    for (const gate of parsed.gates) {
      expect(gate.id).toBeTruthy()
      expect(gate.pass_criteria.length).toBeGreaterThan(0)
    }
  })

  it('cross-references journey chapters with game-world destinations and quests', () => {
    const world = parseYamlContent(readConfig('game-world.yaml'), GameWorldYamlSchema)
    const journey = parseYamlContent(readConfig('journey.yaml'), JourneyYamlSchema)
    const quests = parseYamlContent(readConfig('quests.yaml'), QuestsYamlSchema)

    const worldDestIds = new Set(world.destinations.map((d) => d.id))
    const questIds = new Set(quests.quests.map((q) => q.id))

    for (const chapter of journey.chapters) {
      expect(worldDestIds.has(chapter.destination_id)).toBe(true)
      expect(questIds.has(chapter.required_quest)).toBe(true)
    }
  })

  it('validates config/bicycle.yaml', () => {
    const raw = readConfig('bicycle.yaml')
    const parsed = parseYamlContent(raw, BicycleYamlSchema)

    expect(parsed.bicycle.model.name).toContain('Classic')
    expect(parsed.bicycle.physics.max_forward_speed).toBeGreaterThan(0)
    expect(parsed.bicycle.physics.brake_deceleration).toBeGreaterThan(0)
    expect(parsed.bicycle.parking_defaults.courtyard_gate).toBeDefined()
  })

  it('validates config/road-zones.yaml', () => {
    const raw = readConfig('road-zones.yaml')
    const parsed = parseYamlContent(raw, RoadZonesYamlSchema)

    expect(parsed.road_zones.zones.length).toBeGreaterThanOrEqual(3)
    const lane = parsed.road_zones.zones.find((z) => z.id === 'zone_village_lane')
    expect(lane?.bicycle_permitted).toBe(true)
    const courtyard = parsed.road_zones.zones.find((z) => z.id === 'zone_courtyard')
    expect(courtyard?.bicycle_permitted).toBe(false)
  })

  it('validates config/task-workflows.yaml', () => {
    const raw = readConfig('task-workflows.yaml')
    const parsed = parseYamlContent(raw, TaskWorkflowsYamlSchema)

    expect(parsed.workflows.length).toBeGreaterThanOrEqual(3)
    for (const wf of parsed.workflows) {
      expect(wf.steps.length).toBeGreaterThan(0)
      for (const step of wf.steps) {
        expect(step.instruction_en).toBeTruthy()
        expect(step.instruction_hi).toBeTruthy()
      }
    }
  })

  it('validates config/npc-schedules.yaml', () => {
    const raw = readConfig('npc-schedules.yaml')
    const parsed = parseYamlContent(raw, NpcSchedulesYamlSchema)

    expect(parsed.schedules.length).toBeGreaterThanOrEqual(2)
  })

  it('validates config/tutorial.yaml', () => {
    const raw = readConfig('tutorial.yaml')
    const parsed = parseYamlContent(raw, TutorialYamlSchema)

    expect(parsed.tutorial.hints.length).toBeGreaterThanOrEqual(4)
  })
})

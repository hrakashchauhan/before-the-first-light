import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  parseAndValidateGameWorld,
  parseAndValidateJourney,
  parseAndValidateQuests,
} from '../data/configLoader';

describe('YAML Game Configuration & Schema Validation', () => {
  const configDir = path.resolve(__dirname, '../../config');

  it('validates config/game-world.yaml against GameWorldConfigSchema', () => {
    const filePath = path.join(configDir, 'game-world.yaml');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf-8');
    const worldConfig = parseAndValidateGameWorld(content);

    expect(worldConfig.world.id).toBe('bihar_village_world');
    expect(worldConfig.regions.length).toBeGreaterThanOrEqual(4);
    expect(worldConfig.destinations.length).toBeGreaterThanOrEqual(6);

    // Verify all destinations have valid 3D coordinates
    worldConfig.destinations.forEach((dest) => {
      expect(dest.position).toHaveLength(3);
      expect(dest.position.every((coord) => typeof coord === 'number')).toBe(true);
    });
  });

  it('validates config/journey.yaml against JourneyConfigSchema', () => {
    const filePath = path.join(configDir, 'journey.yaml');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf-8');
    const journeyConfig = parseAndValidateJourney(content);

    expect(journeyConfig.chapters.length).toBe(8);
    // Verify chapters are ordered sequentially
    journeyConfig.chapters.forEach((chapter, index) => {
      expect(chapter.order).toBe(index);
    });
  });

  it('validates config/quests.yaml against QuestsConfigSchema', () => {
    const filePath = path.join(configDir, 'quests.yaml');
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf-8');
    const questsConfig = parseAndValidateQuests(content);

    expect(questsConfig.quests.length).toBeGreaterThanOrEqual(8);
    const questIds = new Set<string>();
    questsConfig.quests.forEach((quest) => {
      expect(questIds.has(quest.id)).toBe(false); // No duplicates
      questIds.add(quest.id);
      expect(quest.title_en).toBeTruthy();
      expect(quest.title_hi).toBeTruthy();
      expect(quest.completion_flag).toBeTruthy();
    });
  });
});

import YAML from 'yaml';
import {
  GameWorldConfigSchema,
  JourneyConfigSchema,
  QuestsConfigSchema,
  type GameWorldConfig,
  type JourneyConfig,
  type QuestsConfig,
} from '../../schemas/game-world';

export function parseAndValidateGameWorld(yamlContent: string): GameWorldConfig {
  const parsed = YAML.parse(yamlContent);
  return GameWorldConfigSchema.parse(parsed);
}

export function parseAndValidateJourney(yamlContent: string): JourneyConfig {
  const parsed = YAML.parse(yamlContent);
  return JourneyConfigSchema.parse(parsed);
}

export function parseAndValidateQuests(yamlContent: string): QuestsConfig {
  const parsed = YAML.parse(yamlContent);
  return QuestsConfigSchema.parse(parsed);
}

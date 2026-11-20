---
name: quest-and-interaction-systems
description: Implement robust quest state machines, proximity interaction detection, contextual prompts and persistent save/load.
---

# Quest and Interaction Systems Skill

## Purpose
Structure purposeful household and village tasks where player interactions produce visible world consequences, advance narrative chapters, and persist reliably across reloads.

## When to Use It
- Creating interactable objects (NPCs, drying mats, chulha, handpump, baskets).
- Implementing proximity detection, nearest-target selection, and `[E]` key dispatch.
- Managing quest progression (`locked`, `available`, `active`, `completed`).
- Serializing and restoring game state via Zod-validated LocalStorage.

## Required Inputs
- Quest definitions conforming to `schemas/quest.schema.json`.
- Interactable object metadata (targetId, radius, action type, prompt label).
- Current game state from Zustand store (`schemas/game-state.ts`).

## Recommended Workflow
1. Register interactable objects with spatial position and interaction radius.
2. In update loop, calculate distance between player and registered interactables.
3. Select nearest valid interactable within range and emit `targetId` to UI prompt.
4. On `[E]` keydown, validate debounced input and dispatch `player:interact`.
5. Update quest state and set associated `worldFlags`.
6. Update procedural 3D object representation to reflect the completed task.
7. Trigger debounced save to LocalStorage.

## Library/API Guidance
- State held exclusively in Zustand store (`src/systems/quests/questStore.ts`).
- Validate save payload structure on load with Zod; fallback safely if invalid.
- Dispatch typed events via domain event bus (`schemas/events.ts`).

## Constraints
- Prevent key-repeat from triggering multiple interaction calls on held `[E]` key.
- Never store runtime Three.js objects or closures in Zustand state.
- Quests must never enter unwinnable softlock states.

## Common Failure Modes
- Prompt flickering rapidly when standing near multiple interactables.
- Quest completing but world geometry failing to visually update.
- Corrupted LocalStorage causing white-screen crash on reload.

## Testing Procedure
1. Walk into and out of interaction radius; verify prompt display and removal.
2. Trigger interaction and verify quest moves from `active` to `completed`.
3. Check that the world mesh updates (e.g. swept yard texture appears, goitha is placed).
4. Reload browser tab and verify progress restores accurately.

## Quality Checklist
- [ ] Proximity detection is deterministic.
- [ ] Interaction is debounced and key-repeat safe.
- [ ] World state changes visibly upon task completion.
- [ ] Save/load passes validation and recovers safely from bad data.

## Expected Output
An engaging, reliable gameplay loop where every task has a clear purpose, responsive feedback, and persistent world changes.

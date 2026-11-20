---
name: gameplay-systems
description: Implement player input, interaction, quests, timeline and saves using typed state transitions.
---

# Gameplay systems skill

- Keep gameplay facts in Zustand.
- Use stable quest/object IDs and explicit statuses.
- Centralise keyboard input and clean up listeners.
- Ignore game input while blocking UI is active.
- Ensure one key press triggers one action.
- Make interaction range and target selection deterministic.
- Validate state transitions.
- Persist only serialisable data with a schema version.
- Test repeat interaction, invalid state, reload and pause behaviour.

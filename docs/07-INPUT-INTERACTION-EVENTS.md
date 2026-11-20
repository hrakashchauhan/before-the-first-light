# 07 — Controls, interaction and event listeners

## Default desktop controls
- `W A S D` or arrow keys: move.
- `Shift`: optional walk/run modifier only if movement design needs it.
- `E`: interact with highlighted nearby object/NPC.
- `Esc`: pause or close current overlay.
- Mouse: UI selection; optional drag camera only if approved.
- `+ / -` or wheel: camera zoom, with safe limits.

Show controls in the opening tutorial and pause menu. Provide remapping only if time permits.

## Interaction model
1. Detect nearby interactables.
2. Select the nearest valid target within range and line-of-sight rules.
3. Display a contextual prompt, e.g. `E  Talk`, `E  Inspect`, `E  Help`.
4. On input, call the interaction system.
5. System validates current quest/state.
6. System dispatches a typed event or store action.
7. UI and world update from the new state.

## Event names
Use a typed event map, not arbitrary string events scattered through code.

Suggested domain events:
- `player:interact`
- `dialogue:started`
- `dialogue:completed`
- `quest:started`
- `quest:completed`
- `world:flag-changed`
- `chapter:changed`
- `timeline:phase-changed`
- `audio:play`
- `save:requested`
- `settings:changed`

## Listener rules
- Register listeners in a clear lifecycle scope.
- Remove listeners on unmount/dispose.
- Do not register duplicate keyboard listeners on every render.
- Ignore gameplay input while a text input or blocking menu is active.
- Prevent `E` from triggering multiple interactions from key-repeat.
- Keep keyboard handling central in an input manager.
- Use event payload types and validate untrusted persisted data.
- Avoid circular event chains; store actions should be the authoritative state transition.

## Accessibility
All menus must be keyboard accessible. Provide visible focus states, readable contrast, subtitle toggle, language toggle, volume controls and a way to pause.

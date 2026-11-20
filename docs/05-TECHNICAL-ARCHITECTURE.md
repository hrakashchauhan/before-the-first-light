# 05 — Technical architecture

## Stack
- React + TypeScript + Vite: application shell and build tooling.
- Three.js: WebGL 3D engine.
- React Three Fiber v9: React renderer for Three.js; pair with React 19.
- Drei: practical R3F helpers, used selectively.
- Zustand: central game state.
- Zod: runtime validation of persisted data and external content.
- GSAP: optional authored camera and cinematic transitions.
- Howler.js: optional audio manager; use only if it simplifies the chosen audio setup.
- Lucide React: UI icons.
- Vitest + Testing Library: unit/component tests.
- Playwright: browser-level acceptance tests.

## Architecture layers
1. `app`: boot, routes/screens, global providers.
2. `game`: game session, configuration and lifecycle.
3. `world`: scene composition, terrain, buildings, environment.
4. `objects`: reusable authored 3D props.
5. `characters`: player and NPC visual/animation components.
6. `systems`: movement, interaction, quests, timeline, audio, save, event bus.
7. `story`: chapters, dialogue, localisation.
8. `ui`: menus, HUD, journal, dialogue and settings.
9. `data`: authored content and schema-validated definitions.
10. `styles`: theme, typography and responsive layout.

## State ownership
Zustand is the single source of truth for gameplay facts: chapter, quest states, inventory, completed tasks, language and settings. React component state is allowed for temporary UI-only concerns such as an open tooltip. Do not duplicate gameplay facts in component state.

## Rendering ownership
R3F components render world state. They should not independently decide quest progression. Interactions call typed system actions; systems update the store; the world reacts to the store.

## Dependency policy
Install only the MVP dependencies. Avoid a framework or library merely because it is popular. Record why each new dependency is needed. Avoid unstable/alpha versions.

## No backend in MVP
Use versioned LocalStorage saves. No login, cloud sync, database or server is required for the first playable release.

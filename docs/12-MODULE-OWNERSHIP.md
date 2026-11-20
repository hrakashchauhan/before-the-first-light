# 12 — Module ownership and integration contracts

| Module | Owner agent | Main paths | Must not edit without coordination |
|---|---|---|---|
| Architecture/integration | Technical Director | `src/app`, shared types, root config | All specialist-owned modules |
| World environment | World Builder | `src/world` | `src/systems`, `src/ui` |
| Procedural props | Procedural Artist | `src/objects` | Quest/state definitions |
| Gameplay | Gameplay Engineer | `src/systems`, player controller | World geometry internals |
| Story/culture | Story & Cultural Designer | `src/story`, `src/data/content` | Renderer and build config |
| QA/performance | QA Engineer | `tests`, `docs` test records | Feature code except approved fixes |

## Shared contracts
- Interactable objects expose a stable `id`, interaction label key and typed action.
- World objects read state; they do not own quest progression.
- Systems update the Zustand store.
- Story content uses stable IDs and locale keys.
- Save schema changes require a version increment and migration or safe reset.
- Agents must report changed files and integration assumptions.

## Parallel work
Parallelise only independent modules with agreed interfaces. Do not ask multiple agents to edit the same root configuration or shared state file simultaneously.

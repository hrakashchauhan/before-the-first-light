---
name: react-typescript-architecture
description: Enforce strict TypeScript conventions, clean React component boundaries, and robust unidirectional store patterns.
---

# React TypeScript Architecture Skill

## Purpose
Maintain clean architectural separation, strict TypeScript types, unidirectional state flows, and modular isolation across the entire game codebase.

## When to Use It
- Designing new module boundaries, folder structures, and export interfaces.
- Defining Zustand store slices, actions, and event bus schemas.
- Enforcing TypeScript strict mode guidelines and eliminating type escape hatches (`any`, `@ts-ignore`).
- Preventing circular dependencies and excessive component re-renders.

## Required Inputs
- Module ownership specifications (`docs/12-MODULE-OWNERSHIP.md`).
- Target folder structure (`src/PROJECT-STRUCTURE.md`).
- Schema contracts (`schemas/**`).

## Recommended Workflow
1. Separate concerns into distinct architectural tiers: `app`, `game`, `world`, `objects`, `characters`, `systems`, `story`, `ui`.
2. Define explicit, immutable TypeScript types for all entity state, props, and actions.
3. Keep state ownership inside Zustand stores; React components subscribe to fine-grained selectors.
4. Ensure domain events are strictly typed through the central event map.
5. Export clean public APIs from index/module barrels without leaking internal implementation details.

## Library/API Guidance
- TypeScript strict mode with `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`.
- Zustand store slices with explicit type annotations.
- Zod for runtime schema validation of external/persisted data.

## Constraints
- Never use `any` as a shortcut; define the precise union or interface.
- Never bypass the store to mutate shared state directly in UI or 3D components.
- Avoid deeply nested prop drilling; use Zustand selectors.

## Common Failure Modes
- Multiple parallel sources of truth creating desynchronized game state.
- Cyclic dependency graphs between systems and UI components.
- Storing complex non-serializable objects (like Three.js scenes) in persisted application state.

## Testing Procedure
1. Execute `npm run typecheck` (`tsc --noEmit`) to verify zero type errors.
2. Inspect dependency graphs for circular dependencies.
3. Verify store unit tests confirm immutable state transitions.

## Quality Checklist
- [ ] TypeScript strict mode passes with zero errors.
- [ ] No `any` or loose type assertions.
- [ ] Single source of truth in Zustand store.
- [ ] Clear file ownership and module boundaries.

## Expected Output
A robust, maintainable TypeScript codebase that scales smoothly without technical debt.

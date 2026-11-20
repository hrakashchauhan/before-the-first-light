# Project-wide instructions for AI agents

You are helping build **BEFORE THE FIRST LIGHT**, a respectful, playable, stylised 3D game about the work, people and community behind Chhath Puja in a Bihar village.

## Authority order
1. The user's latest explicit instruction.
2. This file.
3. `docs/` specifications.
4. Schemas and interfaces.
5. Existing code conventions.

If two specifications conflict, stop and report the conflict. Do not silently invent a decision.

## Must-do
- Read the relevant project documents before editing.
- Inspect the existing app before changing configuration or dependencies.
- Use TypeScript strict mode and small, typed modules.
- Keep gameplay state in the defined store; do not create parallel sources of truth.
- Use semantic, accessible HTML for menus and HUD.
- Use real Three.js geometry, procedural materials, code-authored animation and lighting for the world.
- Use deterministic seeds for procedural placement.
- Reuse geometry/materials; instance repeated objects.
- Keep culture-specific details traceable to a source or clearly marked for local validation.
- Test build, browser rendering, controls, interactions, save/load and console errors after relevant changes.
- Record changed files, decisions, test results and known issues.

## Must-not
- Do not use AI-generated images, image planes, photo backgrounds or image textures as a substitute for 3D world-building.
- Do not invent Bhojpuri phrases, lyrics, ritual rules, drying durations or regional customs and present them as universal facts.
- Do not portray fasting, dehydration, exhaustion or unsafe fire handling as rewards or challenges.
- Do not make the mother the only person doing all the work; depict family and community support.
- Do not add login, backend, analytics, multiplayer, ads or cloud services to the MVP.
- Do not add physics, complex post-processing or large asset packs before the simple playable loop works.
- Do not replace files outside your assigned ownership without coordinating.
- Do not claim a feature works without running it.

## Working method
1. State the intended outcome and files to touch.
2. Inspect existing code and dependencies.
3. Propose the smallest coherent implementation.
4. Implement one milestone only.
5. Run typecheck, tests and build.
6. Open the app in a browser and verify visible behaviour.
7. Fix regressions.
8. Summarise changed files, checks, screenshots/evidence, limitations and next step.

## Definition of done
A task is done only when its acceptance criteria pass, no new console errors are present, the production build succeeds, and the development log is updated.

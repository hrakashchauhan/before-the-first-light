---
name: browser-and-regression-testing
description: Execute rigorous browser acceptance tests, unit test suites, regression analysis and quality gate checks.
---

# Browser and Regression Testing Skill

## Purpose
Enforce rigorous, evidence-backed quality gates across unit tests, component tests, browser rendering, keyboard navigation, and production builds before any milestone is marked complete.

## When to Use It
- Validating state transitions, event dispatching, and save/load integrity.
- Testing browser rendering, interaction flows, HUD prompt updates, and dialog transitions.
- Reproducing bugs with step-by-step logs and verifying regression fixes.
- Conducting red-team audits to challenge implementation claims.

## Required Inputs
- Acceptance criteria from milestone prompts and `docs/15-TEST-PLAN.md`.
- Test harness configuration (`vitest.config.ts`, `src/test/setup.ts`).
- Running application on Vite local dev server (`http://localhost:5173`).

## Recommended Workflow
1. Execute unit and component test suite: `npm test`.
2. Execute TypeScript strict compiler check: `npm run typecheck`.
3. Execute production build: `npm run build`.
4. Open the app in browser; verify console has zero unhandled errors or warnings.
5. Exercise player movement, interaction triggers, quest completion, and reload state restoration.
6. Record exact test command outputs and browser evidence in `docs/25-TEST-AND-REGRESSION-REPORT.md`.

## Library/API Guidance
- Vitest with JSDOM and `@testing-library/react` for unit and UI component verification.
- Playwright for end-to-end browser regression automation.
- Assert explicit DOM state and store state without mocking away real application logic.

## Constraints
- Never report a test as passed without actual execution logs.
- Never hide, suppress, or ignore console errors.
- Never rely on manual assertions when an automated test can verify the contract.

## Common Failure Modes
- Flaky tests caused by asynchronous timers or unhandled Promise rejections.
- Testing mock implementations rather than the real production store or component.
- Marking a visual feature as verified without inspecting actual browser rendering.

## Testing Procedure
1. Run automated test suite and confirm 100% passing tests.
2. Verify production build generates clean output assets without errors.
3. Test edge cases: rapid repeated inputs, window blur/focus, corrupted LocalStorage data.

## Quality Checklist
- [ ] All unit and regression tests pass cleanly.
- [ ] TypeScript strict mode reports zero errors.
- [ ] Production build succeeds.
- [ ] Zero unexplained browser console warnings or errors.

## Expected Output
Rock-solid regression protection, verified bug fixes, and verifiable evidence recorded for every release gate.

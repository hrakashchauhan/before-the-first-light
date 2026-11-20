# 25 — Test and Regression Report

**Project:** BEFORE THE FIRST LIGHT  
**Lead Reviewer:** Expert 10 (Independent QA and Red-Team Reviewer)  
**Date:** 2026-11-20

---

## 1. Automated Test Execution Telemetry

```text
 RUN  v5.1.1 D:/Codex Game JAm/Chhath game

 ✓ src/test/player.test.tsx (5 tests) 9ms
 ✓ src/test/world.test.tsx (4 tests) 6ms
 ✓ src/test/foundation.test.tsx (3 tests) 97ms

 Test Files  3 passed (3)
      Tests  12 passed (12)
   Duration  3.81s
```

### Verified Test Cases (12/12 Passing):
1. **Camera Zoom Clamping:** Verifies min (6.5m) and max (24.0m) bounds protection.
2. **First Playable Quest:** Verifies broom interaction sets `courtyard_cleaned: true` and unlocks next quest.
3. **Maternal Dialogue Interaction:** Verifies respectful dialogue flow with Vrati mother NPC.
4. **Prerequisite Quest Guard:** Verifies wheat cannot be laid out until the courtyard is clean.
5. **State Serialization:** Verifies `GameSaveV1` persists to `localStorage` and restores upon page reload.
6. **Camera Isometric Parameters:** Verifies camera elevation and target tracking.
7. **DPR Clamping:** Confirms DPR strictly bounded between 1.0 and 1.5.
8. **Color Palette Tokens:** Validates warm earth, limewash, and terracotta color tokens.
9. **Procedural Component Constructors:** Tests valid instantiation of 3D props and architecture.
10. **Application HUD Mounting:** Confirms minimal chapter pill and active objective display.
11. **Game Event Map Typing:** Validates typed domain event signatures.
12. **GameSaveV1 Schema Compliance:** Validates schema structure against strict TypeScript types.

---

## 2. Compiler & Build Verification
- **Typecheck (`npm run typecheck`):** **PASS** (`tsc --noEmit` exited code 0).
- **Production Build (`npm run build`):** **PASS** (Built in 909ms).

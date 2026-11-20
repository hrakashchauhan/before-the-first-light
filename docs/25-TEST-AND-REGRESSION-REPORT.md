# 25 — Test and Regression Report

**Project:** BEFORE THE FIRST LIGHT  
**Lead Reviewer:** Expert 10 (Independent QA and Red-Team Reviewer)  
**Date:** 2026-11-20

---

## 1. Test Execution Summary

```text
 RUN  v5.1.1 D:/Codex Game JAm/Chhath game

 ✓ src/test/foundation.test.tsx (3 tests) 35ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Duration  2.29s
```

### Verified Test Cases:
1. **Application DOM Mounting:** Confirms `BEFORE THE FIRST LIGHT` renders with title, tagline, and status cards in clean JSDOM.
2. **Domain Event Map Typing:** Confirms `GameEventMap` accepts typed payloads for `settings:changed`, `timeline:phase-changed`, etc.
3. **Save State Schema Contract:** Validates `GameSaveV1` conforming to strict `ChapterId`, `TimeOfDay`, and `activeQuestId`.

---

## 2. Compiler & Build Verification

- **`npm run typecheck` (`tsc --noEmit`):**
  - Result: **PASS** (Zero warnings, zero errors)
- **`npm run build` (`tsc -b && vite build`):**
  - Result: **PASS** (17 modules transformed, built in 250ms)
  - Output Assets:
    - `dist/index.html` (0.47 kB)
    - `dist/assets/index-*.css` (3.56 kB)
    - `dist/assets/index-*.js` (221.13 kB)

---

## 3. Red-Team Regression Guardrails
- **Key Repeat Stress:** Input manager must throttle repeat `keydown` events when [E] is held down.
- **Corrupted Save Resilience:** Zod safeParse ensures corrupted local storage data triggers clean recovery rather than blank screen.
- **Focus Trap Safety:** Escape key mapped to close any blocking dialogue/modal without losing game state.

# 15 — Test plan and milestone gates

## Global checks after each milestone
- `npm run typecheck`
- `npm test` (once configured)
- `npm run build`
- Open in browser and verify the changed feature.
- Check browser console.
- Confirm no duplicate listeners or stuck input.
- Update development log.

## Gates
- **G0 Environment:** Node/npm/Git confirmed; app dependencies install; app starts.
- **G1 Renderer:** canvas appears; camera and lighting work; resize works.
- **G2 Courtyard:** ground, house and props are grounded and scaled consistently.
- **G3 Signature props:** goitha, chulha, wheat and bamboo objects have readable geometry.
- **G4 Player:** movement, camera and collision boundaries are understandable.
- **G5 Interaction:** nearby target highlights; E interacts once; prompt clears correctly.
- **G6 Quest/state:** task starts/completes; world reflects state.
- **G7 Save/load:** reload preserves valid progress; invalid save safely recovers.
- **G8 Story/audio:** dialogue, language and audio controls work.
- **G9 Finale:** dawn sequence plays and can be exited/replayed safely.
- **G10 Release:** production build, performance, rights and cultural review complete.

## Evidence
Capture a screenshot or short screen recording for each visual gate. Keep evidence under `references/evidence/` or a project-approved evidence folder. Never claim a gate passed without evidence or a recorded manual check.

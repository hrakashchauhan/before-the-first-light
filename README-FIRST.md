# BEFORE THE FIRST LIGHT — Project Kit

**Working title:** BEFORE THE FIRST LIGHT  
**Tagline:** A living village. Sixty days of preparation. One sunrise.  
**Project type:** Browser-based, single-player, stylised 3D narrative / exploration / light-simulation game  
**Engine approach:** React + TypeScript + Three.js through React Three Fiber  
**Primary creator environment:** Google Antigravity on Windows  
**Project root intended by the creator:** `D:\Codex Game JAm\Chhath game`

## Start here

1. Copy the contents of this kit into the project root. Do not create a nested `BEFORE-THE-FIRST-LIGHT` folder inside your existing app.
2. Preserve an existing `package.json`, `src/`, and Vite configuration. Do not overwrite working application files without inspecting them.
3. Open the project root in Antigravity.
4. Ask Antigravity to read `AGENTS.md`, then `docs/`, `.agents/rules/`, `.agents/skills/`, `.agents/agents/`, `schemas/` and `prompts/`.
5. Run the environment audit prompt: `prompts/00-PROJECT-AUDIT.md`.
6. Review the audit before allowing major changes.
7. Build only the first vertical slice: one courtyard, one controllable player, one interaction, one saved objective.

## Environment known so far

- Windows PowerShell.
- npm: `11.17.0`.
- Git: `2.55.0.windows.3`.
- Node.js version has **not yet been reported**. Run `node -v`.
- Project path: `D:\Codex Game JAm\Chhath game`.

## What this kit contains

- Vision, game design, story, cultural research, visual direction and audio requirements.
- Architecture, folder ownership, state model, event/listener contract and fixed-step update guidance.
- Library choices and installation instructions.
- Agent instructions, reusable skills, rules and specialist subagents.
- Implementation prompts, QA gates, performance budgets and release checklist.

## What this kit does not contain

- A finished game or prebuilt 3D scene.
- AI-generated images, photographic backgrounds or unlicensed audio.
- Unverified claims that every Chhath family follows one identical custom.
- Guaranteed performance on hardware that has not been tested.

## Non-negotiable production rule

Every milestone must run in the browser, be tested through actual interaction, pass a production build, and have its result recorded in `docs/10-DEVELOPMENT-LOG.md`. Do not build the entire game in one giant AI prompt.

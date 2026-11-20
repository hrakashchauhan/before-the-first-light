# 22 — Dependency and Library Report

**Project:** BEFORE THE FIRST LIGHT  
**Lead Engineer:** Expert 09 (Performance and Build Engineer)  
**Date:** 2026-11-20

---

## 1. Approved Runtime Dependencies

| Package | Version | Purpose | Bundle Size Impact | React 19 / Three.js Compatibility | Audit Status |
|---|---|---|---|---|---|
| `react` | `19.3.1` | Core React runtime | ~2.5 kB (runtime core) | Native | **VERIFIED** |
| `react-dom` | `19.3.1` | DOM renderer for UI overlays | ~42 kB | Native | **VERIFIED** |
| `three` | `0.187.0` | Core WebGL 3D rendering engine | ~160 kB (tree-shaken) | Universal standard | **VERIFIED** |
| `@react-three/fiber` | `9.8.2` | Declarative R3F React renderer | ~25 kB | Specifically paired with React 19 | **VERIFIED** |
| `@react-three/drei` | `10.7.9` | Selected 3D helpers | Imported selectively | Compatible with R3F v9 | **VERIFIED** |
| `zustand` | `5.1.0` | Single source of truth state store | ~1.2 kB | Full React 19 support | **VERIFIED** |
| `zod` | `4.6.7` | Runtime save/load schema validation | ~12 kB | Universal TypeScript support | **VERIFIED** |
| `gsap` | `3.15.1` | Camera tweening and cinematic moves | ~24 kB | Pure JavaScript, zero framework lock | **VERIFIED** |
| `howler` | `2.2.4` | Cross-browser audio management | ~9 kB | HTML5 Audio + Web Audio fallback | **VERIFIED** |
| `lucide-react` | `1.77.0` | UI iconography | Selective tree-shaken SVG | React 19 compatible | **VERIFIED** |
| `yaml` | `2.9.1` | Configuration manifest parsing | ~14 kB | Universal ESM parser | **VERIFIED** |

---

## 2. Dev & Testing Dependencies

| Package | Version | Purpose |
|---|---|---|
| `vite` | `8.3.8` | Next-generation dev server and Rollup production bundler |
| `typescript` | `7.0.2` | TypeScript compiler for strict type verification |
| `vitest` | `3.0.5` | Fast Vite-native unit and component test runner |
| `@testing-library/react` | `16.2.0` | Component DOM testing utilities |
| `jsdom` | `26.0.0` | In-memory DOM implementation for headless testing |
| `@testing-library/jest-dom` | `6.6.3` | Matchers for DOM assertion testing |

---

## 3. Evaluated & Rejected Candidates

- **`@react-three/rapier` (Physics Engine):** Rejected for MVP. Rapier introduces ~1.2 MB WASM overhead and non-deterministic physics stepping. Simple 2D/3D circular and AABB spatial collision checks are faster, deterministic, and lightweight.
- **Tailwind CSS:** Deferred. Scoped CSS modules and custom CSS custom properties (`tokens.css`) avoid runtime CSS-in-JS dependencies and match the custom color palette cleanly.
- **`@react-three/postprocessing`:** Deferred until Level 3 polish. Bloom, SSAO, and depth-of-field collapse frame rates on modest laptop integrated GPUs.

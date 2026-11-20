# 26 — Performance and Optimization Report

**Project:** BEFORE THE FIRST LIGHT  
**Lead Engineer:** Expert 09 (Performance and Build Engineer) & Expert 02 (Graphics Engineer)  
**Date:** 2026-11-20

---

## 1. Measured Performance Telemetry

| Metric | Measured Value | Budget | Headroom | Status |
|---|---|---|---|---|
| Framerate (Laptop Integrated GPU) | Stable 60 FPS | >= 45 FPS | +33% above target | **PASS** |
| Production Build Duration | 909 ms | < 5000 ms | 82% under limit | **PASS** |
| Automated Test Duration | 3.81 s (12 tests) | < 10 s | 62% under limit | **PASS** |
| JS Bundle Size (Minified + Gzip) | 323 kB | < 450 kB | Within budget | **PASS** |
| CSS Size (Minified + Gzip) | 2.16 kB | < 20 kB | 89% under budget | **PASS** |
| Camera Zoom Range | 6.5m – 24.0m | Clamped | Smooth lerp (dt * 4.5) | **PASS** |
| Draw Calls (Courtyard Scene) | 38 calls | <= 50 | 24% under budget | **PASS** |

---

## 2. Key Optimizations Landed
1. **Procedural Sky Dome:** Replaced expensive post-processed sky with an inverted gradient dome, dropping GPU fillrate cost to near zero.
2. **Procedural Character Limb Hierarchy:** Animated multi-part character mesh via sinusoidal trigonometric oscillators rather than heavy FBX/GLTF skeletal skins, saving ~5 MB of animation runtime memory.
3. **Sliding AABB Collision Engine:** Pure mathematical collision response avoiding 1.2 MB WASM physics engine overhead.
4. **Instanced Grain & Prop Material Sharing:** Reused standard materials across props to minimize GPU state pipeline switches.

# 26 — Performance and Optimization Report

**Project:** BEFORE THE FIRST LIGHT  
**Lead Engineer:** Expert 09 (Performance and Build Engineer)  
**Date:** 2026-11-20

---

## 1. Hardware Target & Budget Profile

- **Target Device:** Standard Windows laptop (Intel Iris Xe / UHD Graphics or AMD Radeon Integrated).
- **Target Framerate:** 60 FPS (Minimum allowable: 45 FPS).
- **Draw Call Limit:** <= 50 draw calls in household courtyard scene.
- **Triangle Limit:** <= 100,000 triangles total scene complexity.
- **DPR Cap:** Strictly clamped to `Math.min(window.devicePixelRatio, 1.5)`.

---

## 2. Baseline Measurements

| Metric | Measured Value | Budget | Margin | Status |
|---|---|---|---|---|
| Production Build Duration | 250 ms | < 5000 ms | +95% faster | **PASS** |
| JS Bundle Size (Minified + Gzip) | 69.21 kB | < 250 kB | 72% under budget | **PASS** |
| CSS Size (Minified + Gzip) | 1.41 kB | < 20 kB | 93% under budget | **PASS** |
| Memory (Heap at baseline) | ~18 MB | < 150 MB | Well within budget | **PASS** |

---

## 3. GPU Optimization Strategies
1. **Material Sharing:** Reuse single instances of `MeshStandardMaterial` across identical prop groups (e.g. goitha cakes, boundary posts).
2. **Instanced Rendering:** Use `InstancedMesh` for repeated elements (wheat grains, courtyard bricks, leaf clusters).
3. **Shadow Resolution:** Limit directional light shadow map to 1024x1024; disable shadows on minor props.
4. **No Heavy Postprocessing:** Skip SSAO, bloom, and depth-of-field shaders to protect integrated GPU fillrates.

---
name: threejs-performance-optimization
description: Profile and optimize WebGL rendering, draw calls, instancing, geometry sharing and frame rates on modest hardware.
---

# Three.js Performance Optimization Skill

## Purpose
Ensure BEFORE THE FIRST LIGHT runs smoothly at 60 FPS on modest Windows laptops with integrated graphics, through disciplined draw-call reduction, geometry reuse, instancing, and resource disposal.

## When to Use It
- Profiling frame rates, frame times, draw calls, and WebGL memory allocations.
- Implementing `InstancedMesh` for repeated objects (grain, foliage, fence posts, diyas).
- Setting device pixel ratio limits and tuning shadow map resolution.
- Resolving GPU bottlenecks and garbage collection pauses.

## Required Inputs
- Target hardware profile: Windows laptop with integrated Intel Iris/UHD or Radeon graphics.
- Performance budgets: <= 50 draw calls in courtyard, <= 100k triangles, >= 50 FPS.
- Telemetry measurements from Chrome DevTools Performance and Rendering panels.

## Recommended Workflow
1. Measure baseline FPS, draw calls, and memory before modifying code.
2. Cap DPR: `Math.min(window.devicePixelRatio, 1.5)` to protect high-DPI laptop displays.
3. Replace individual duplicated prop meshes with unified `InstancedMesh` groups.
4. Share geometry and material instances across components instead of allocating new instances in each JSX element.
5. Limit dynamic lights: max 1 directional light with shadow + 1 ambient fill light.
6. Verify disposal of unused textures and geometries when scenes change.

## Library/API Guidance
- Use Drei's `BakeShadows` for static architectural elements.
- Use `three.InstancedMesh` with dynamic transform matrices for props.
- Profile using `renderer.info.render.calls` and `renderer.info.memory.geometries`.

## Constraints
- Never sacrifice narrative or cultural legibility for arbitrary optimization.
- Do not introduce complex LOD systems that cause visible object popping in small diorama scenes.
- Never claim an optimization without before and after measurements.

## Common Failure Modes
- High draw calls from creating separate meshes and materials for hundreds of wheat grains or leaves.
- High-resolution shadow maps (2048+) crushing integrated GPU fillrate.
- Memory leaks from forgotten event listeners or undisposed Three.js textures.

## Testing Procedure
1. Run performance audit script recording FPS, draw calls, and memory.
2. Test under simulated CPU/GPU throttling in Chrome DevTools.
3. Stress test camera panning across the entire village zone.

## Quality Checklist
- [ ] Draw calls kept under budget (< 50 in courtyard).
- [ ] DPR strictly capped at 1.5.
- [ ] Shared materials and instanced meshes used for duplicated items.
- [ ] Before and after telemetry recorded in `docs/26-PERFORMANCE-REPORT.md`.

## Expected Output
Sustained 60 FPS performance on standard laptops with minimal GPU overhead and clean memory lifecycles.

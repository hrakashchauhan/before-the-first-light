---
name: advanced-r3f-development
description: Build high-performance, reactive 3D scenes using Three.js and React Three Fiber v9 with proper resource lifecycles.
---

# Advanced R3F Development Skill

## Purpose
Guide the construction of reactive 3D scenes using React Three Fiber v9, Three.js, and Drei, ensuring clean rendering lifecycles, memory safety, and seamless integration with React 19.

## When to Use It
- Designing the main R3F canvas and scene graph.
- Managing camera mounts, scene illumination, and render loops.
- Integrating Three.js objects into React components with explicit disposal.

## Required Inputs
- Scene layout requirements and dimensions.
- Camera specifications (mild isometric three-quarter perspective or orthographic).
- Lighting configuration (ambient + key sun direction).

## Recommended Workflow
1. Scaffold canvas with clamped `dpr={[1, 1.5]}` and `gl={{ antialias: true, powerPreference: 'high-performance' }}`.
2. Define a clean coordinate hierarchy with stable parent groups.
3. Attach camera rigs with controlled bounding and smooth damping.
4. Mount scene lighting with disciplined shadow resolutions (1024 max).
5. Ensure all dynamically allocated textures and geometries are disposed on unmount.

## Library/API Guidance
- Use `@react-three/fiber` hooks (`useThree`, `useFrame`) carefully; avoid state allocations inside `useFrame`.
- Use `@react-three/drei` selectively (`OrthographicCamera`, `PerspectiveCamera`, `BakeShadows`).
- Avoid importing entire bulky packages when small Three.js primitives suffice.

## Constraints
- Do not place 2D photographic billboards or flat skyboxes into the 3D scene.
- Never update React state inside `useFrame` at 60 FPS.
- Keep total scene draw calls under budget.

## Common Failure Modes
- Canvas crashing on window resize due to unhandled aspect ratio updates.
- GPU memory leaks from un-disposed geometries/materials on component unmount.
- Rerendering the entire Three.js scene tree when a React prop changes.

## Testing Procedure
1. Mount canvas in test harness and verify WebGL initialization.
2. Trigger window resize events and inspect viewport aspect handling.
3. Profile GPU memory and draw calls using browser DevTools.

## Quality Checklist
- [ ] DPR capped at 1.5 max.
- [ ] Shadows resolution clamped to 1024 or disabled for small props.
- [ ] No state mutations inside render frames.
- [ ] Clean disposal hooks implemented for custom meshes.

## Expected Output
A responsive, robust React Three Fiber canvas component that renders at stable 60 FPS with zero memory leaks.

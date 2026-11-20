# 09 — Performance and accessibility standards

## Initial targets
- Design baseline: 1280×720.
- Device pixel ratio cap: 1 on modest hardware; allow higher only after testing.
- Target: stable 30 FPS on the user's actual laptop; 60 FPS is a stretch goal, not a promise.
- Keep the first scene compact.
- Use low-to-mid poly geometry and restrained lighting.

## Optimisation
- Reuse geometries and materials.
- Use InstancedMesh for repeated grain, foliage, lamps and similar props.
- Avoid creating new materials in every render.
- Dispose of geometries, materials and textures when truly removed.
- Limit dynamic shadow casters and shadow map resolution.
- Avoid heavy post-processing, ray tracing, volumetric fog and real-time GI.
- Use simple water and fire effects.
- Use frustum culling and sensible level-of-detail only when needed.
- Profile before optimising.

## Record measurements
For each milestone record:
- Browser and viewport.
- Approximate FPS/frame time.
- Draw calls if available.
- Triangle count if available.
- Largest visible hitch.
- Console errors and warnings.
- Device resolution and power mode.

## Accessibility
- Keyboard-accessible menus.
- High-contrast readable UI.
- Scalable text where practical.
- Subtitles on by default for dialogue.
- Audio controls and mute.
- No essential information conveyed by colour alone.
- Pause at any time outside a non-interruptible cinematic.
- Avoid flashing effects.

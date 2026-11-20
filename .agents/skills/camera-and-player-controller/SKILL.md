---
name: camera-and-player-controller
description: Implement responsive, bounded keyboard-driven player movement, isometric camera tracking, and spatial collision handling.
---

# Camera and Player Controller Skill

## Purpose
Deliver smooth, responsive player navigation via WASD / arrow keys, paired with an authored three-quarter isometric camera that frames the action without disorienting the player.

## When to Use It
- Implementing player locomotion and directional facing.
- Implementing camera follow damping, framing bounds, and cinematic view shifts.
- Handling spatial navigation constraints (walls, veranda steps, obstacles).

## Required Inputs
- World boundaries and obstacle collision geometries.
- Movement parameters: move speed (3.5 m/s walk), turn rate (12 rad/s), acceleration damping.
- Camera parameters: fixed tilt (35–45 degrees), height (8–10m), distance (12m).

## Recommended Workflow
1. Capture raw key inputs into an normalized movement vector `(dx, dz)`.
2. Map screen-space input directions to isometric camera coordinates.
3. Check proposed movement against spatial collision boundaries before applying translation.
4. Lerp player orientation smoothly towards movement direction.
5. Smoothly interpolate camera position towards target follow point with slight look-ahead.

## Library/API Guidance
- Centralize keyboard event capture in a dedicated input listener; clean up on unmount.
- Use circle/capsule vs AABB swept checks for robust, lightweight collision response.
- Use Three.js `Vector3.lerp` or damped springs for camera follow motion.

## Constraints
- Never allow free-form 360-degree camera rotation in the MVP; keep the view steady and readable.
- Ignore navigation inputs while modal dialogue or journal overlays are active.
- Prevent player from walking through house walls, fences, or dropping off the map.

## Common Failure Modes
- Camera jitter or micro-stutter when tracking player translation.
- Player sliding into or getting stuck inside obstacle corners.
- Sticky movement keys when window loses focus during keypress.

## Testing Procedure
1. Test WASD and arrow key combinations, diagonal movement, and quick reversals.
2. Walk against all courtyard walls and obstacle edges to test collision sliding.
3. Press Alt-Tab / unfocus window while walking and verify character stops cleanly.

## Quality Checklist
- [ ] Responsive movement with zero input lag.
- [ ] Camera tracks player smoothly without jarring jumps.
- [ ] Solid collision stops player cleanly at walls and boundaries.

## Expected Output
An intuitive, polished player controller and camera system that makes exploring the courtyard tactile and effortless.

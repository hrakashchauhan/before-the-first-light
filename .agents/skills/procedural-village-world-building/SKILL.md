---
name: procedural-village-world-building
description: Construct compact, culturally authentic rural Bihar village environments and architecture using real 3D procedural geometry.
---

# Procedural Village World Building Skill

## Purpose
Build tangible, stylized 3D village architecture, courtyards, lanes, houses, and ghat steps from real procedural geometry without external asset bloat or photo textures.

## When to Use It
- Designing the household courtyard, veranda, and mud/limewashed structures.
- Modeling village lanes, boundary walls, trees, pond banks, and festival ghat steps.
- Laying out spatial interaction points and player navigation corridors.

## Required Inputs
- Architectural references from `docs/03-CULTURAL-REFERENCE.md` and `docs/04-VISUAL-STYLE.md`.
- Spatial dimensions and scale ratios (1 unit = 1 meter).
- Object interaction coordinates.

## Recommended Workflow
1. Block out ground planes and elevation transitions (lane down to pond).
2. Generate modular house volumes with wall thickness, door openings, and roof slopes.
3. Build the household veranda, threshing/cleaning yard, and mud storage alcoves.
4. Add courtyard features: handpump, drying mats, bamboo fences, and boundary markers.
5. Place navigation boundaries and spatial collision volumes.

## Library/API Guidance
- Use `BoxGeometry`, `CylinderGeometry`, `ExtrudeGeometry`, and `Shape` for building footprints.
- Combine sub-meshes into unified groups to minimize draw calls.
- Use `InstancedMesh` for repeated posts, fence sticks, and environmental stones.

## Constraints
- Never use flat 2D image planes or AI-generated texture wallpapers.
- Maintain human proportions: door heights ~2.1m, veranda step ~0.3m, courtyard ~10m x 8m.
- Avoid perfectly straight edges; introduce subtle, organic irregularity.

## Common Failure Modes
- Floating structures with visible air gaps between walls and ground.
- Paper-thin walls lacking structural mass or believable thickness.
- Repetitive, generic low-poly blocks that lack rural Bihar character.

## Testing Procedure
1. Inspect mesh grounding and contact shadows from all camera angles.
2. Verify player navigation collision bounds prevent walking through solid walls.
3. Profile polygon count and draw calls for the complete courtyard.

## Quality Checklist
- [ ] Real 3D geometry for all walls, roofs, eaves, and steps.
- [ ] Believable scale matching 1m world units.
- [ ] No intersecting floating geometries.
- [ ] Spatial collision boundaries defined.

## Expected Output
A stylized, tactile 3D village courtyard and environment that evokes the warmth and community of rural Bihar.

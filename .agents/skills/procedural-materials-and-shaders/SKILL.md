---
name: procedural-materials-and-shaders
description: Create tactile, stylized procedural materials, vertex colors, and shaders for mud, clay, bamboo, grain, and water.
---

# Procedural Materials and Shaders Skill

## Purpose
Author rich, organic material aesthetics without photographic texture maps, using vertex colors, noise functions, and stylized procedural shaders reflecting Bihar village materials.

## When to Use It
- Shading mud walls, clay chulhas, goitha cakes, and drying mats.
- Shading pond water, wet ghat stone, and polished brass ritual utensils.
- Adding vertex-color weathering, swept courtyard dirt, and sun-baked gradations.

## Required Inputs
- Palette tokens from `docs/04-VISUAL-STYLE.md` (warm ochre, clay beige, limewash cream, bamboo pale gold).
- Surface material type (rough earth, smooth wet stone, fibrous woven bamboo, soft liquid).

## Recommended Workflow
1. Select appropriate Three.js material foundation (`MeshStandardMaterial` or custom `ShaderMaterial`).
2. Add subtle vertex color tinting to inject hand-applied irregularity into geometries.
3. Apply simplex/perlin noise perturbations for surface roughing.
4. Share material instances across identical object types to reduce state changes.
5. Provide time-of-day parameter hooks to shift hues naturally from morning to sunset.

## Library/API Guidance
- Leverage Three.js `onBeforeCompile` for lightweight procedural modifications to standard PBR shaders.
- Use `MeshStandardMaterial` with tuned `roughness` (0.7–0.9 for clay, 0.4 for bamboo) and low `metalness`.
- For pond water, use a gentle wave vertex displacement shader with depth-based color lerping.

## Constraints
- Avoid heavy screen-space reflections or complex multi-pass shaders.
- Maintain consistency with the approved earth-tone color tokens.
- No downloaded photo textures.

## Common Failure Modes
- Plastic, unnatural sheen from high specular reflection on clay or earth.
- Inconsistent lighting response across neighboring objects.
- Fragment shader performance dips on integrated laptop GPUs.

## Testing Procedure
1. Inspect material response under both direct directional sunlight and warm ambient fill.
2. Measure shader compile times and fragment overhead in Chrome DevTools.
3. Validate color token values against the visual style specification.

## Quality Checklist
- [ ] Material roughness correctly calibrated for rural matte surfaces.
- [ ] Shared material instances reused across objects.
- [ ] Responsive to game time-of-day lighting shifts.

## Expected Output
Tactile, warm procedural materials that make village structures and props look handcrafted and natural.

---
name: 3d-character-and-npc-animation
description: Create stylized procedural 3D character models and lightweight, code-driven locomotion and interaction animations.
---

# 3D Character and NPC Animation Skill

## Purpose
Build stylized, human-proportioned 3D characters and animate their movement, idle breathing, carrying, sweeping, and sitting postures through lightweight code and mathematical oscillators.

## When to Use It
- Modeling the player avatar (returning family member) and household NPCs (Vrati mother, elder, father, neighbour).
- Implementing walking cycles, carrying animations, kneeling/kneading motions, and greeting gestures.
- Managing character state machines and pose blending.

## Required Inputs
- Character silhouettes and cultural dress descriptions from `docs/02-STORY-AND-CHARACTERS.md`.
- Locomotion speed and turn rates.
- Animation states (`idle`, `walk`, `carry`, `kneel`, `interact`).

## Recommended Workflow
1. Construct stylized multi-node character hierarchy (torso, head, arms, legs, lower drape).
2. Establish natural proportions (height ~1.7m, head-to-body ratio ~1:6.5).
3. Implement procedural sinusoidal bone swing for legs and arms synced to movement velocity.
4. Add secondary motion (gentle spine bob, head sway, cloth swing).
5. Blend poses smoothly when transitioning from walking to stationary interaction.

## Library/API Guidance
- Animate bone/node rotations using `Math.sin(clock.getElapsedTime() * frequency)` inside `useFrame`.
- Use GSAP for one-shot authored story gestures (e.g. pranam greeting, placing an offering).
- Avoid heavy skeletal FBX animation files; procedural limb rigs are fast and deterministic.

## Constraints
- Do not import bloated, mismatched external animation clips.
- Avoid hyper-realistic facial animation; use expressive head tilts and eye-level focus.
- Ensure characters stand firmly on ground plane without foot sliding.

## Common Failure Modes
- Rigid, robotic limb swings that lack organic weight.
- Feet sinking below the floor plane during walk cycles.
- Animation updates continuing when game is paused.

## Testing Procedure
1. Observe character walk cycle from multiple camera distances.
2. Verify foot planting timing corresponds to actual translation speed.
3. Check state transition smoothness between idle and walking.

## Quality Checklist
- [ ] Procedural limb articulation matches locomotion velocity.
- [ ] Character scale coherent with world doors and furniture.
- [ ] Feet remain firmly grounded on floor height.

## Expected Output
Expressive, stylized village characters that move naturally and integrate seamlessly with the 3D diorama world.

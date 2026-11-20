---
name: audio-and-cinematic-design
description: Build layered atmospheric soundscapes, handle browser audio policies, and direct emotional cinematic camera transitions.
---

# Audio and Cinematic Design Skill

## Purpose
Create an immersive soundscape and cinematic presentation that grounds the player in rural Bihar, accompanying the quiet work of preparation up to the climactic dawn arghya.

## When to Use It
- Building ambient sound layers (village morning birds, distant wind, evening crickets, river murmur).
- Crafting tactile sound effects for sweeping, grain sorting, clay work, and footsteps.
- Managing browser autoplay restrictions with gentle user-gesture audio initiation.
- Orchestrating camera transitions between gameplay exploration and narrative dialogue.

## Required Inputs
- Audio asset metadata and rights ledger (`docs/11-ASSET-AND-RIGHTS-LEDGER.md`).
- Chapter time-of-day phases (morning, evening, night, pre-dawn, sunrise).
- Cinematic camera anchor coordinates.

## Recommended Workflow
1. Initialize central AudioManager with master, music, ambient, and SFX volume buses.
2. Hook audio unlock to the first player click or keypress on the start screen.
3. Blend ambient sound loops smoothly when time of day advances.
4. Trigger localized spatial sound effects on interaction completion.
5. Tween camera positions smoothly during chapter intros and dialogue sequences using GSAP.

## Library/API Guidance
- Use Howler.js (`howler`) for cross-browser audio playback, fading, and pooling.
- Manage volume settings through the central Zustand settings slice.
- Use GSAP for ease-in-out camera transitions between perspective viewpoints.

## Constraints
- Never use unlicensed commercial music or copyrighted recordings.
- Avoid loud sound bursts or stacking sound instances on repeated key inputs.
- Audio must be fully mutable from the settings UI at all times.

## Common Failure Modes
- Browser blocking audio due to unhandled autoplay policies.
- Abrupt audio cut-offs during scene or chapter transitions instead of smooth crossfading.
- Camera tweening disorienting the player or colliding into walls.

## Testing Procedure
1. Test game launch in fresh browser tab; verify audio starts only after user interaction.
2. Toggle mute and adjust volume sliders; verify immediate audio response.
3. Trigger cinematic camera shift and verify smooth interpolation without clipping.

## Quality Checklist
- [ ] User gesture unlocks audio cleanly.
- [ ] Volume channels respect user preferences and mute state.
- [ ] Camera transitions feel gentle, cinematic, and steady.
- [ ] All audio cleared in rights ledger.

## Expected Output
A rich, evocative soundscape and cinematic camera direction that heightens emotional immersion.

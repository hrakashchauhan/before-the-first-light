# 01 — Game design document

## Genre and camera
Single-player 3D narrative exploration with light task-based gameplay. Use a high three-quarter/isometric camera for navigation, with controlled camera moves for conversations and cinematic moments. Allow limited zoom. Do not use a disorienting free camera in the MVP.

## Core loop
Observe → speak → understand a need → perform a small task → see the world change → receive a story beat → unlock the next preparation step.

## Player role
The player is a young family member returning to help the household and neighbours. The mother is the Vrati in this particular fictional family model. The player supports her and the wider household; the player does not control or score her devotion.

## First playable sequence
1. Wake in the household courtyard.
2. Speak with a family member and learn the day's plan.
3. Clean a defined courtyard area.
4. Sort and protect wheat on a clean drying surface.
5. Help shape/place goitha at a designated area, after the local custom has been validated.
6. Check the clay chulha preparation with an elder.
7. Carry an item to a neighbour or artisan.
8. Visit the pond/ghat and see community preparation.
9. Reach the festival sequence and sunrise finale.

## Task design
Each task must have:
- A clear reason.
- A visible interaction target.
- A short, understandable action.
- A success condition.
- A world-state consequence.
- Optional contextual dialogue.
- A fallback if the player walks away or repeats the interaction.

## No punishment design
No hunger meter, thirst meter, fasting simulation, timed failure for ritual devotion, or penalty for resting. Use gentle reminders and narrative time progression. Fire and water are environmental storytelling elements, not hazards in the MVP.

## Quest states
`locked → available → active → completed`
Optional: `skipped` only for optional tasks. Never allow an objective to become permanently unwinnable because of a missed one-time interaction.

## Timeline
Represent the preparation period as authored chapters/days, not a real-time 60-day wait. A chapter transition can summarise elapsed time and update object stages. The player should feel the passage of preparation without repetitive idle grinding.

## MVP completion
The player reaches the ghat before sunrise, sees the household and village together, and witnesses the Usha Arghya moment. Parana may appear in a short epilogue. Avoid presenting every family practice as mandatory.

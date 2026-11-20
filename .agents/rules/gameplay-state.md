---
trigger: glob
globs: "src/systems/**/*.ts,src/game/**/*.ts,src/story/**/*.ts"
---

Gameplay facts belong in the central typed store. Use stable IDs and explicit enums. Validate save data. Do not place Three.js objects, callbacks or runtime handles in persisted state. Keep event payloads typed and listeners lifecycle-safe.

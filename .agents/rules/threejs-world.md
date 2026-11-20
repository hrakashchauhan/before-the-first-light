---
trigger: glob
globs: "src/world/**/*.tsx,src/objects/**/*.tsx,src/characters/**/*.tsx"
---

Use real Three.js geometry and materials. Reuse geometry/materials, use instancing for repeated props, keep scale consistent, avoid floating meshes, and dispose resources when appropriate. Prefer simple performant lighting. Do not use image planes or photo backgrounds.

# Library decisions

| Library | Purpose | MVP? | Notes |
|---|---|---|---|
| React | App/UI composition | Yes | Use stable version |
| TypeScript | Typed application code | Yes | Strict mode |
| Vite | Dev server/build | Yes | Existing scaffold first |
| three | 3D engine | Yes | Geometry/material/rendering |
| @react-three/fiber | React renderer for Three.js | Yes | v9 with React 19 |
| @react-three/drei | R3F helpers | Yes, selective | Avoid importing everything |
| zustand | Gameplay state | Yes | Single source of truth |
| zod | Save/content validation | Yes | Runtime validation |
| gsap | Camera/cinematic tweening | Optional MVP | Only if useful |
| howler | Audio management | Optional MVP | Browser audio needs user gesture |
| lucide-react | UI icons | Yes | UI only |
| vitest | Unit tests | Later | Add after foundation |
| Playwright | Browser tests | Later | Add after app runs |
| @react-three/rapier | Physics | No | Add only if a real requirement emerges |
| Tailwind CSS | UI styling | Later | Add after 3D foundation |

Avoid installing duplicate state managers, multiple animation libraries or physics engines.

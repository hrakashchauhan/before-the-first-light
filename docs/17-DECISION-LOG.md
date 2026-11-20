# 17 — Decision log

Record consequential choices here.

| ID | Date | Decision | Reason | Alternatives considered | Revisit when |
|---|---|---|---|---|---|
| D001 | Initial | Browser-first 3D game | Accessible development and sharing | Native desktop engine | Performance proves inadequate |
| D002 | Initial | R3F v9 + React 19 | React-integrated Three.js workflow | Raw Three.js | Renderer complexity becomes a blocker |
| D003 | Initial | No backend in MVP | Keep scope manageable | Cloud saves | A validated need emerges |
| D004 | Initial | Procedural geometry for major visuals | User requires actual 3D world assets | Image-based backgrounds | Never for major world visuals |
| D005 | 2026-11-20 | InstancedMesh for repeated grains/props | Keep draw calls under 50 in courtyard | Separate individual meshes | When individual physics per grain is needed |
| D006 | 2026-11-20 | Mathematical & spatial bounds over Rapier physics | Eliminate 1.2MB WASM overhead on integrated GPUs | Full Rapier physics engine | Complex dynamic ragdoll or rigid-body puzzles emerge |
| D007 | 2026-11-20 | Procedural 3D Human Geometry for Player & Mother NPC | Pure geometry-first styling; avoids external glTF asset lag & image textures | Generic capsule or 2D billboard sprite | User specifically licenses high-fidelity pre-rigged models |
| D008 | 2026-11-20 | Bounded Camera Zoom with smooth lerp & dual controls | Accommodates both keyboard/wheel desktop users and on-screen HUD buttons | Fixed non-interactive camera | User requires free-orbiting cinematic camera |
| D009 | 2026-11-20 | Dual-Layer Interface: Contextual HUD + Collapsible Dev Drawer | Unobtrusive player immersion with instant dev verification tools | Cluttered permanent debug overlay | When release build drops developer tools |
| D010 | 2026-11-20 | Multi-Zone Continuous Navigation (Courtyard → Lane → Ghat) | Mathematical multi-region corridor collision with zero WASM/physics engine overhead | Rigid-body trigger volumes | Full 3D terrain navmesh needed |


Do not silently reverse a decision. Add a new entry and explain why.

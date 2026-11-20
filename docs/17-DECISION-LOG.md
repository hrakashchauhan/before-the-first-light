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
| D011 | 2026-11-20 | Low three-quarter perspective camera, 2.45–14.8m bounded zoom | Keeps the horizon, veranda, household scale, and faces readable while retaining an authored view | Orthographic diorama, free orbit | Revisit for a later cinematic chapter |
| D012 | 2026-11-20 | English/Hindi UI with fictional household dialogue | Supports accessibility and keeps culturally specific wording reviewable | Unreviewed dialect writing | Local review before release |
| D013 | 2026-11-20 | Procedural human geometry for Devraj and Ma | Delivers original face and clothing geometry without unverified redistribution rights | External rigged GLB | Verified licensed models become available |
| D014 | 2026-11-20 | Static shadow refresh cadence and simplified distant materials | Reduces repeated shadow and fragment work on an integrated GPU | Full dynamic shadows and heavier shaders | Reprofile after further scene expansion |
| D015 | 2026-11-21 | Destination-based progression architecture (`locked`, `available`, `active`, `completed`, `revisited`) | Connects household, fields, market, and ghat into a coherent journey without loading disjoint scenes | Unconnected mini-games / disjoint levels | Full open-world streaming is requested |
| D016 | 2026-11-21 | Strictly typed EventBus for game events | Decouples UI, simulation, audio, and save managers; enables deterministic testing | Tight coupling across React components | React context-only dispatching |
| D017 | 2026-11-21 | Authoritative YAML content with Zod runtime validation | Enables clean authored data for journey, quests, characters, audio, and quality gates | Hardcoded TypeScript objects or unvalidated JSON | External CMS/headless API is added |
| D018 | 2026-11-21 | Cultural Evidence Classification Matrix (6 tiers) | Enforces historical and ethnographic accuracy while marking family-specific or unverified customs | Universalized ritual assumptions | Pre-release native elder sign-off |

Do not silently reverse a decision. Add a new entry and explain why.

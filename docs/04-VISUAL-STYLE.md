# 04 — Visual style and 3D art direction

## Direction
Handcrafted, semi-realistic stylised 3D diorama. The world should feel tactile and lived-in, with believable proportions and subtle irregularity. Avoid toy-like exaggeration and avoid photorealistic asset demands.

## Palette
- Earth/mud: warm ochre, brown and clay beige.
- Limewashed walls: muted cream, slightly weathered.
- Bamboo: pale honey and straw.
- Vegetation: restrained dusty greens.
- Pond: subdued blue-green, not tropical turquoise.
- Festival lamps: warm amber.
- Dawn: peach, pale gold and soft blue.

Use central colour tokens in `src/styles/tokens.css` or a typed theme module. Do not scatter arbitrary hex codes.

## Geometry-first rule
Build major assets from actual meshes:
- Houses: wall volumes, roof structure, beams, doors, windows, veranda.
- Courtyard: ground mesh, edge transitions, swept/cleaned zones.
- Goitha: flattened irregular organic forms with distinct drying stages.
- Chulha: clay body, fire opening and cooking surface.
- Soop/daura: curved strips, rim and woven pattern.
- Wheat: instanced stalks/grains and a drying mat.
- Trees: trunk/branches and instanced foliage.
- Pond/ghat: water mesh, bank, steps and offering space.

No image planes or photographic textures as world geometry substitutes. Use procedural colour, vertex colour, noise shaders and simple hand-authored geometry.

## Lighting
- Soft daylight for preparation.
- Warm household practical light for evening.
- Restrained moonlit night.
- Gradual warm dawn transition.
- Avoid expensive real-time global illumination and volumetric fog.

## Camera
Orthographic or mild perspective three-quarter camera. Keep the player and objective readable. Camera transitions must not fight player input.

## Quality bar
Every major prop must have plausible thickness, scale, contact with ground/wall, readable silhouette and a consistent material response. Avoid floating objects, intersections, paper-thin walls and repeated identical props.

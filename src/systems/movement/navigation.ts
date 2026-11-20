import { GAME_CONFIG } from '../../game/config'
import { COURTYARD_ANCHORS, VERANDA_POST_X, VERANDA_POST_Z, type WorldPosition } from '../interaction/household'

// Footprints in X/Z. A body radius is added at test time; the person slides along the free axis.
type Footprint = [number, number, number, number]
const rectangles: Footprint[] = [
  [-5.61, -5.23, -1.8, 5.6], [6.03, 6.37, -3.6, 2.4], [-5.7, 0.32, 6.22, 6.58],
  [-4.27, 4.27, -7.2, -2.96], [-4.18, -2.22, 2.73, 4.07],
  [0.3, 2.5, 1.1, 2.5], [7, 11.2, 0.2, 1.8], [10.2, 15, 5.6, 8.5], [19.23, 20.37, 5.22, 6.18],
]
const circles: [number, number, number][] = [
  ...VERANDA_POST_X.map((x): [number, number, number] => [x, VERANDA_POST_Z, 0.155]),
  [COURTYARD_ANCHORS.npc_mother[0], COURTYARD_ANCHORS.npc_mother[2], 0.29],
  [COURTYARD_ANCHORS.npc_artisan[0], COURTYARD_ANCHORS.npc_artisan[2], 0.29],
  [4.6, 3.2, 0.78], [3.2, -2.4, 0.49], [-1.8, -2.2, 0.48],
]

export function canStandAt(x: number, z: number): boolean {
  const yard = x >= -4.94 && x <= 5.84 && z >= -2.86 && z <= 5.93
  const lane = x >= 5 && x <= 19.5 && z >= 2.0 && z <= 5.8
  const ghat = x >= 18.1 && x <= 22.45 && z >= -0.9 && z <= 7.45
  if (!(yard || lane || ghat)) return false
  const r = GAME_CONFIG.player.radius
  for (const [minX, maxX, minZ, maxZ] of rectangles) {
    const dx = x - Math.max(minX, Math.min(maxX, x))
    const dz = z - Math.max(minZ, Math.min(maxZ, z))
    if (dx * dx + dz * dz < r * r) return false
  }
  return !circles.some(([cx, cz, radius]) => (x - cx) ** 2 + (z - cz) ** 2 < (radius + r) ** 2)
}

function groundHeight(x: number, z: number) {
  if (Math.abs(x) < 4.38 && z <= -1.645) return 0.32
  if (Math.abs(x - 0.05) < 1.775 && z <= -1.32) return 0.148
  if (x >= 18.6 && x <= 21) return 0.13
  if (x > 21) return x <= 21.86 ? 0.06 : 0
  return 0
}

export function stepPosition(position: WorldPosition, screenX: number, screenZ: number, dt: number): WorldPosition {
  const length = Math.hypot(screenX, screenZ)
  if (!length) return position
  const distance = GAME_CONFIG.player.moveSpeed * Math.min(dt, 0.08) / length
  const angle = GAME_CONFIG.camera.defaultAngle
  const dx = (screenX * Math.sin(angle) + screenZ * Math.cos(angle)) * distance
  const dz = (-screenX * Math.cos(angle) + screenZ * Math.sin(angle)) * distance
  const [x, , z] = position
  const finalX = canStandAt(x + dx, z) ? x + dx : x
  const finalZ = canStandAt(finalX, z + dz) ? z + dz : z
  if (Math.abs(finalX - x) + Math.abs(finalZ - z) < 0.00001) return position
  return [finalX, groundHeight(finalX, finalZ), finalZ]
}

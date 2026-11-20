import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, DoubleSide, Group, MathUtils, Mesh, MeshStandardMaterial } from 'three'
import { dye, FigureMesh, type Figure, type Point } from './figureGeometry'
import { armGeometry, legGeometry, torsoGeometry } from './garmentGeometry'
import { portrait } from './portraitGeometry'

const fabricAndSkin = new MeshStandardMaterial({ vertexColors: true, side: DoubleSide, roughness: 0.84 })
const thighLength = 0.398
const shinLength = 0.377
const ankleHeight = 0.078
const hipHeight = 0.848
const stepReach = 0.285

function mesh(geometry: BufferGeometry) {
  const part = new Mesh(geometry, fabricAndSkin)
  part.castShadow = true
  return part
}

function handBroom() {
  const broom = new FigureMesh()
  for (let i = 0; i < 19; i++) {
    const strip = i / 18 - 0.5
    broom.stroke([[strip * 0.015, 0.13, 0], [strip * 0.018, -0.20, 0.018],
      [strip * 0.044, -0.47, 0.022], [strip * 0.24, -0.82 + Math.abs(strip) * 0.06, 0.056 + 0.012 * Math.cos(i)]],
    0.005, i % 3 ? dye.towelPale : dye.brass, false, 4)
  }
  broom.loft([[-0.43, 0.026, 0.023, 0.022], [-0.40, 0.022, 0.021, 0.022]], dye.towelDark)
  return broom.finish()
}

function makeAssets(figure: Figure) {
  return { head: portrait(figure), torso: torsoGeometry(figure), legs: legGeometry(figure),
    arms: [armGeometry(figure, -1), armGeometry(figure, 1)], broom: figure === 'devraj' ? handBroom() : null }
}

// Only these two original figures use this fixed asset cache. Rig instances own transforms;
// the geometry survives remounts and is shared by both legs and their shadow passes.
const assets = new Map<Figure, ReturnType<typeof makeAssets>>()

function joint(parent: Group, position: Point, geometry: BufferGeometry) {
  const pivot = new Group()
  pivot.position.set(...position)
  pivot.add(mesh(geometry))
  parent.add(pivot)
  return pivot
}

function makeRig(figure: Figure) {
  if (!assets.has(figure)) assets.set(figure, makeAssets(figure))
  const art = assets.get(figure)!
  const root = new Group()
  const chest = joint(root, [0, 0.84, 0], art.torso)
  const head = joint(chest, [0, 0.738, 0.003], art.head)
  const limbs = [-1, 1].map((side, index) => {
    const upper = joint(chest, [side * (figure === 'ma' ? 0.163 : 0.182), 0.489, 0], art.arms[index].upper)
    const elbow = joint(upper, [0, -0.257, 0], art.arms[index].lower)
    const hip = joint(root, [side * 0.092, hipHeight, 0], art.legs.thigh)
    const knee = joint(hip, [0, -thighLength, 0], art.legs.shin)
    const foot = joint(knee, [0, -shinLength, 0], art.legs.foot)
    return { side, upper, elbow, hip, knee, foot }
  })
  const broom = art.broom ? joint(limbs[0].elbow, [0, -0.243, 0.012], art.broom) : null
  if (broom) broom.visible = false
  return { root, chest, head, limbs, broom }
}

function stride(phase: number) {
  if (phase < 0.5) return { forward: stepReach * (1 - 4 * phase), lift: 0 }
  const swing = (phase - 0.5) * 2
  return {
    forward: stepReach * (2 * swing - 1 - 2 / Math.PI * Math.sin(Math.PI * 2 * swing)),
    lift: 0.10 * Math.sin(Math.PI * swing) ** 2,
  }
}

interface FigureProps {
  figure: Figure
  position: Point
  rotationY: number
  moving?: boolean
  attentive?: boolean
  talking?: boolean
  interacting?: boolean
  actionTarget?: string | null
  paused?: boolean
}

export function HouseholdFigure({ figure, position, rotationY, moving = false, attentive = false,
  talking = false, interacting = false, actionTarget = null, paused = false }: FigureProps) {
  const rig = useMemo(() => makeRig(figure), [figure])
  const state = useRef({ x: position[0], z: position[2], phase: 0.25, time: 0,
    gait: 0, talk: 0, attention: 0, action: 0, actionTime: 0 })
  const ma = figure === 'ma'

  useFrame((_, dt) => {
    const pose = state.current
    const distance = Math.hypot(position[0] - pose.x, position[2] - pose.z)
    pose.x = position[0]
    pose.z = position[2]
    if (paused) return
    const delta = Math.min(dt, 0.12)
    pose.time += delta
    const t = pose.time
    const walk = moving && distance > 0.0001 && distance < 0.8
    if (walk) pose.phase = (pose.phase + distance / (4 * stepReach)) % 1
    pose.gait = MathUtils.damp(pose.gait, walk ? 1 : 0, 15, delta)
    pose.talk = MathUtils.damp(pose.talk, talking ? 1 : 0, 6, delta)
    pose.attention = MathUtils.damp(pose.attention, attentive || talking ? 1 : 0, 5, delta)
    pose.action = MathUtils.damp(pose.action, interacting ? 1 : 0, 8, delta)
    pose.actionTime = interacting ? pose.actionTime + delta : 0
    const { gait, phase, talk, attention, action } = pose
    const breath = Math.sin(t * 1.85 + (ma ? 0.7 : 0))
    const sway = Math.sin(phase * 2 * Math.PI)
    const sweep = actionTarget === 'prop_broom' ? action : 0
    const sort = actionTarget === 'prop_wheat' ? action : 0
    const work = Math.max(sweep, sort)
    const stroke = Math.sin(pose.actionTime * 3.9)

    rig.chest.position.y = 0.84 + 0.0025 * breath + gait * 0.014 * Math.cos(4 * Math.PI * phase)
    rig.chest.rotation.set(0.028 * gait + 0.15 * work, -0.051 * sway * gait + sweep * stroke * 0.19,
      (ma ? -0.021 : 0.009) + 0.022 * sway * gait)
    rig.head.rotation.set(-0.012 * breath + talk * (0.045 + 0.042 * Math.sin(t * 3)) + 0.22 * work,
      ma ? 0.07 * Math.sin(t * 0.34) - 0.16 * attention : -0.02 - 0.028 * sway * gait,
      ma ? 0.028 - 0.042 * talk : -0.012)
    if (rig.broom) {
      rig.broom.visible = sweep > 0.1
      rig.broom.rotation.x = 0.31
    }
    for (const [index, limb] of rig.limbs.entries()) {
      const side = limb.side
      const legPhase = (phase + 0.5 * index) % 1
      const { forward, lift } = stride(legPhase)
      const z = forward * gait + (ma ? 0.028 : 0.012) * side * (1 - gait)
      const hipY = hipHeight - gait * (0.034 + 0.026 * Math.cos(4 * Math.PI * phase))
      const down = hipY - ankleHeight - lift * gait
      const length = Math.min(thighLength + shinLength, Math.hypot(z, down))
      const upperAngle = Math.atan2(z, down) + Math.acos(MathUtils.clamp(
        (thighLength ** 2 + length ** 2 - shinLength ** 2) / (2 * thighLength * length), -1, 1))
      const bend = Math.acos(MathUtils.clamp((length ** 2 - thighLength ** 2 - shinLength ** 2)
        / (2 * thighLength * shinLength), -1, 1))
      limb.hip.position.y = hipY
      limb.hip.rotation.x = -upperAngle
      limb.knee.rotation.x = bend
      limb.foot.rotation.x = upperAngle - bend

      const armSwing = 0.45 * Math.cos(legPhase * Math.PI * 2) * gait
      const gesturing = ma && side === 1 ? talk * (0.45 + 0.12 * Math.sin(t * 2.6)) : 0
      const reaching = !ma && side === -1 ? action : 0
      limb.upper.rotation.set(-0.055 + armSwing - gesturing * 0.65 - reaching * (0.30 + 0.19 * sort),
        (ma ? -0.09 : 0.025) * side + reaching * sweep * stroke * 0.20,
        side * (0.115 + 0.015 * breath + 0.23 * gesturing) + reaching * sweep * stroke * 0.21)
      limb.elbow.rotation.set(-(ma && side === -1 ? 0.68 : 0.16) - 0.11 * gait
        - 1.25 * gesturing - reaching * (0.28 - 0.17 * sweep),
        ma && side === -1 ? -0.21 : 0, side * (ma && side === -1 ? -0.26 : -0.07))
    }
  })
  return <group name={ma ? 'Ma' : 'Devraj'} position={position} rotation={[0, rotationY, 0]} scale={ma ? 0.96 : 1}>
    <primitive object={rig.root} />
  </group>
}

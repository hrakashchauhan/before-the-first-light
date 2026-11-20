import { Color } from 'three'
import { dye, FigureMesh, type Figure, type Point, type Ring } from './figureGeometry'

// Cross-sections from chin to crown. The face looks towards positive Z.
const skull: Ring[] = [
  [-0.136, 0.019, 0.026, 0.025], [-0.127, 0.044, 0.060, 0.019],
  [-0.107, 0.069, 0.079, 0.009], [-0.079, 0.085, 0.087, 0],
  [-0.051, 0.097, 0.093, -0.001], [-0.023, 0.105, 0.100, -0.004],
  [0.004, 0.109, 0.102, -0.005], [0.035, 0.111, 0.107, -0.006],
  [0.063, 0.109, 0.109, -0.008], [0.092, 0.101, 0.100, -0.009],
  [0.115, 0.084, 0.085, -0.009], [0.135, 0.057, 0.060, -0.009],
  [0.148, 0.006, 0.008, -0.010],
]
function section(y: number, ma: boolean) {
  const i = Math.max(0, Math.min(skull.length - 2, skull.findIndex((r, j) => j + 1 < skull.length && y >= r[0] && y <= skull[j + 1][0])))
  const a = y >= skull[skull.length - 1][0] ? skull[skull.length - 1] : skull[i]
  const b = y >= skull[skull.length - 1][0] ? a : skull[i + 1]
  const t = b === a ? 0 : Math.max(0, Math.min(1, (y - a[0]) / (b[0] - a[0])))
  const blend = (x: number, z: number) => x + (z - x) * t
  const jaw = ma && y < -0.025 ? 1 - Math.min(0.09, (-0.025 - y) * 1.4) : 1
  return [blend(a[1], b[1]) * jaw, blend(a[2], b[2]), blend(a[3]!, b[3]!)]
}
const bell = (x: number, y: number, wx: number, wy: number) =>
  Math.exp(-(x * x / (wx * wx) + y * y / (wy * wy)))

function relief(x: number, y: number, ma: boolean) {
  const cheek = Math.abs(x)
  return 0.012 * bell(cheek - 0.066, y + 0.029, 0.036, 0.027)
    - 0.009 * bell(cheek - 0.044, y - 0.006, 0.029, 0.016)
    + 0.0065 * bell(cheek - 0.045, y - 0.030, 0.043, 0.012)
    + 0.019 * bell(x, y - 0.001, 0.015, 0.043)
    + (ma ? 0.030 : 0.035) * bell(x, y + 0.032, 0.018, 0.018)
    + 0.016 * bell(cheek - 0.016, y + 0.041, 0.008, 0.008)
    + 0.008 * bell(x, y + 0.070, 0.041, 0.027)
    + 0.009 * bell(x, y + 0.108, 0.033, 0.019)
}

function skinZ(x: number, y: number, ma: boolean) {
  const [w, d, z] = section(y, ma)
  const cos = Math.sqrt(Math.max(0, 1 - (x / w) ** 2))
  return z + d * Math.pow(cos, 0.74) + relief(x, y, ma) * cos
}

function eye(head: FigureMesh, side: number, ma: boolean) {
  const cx = side * 0.045
  const cy = 0.006
  const w = ma ? 0.0235 : 0.0228
  const rim = (s: number, top: boolean) => {
    const arch = Math.sin(Math.PI * s)
    return cy + 0.0035 * (s - 0.5) + (top ? 0.0070 : -0.0052) * Math.pow(arch, 0.85)
  }
  const lens = (x: number, y: number): number => {
    const h = Math.max(0, 1 - ((x - cx) / w) ** 2)
    return skinZ(x, y, ma) + 0.0014 + 0.0045 * h
  }
  // A convex almond beneath two raised lids, with an iris fitted to its aperture.
  head.surface(5, 16, (v, u) => {
    const s = side > 0 ? u : 1 - u
    const x = cx + side * w * (2 * s - 1)
    const y = rim(s, false) + (rim(s, true) - rim(s, false)) * v
    return [x, y, lens(x, y)]
  }, dye.eye)
  for (const [radius, colour, dz] of [[0.0078, dye.iris, 0.0006], [0.0039, dye.pupil, 0.0012]] as const) {
    head.surface(4, 20, (v, u) => {
      const a = u * Math.PI * 2
      const x = cx + radius * v * Math.cos(a)
      const s = 0.5 + side * (x - cx) / (w * 2)
      const y = Math.max(rim(s, false), Math.min(rim(s, true), cy + 0.0016 - radius * v * Math.sin(a)))
      return [x, y, lens(x, y) + dz]
    }, colour, true)
  }
  const glintX = cx - 0.0022
  head.oval([glintX, cy + 0.004, lens(glintX, cy + 0.004) + 0.0013],
    [0.0015, 0.0015, 0.0010], dye.shine, [0, 0, 0], 8)
  const lid = (upper: boolean) => Array.from({ length: 7 }, (_, i): Point => {
    const s = i / 6
    const x = cx + side * w * (2 * s - 1)
    const y = rim(s, upper)
    return [x, y, lens(x, y) + 0.001]
  })
  head.stroke(lid(true), 0.0028, dye.hair, true)
  head.stroke(lid(false), 0.0015, dye.lid, true)
  head.surface(3, 14, (v, u) => {
    const s = side > 0 ? u : 1 - u
    const x = side * (0.019 + 0.057 * s)
    const arch = Math.sin(Math.PI * (0.06 + 0.87 * s))
    const taper = Math.min(1, s * 10 + 0.16) * (1 - 0.86 * s)
    const y = cy + (ma ? 0.014 : 0.012) + (ma ? 0.008 : 0.006) * arch + 0.004 * s
      + (v - 0.5) * (ma ? 0.0065 : 0.009) * taper
    return [x, y, skinZ(x, y, ma) + 0.0016 + 0.0015 * Math.sin(Math.PI * v)]
  }, dye.hair)
}

function clothCap(head: FigureMesh) {
  // A low working cap with a flattened crown, curved visor and stitched panel seams.
  const capRings: Ring[] = [[0.053, 0.126, 0.133, -0.008], [0.066, 0.126, 0.134, -0.006],
    [0.085, 0.124, 0.132, -0.005], [0.108, 0.120, 0.125, -0.002], [0.133, 0.105, 0.108],
    [0.153, 0.080, 0.078, -0.004], [0.163, 0.044, 0.045, -0.005], [0.166, 0.004, 0.004, -0.006]]
  head.loft(capRings, dye.cap, 40)
  head.loft([[0.053, 0.127, 0.134, -0.008], [0.061, 0.127, 0.135, -0.007]], dye.capShadow, 40)
  const visor = (v: number, u: number, offset: number): Point => {
    const a = u * 2.54 - 1.27
    const length = 0.011 + 0.052 * Math.max(0, Math.cos(a / 1.27 * Math.PI / 2)) ** 0.75
    return [(0.125 + v * length * 0.45) * Math.sin(a), 0.056 + 0.011 * Math.cos(a) - 0.012 * v
      + 0.0008 * Math.sin(Math.PI * v) + offset, (0.126 + v * length) * Math.cos(a)]
  }
  head.surface(5, 32, (v, u) => visor(v, u, 0), dye.cap)
  head.surface(4, 32, (v, u) => visor(v, 1 - u, -0.0035), dye.capShadow)
  const brimLine = Array.from({ length: 11 }, (_, i) => visor(0.995, i / 10, -0.0016))
  head.stroke(brimLine, 0.0021, dye.capSeam, false)
  for (const a of [-2.24, -1.03, 0, 1.03, 2.24]) {
    head.stroke(capRings.slice(1).map(([y,w,d,z=0]): Point =>
      [(w + 0.0006) * Math.sin(a), y + 0.001, z + (d + 0.0006) * Math.cos(a)]),
    0.0013, dye.capSeam)
  }
}

function hair(head: FigureMesh, ma: boolean) {
  // A fitted hairline recedes down the temples to the nape. Swept grooves follow the cap.
  const hairPoint = (v: number, angle: number, offset = 0): Point => {
    const front = Math.cos(angle)
    const fringe = ma ? 0.005 * Math.sin(2 * angle) : 0.011 * Math.sin(2 * angle + 0.65)
    const edge = -0.040 + 0.121 * Math.max(0, front) ** 0.72 + fringe - 0.025 * Math.max(0, -front)
    const y = edge + (0.148 - edge) * v
    const [w, d, z] = section(y, ma)
    const r = 0.006 + offset + 0.003 * Math.sin(Math.PI * v)
    return [(w + r) * Math.sin(angle), y + v * (ma ? 0.005 : 0.012),
      z + (d + r) * Math.sign(front) * Math.pow(Math.abs(front), front > 0 ? 0.74 : 1)]
  }
  head.surface(16, 48, (v, u) => hairPoint(v, Math.PI * 2 * u), dye.hair, true)
  for (let i = 0; i < 17; i++) {
    const a = -2.9 + i * 0.355
    const sweep = ma ? (a < 0 ? -0.75 : 0.75) : 0.66
    const points = [0.015, 0.21, 0.42, 0.62, 0.80, 0.91].map(v => hairPoint(v, a + v * sweep, 0.0007))
    head.stroke(points, 0.0015, dye.hairLight, true, 4)
  }
  if (ma) {
    head.oval([0, 0.008, -0.109], [0.062, 0.065, 0.057], dye.hair)
    for (let i = -2; i <= 2; i++) {
      const x = i * 0.018
      head.stroke([[x, -0.037, -0.128], [x + 0.008, 0.002, -0.165 + Math.abs(x) * 0.3],
        [x + 0.005, 0.047, -0.143]], 0.0018, dye.hairLight, true)
    }
  }
}

export function portrait(figure: Figure) {
  const head = new FigureMesh()
  const ma = figure === 'ma'
  const skin = ma ? dye.maSkin : dye.devrajSkin
  const base = new Color(skin), cheekTint = new Color(ma ? '#ae6756' : '#b66c52')
  const stubble = new Color('#706151')
  const tint = (_v: number, u: number, [x, y]: Point) => {
    const front = Math.max(0, Math.cos(u * 2 * Math.PI))
    const colour = base.clone().lerp(cheekTint, (bell(Math.abs(x) - 0.065, y + 0.032, 0.037, 0.023)
      + 0.5 * bell(x, y + 0.038, 0.025, 0.018)) * front * 0.68)
    if (!ma) {
      const jaw = Math.min(1, Math.max(0, -(y + 0.068 - Math.abs(x) * 0.38) * 16))
      colour.lerp(stubble, 0.19 * jaw * front)
    }
    return colour
  }
  head.surface(52, 80, (v, u) => {
    const y = -0.136 + v * 0.284
    const [w, d, z] = section(y, ma)
    const a = Math.PI * 2 * u
    const x = w * Math.sin(a)
    return [x, y, Math.cos(a) >= 0 ? skinZ(x, y, ma) : z + Math.cos(a) * d]
  }, tint, true)
  for (const side of [-1, 1]) {
    eye(head, side, ma)
    head.oval([side * 0.105, -0.017, -0.002], [0.018, 0.033, 0.021], skin, [0.13, 0, -side * 0.1])
    head.oval([side * 0.120, -0.017, 0.001], [0.0027, 0.016, 0.010], dye.lid, [0.1, 0, 0])
    const x = side * 0.014
    head.oval([x, -0.046, skinZ(x, -0.046, ma) + 0.001], [0.004, 0.0016, 0.0018], dye.nostril)
    if (ma) head.oval([side * 0.111, -0.048, 0.003], [0.006, 0.007, 0.006], dye.brass)
  }
  const width = ma ? 0.032 : 0.031
  const lipLine = (s: number) => -0.075 + 0.0031 * Math.abs(s) ** 1.6
  for (const isTop of [true, false]) {
    head.surface(4, 24, (v, u) => {
      const s = u * 2 - 1
      const x = width * s
      const line = lipLine(s)
      const taper = Math.max(0, 1 - s * s)
      const peak = 0.0043 + 0.0027 * Math.exp(-((Math.abs(s) - 0.27) ** 2) / 0.025)
      const y = isTop ? line + v * taper * peak : line - (1 - v) * taper * 0.006
      return [x, y, skinZ(x, y, ma) + taper * (0.0015 + 0.0045 * Math.sin(Math.PI * v))]
    }, dye.lip)
  }
  head.stroke([-1, -0.52, 0, 0.52, 1].map((s): Point => {
    const x = width * s
    const y = lipLine(s)
    return [x, y, skinZ(x, y, ma) + 0.0019 * (1 - s * s)]
  }), 0.0011, dye.mouth, true)
  hair(head, ma)
  if (!ma) clothCap(head)
  return head.finish()
}

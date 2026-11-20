import { CatmullRomCurve3, Vector3 } from 'three'
import { dye, FigureMesh, type Figure, type Point, type Ring } from './figureGeometry'

const kurta: Ring[] = [[-0.097, 0.195, 0.146], [-0.081, 0.194, 0.145], [0.066, 0.169, 0.122],
  [0.175, 0.157, 0.118], [0.298, 0.174, 0.129], [0.417, 0.195, 0.13],
  [0.483, 0.202, 0.106], [0.511, 0.185, 0.091], [0.54, 0.089, 0.078]]

function shirtFront(x: number, y: number, width: number, depth: number) {
  const s = Math.min(1, Math.abs(x / width))
  const fall = Math.exp(-((y - 0.06) ** 2) / 0.034)
  const sideFold = 0.005 * Math.sin(36 * x + 3 * y) * fall
  const tuck = 0.006 * Math.exp(-((y - 0.18 - x * 0.34) ** 2) / 0.00034) * s
  return Math.sqrt(1 - s * s) * (depth + sideFold + tuck)
}

function makeShirt(mesh: FigureMesh) {
  mesh.surface(44, 48, (v, u) => {
    const y = kurta[0][0] + v * (kurta[kurta.length - 1][0] - kurta[0][0])
    const j = Math.max(0, kurta.findIndex((r, i) => i + 1 < kurta.length && y >= r[0] && y <= kurta[i + 1][0]))
    const a = kurta[j], b = kurta[j + 1]
    const t = (y - a[0]) / (b[0] - a[0])
    const width = a[1] + (b[1] - a[1]) * t, depth = a[2] + (b[2] - a[2]) * t
    const angle = 2 * Math.PI * u
    const x = Math.sin(angle) * width
    return [x, y, Math.cos(angle) >= 0 ? shirtFront(x, y, width, depth) : Math.cos(angle) * depth]
  }, dye.olive, true)
  mesh.loft([[-0.097, 0.195, 0.146], [-0.094, 0.195, 0.146]], dye.oliveEdge, 48)
  mesh.loft([[0.532, 0.088, 0.083], [0.556, 0.072, 0.073]], dye.collar)
  mesh.stroke([[0, 0.55, 0.08], [0, 0.485, 0.108], [0, 0.42, 0.134], [0, 0.34, 0.134]],
    0.0052, dye.oliveEdge)
  for (const [y, z] of [[0.51, 0.100], [0.452, 0.123], [0.386, 0.136]]) {
    mesh.oval([0, y, z], [0.004, 0.004, 0.0025], dye.brass)
  }
  const pocket = (v: number, u: number): Point => {
    const x = -0.09 + (u - 0.5) * 0.077
    const y = 0.306 + v * 0.08 - (1 - v) * 0.012 * Math.sin(u * Math.PI)
    const width = 0.174 + (y - 0.298) * (0.021 / 0.119)
    return [x, y, shirtFront(x, y, width, 0.131) + 0.0035 + v * 0.0015]
  }
  mesh.surface(6, 12, pocket, dye.olive)
  mesh.stroke([0, 0.25, 0.5, 0.75, 1].map(u => pocket(0.96, u)), 0.0013, dye.oliveEdge)
}

function drape(mesh: FigureMesh, figure: Figure) {
  const ma = figure === 'ma'
  // The two ends follow the body over the shoulder, front-to-back, in one continuous cloth.
  const rail: Point[] = ma ? [
    [-0.137, 0.116, 0.082], [-0.106, 0.19, 0.111], [-0.05, 0.285, 0.145],
    [0.010, 0.38, 0.155], [0.088, 0.48, 0.126], [0.13, 0.533, 0.077],
    [0.132, 0.547, -0.014], [0.129, 0.507, -0.074], [0.128, 0.36, -0.11],
    [0.137, 0.18, -0.129], [0.14, -0.04, -0.151], [0.143, -0.19, -0.16],
  ] : [
    [0.116, 0.014, 0.111], [0.120, 0.185, 0.109], [0.128, 0.365, 0.110],
    [0.137, 0.486, 0.080], [0.137, 0.537, 0.038], [0.136, 0.538, -0.033],
    [0.136, 0.49, -0.074], [0.131, 0.349, -0.113], [0.119, 0.218, -0.12],
  ]
  const path = new CatmullRomCurve3(rail.map(p => new Vector3(...p)))
  const rows = ma ? 42 : 39, cols = ma ? 20 : 10
  const pts: Point[][] = []
  for (let i = 0; i <= rows; i++) {
    const v = i / rows
    const p = path.getPointAt(v)
    const faceSign = p.z > 0 ? 1 : -1
    const width = ma ? 0.166 - 0.035 * Math.exp(-((v - 0.5) ** 2) / 0.035) : 0.125
    pts[i] = Array.from({ length: cols + 1 }, (_, j): Point => {
      const b = j / cols - 0.5
      const flute = 0.005 * Math.sin(5.8 * Math.PI * b + v * 1.6)
      const x = p.x + b * width
      const y = p.y - (ma && v < 0.42 ? 0.044 * b : 0.003 * b)
      let z = p.z + flute - faceSign * b * (ma && v < 0.42 ? 0.03 : 0.054)
      if (p.z > 0.055) {
        const depth = ma ? 0.144 : 0.135, radius = ma ? 0.190 : 0.205
        const shoulderSlope = 1 - 0.59 * Math.max(0,Math.min(1,(y - 0.403) / 0.145))
        const shirt = depth * shoulderSlope * Math.sqrt(Math.max(0, 1 - (x / radius) ** 2))
        z = Math.max(z, shirt + 0.0075 + flute)
      }
      if (y > 0.48 && Math.abs(p.z) < 0.09) {
        const shoulder = ma ? 0.17 : 0.191
        const crown = 0.492 + 0.049 * Math.sqrt(Math.max(0,
          1 - ((x - shoulder) / 0.068) ** 2 - (z / 0.067) ** 2))
        return [x, Math.max(y, crown + 0.006), z]
      }
      return [x,y,z]
    })
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const edge = j === 0 || j === cols - 1
      let colour: string
      if (ma) {
        colour = edge ? dye.sariEdge : (j === 2 || j === cols - 3) ? dye.sariWeft : dye.sari
      } else {
        const warp = j % 4 < 2, weft = i % 4 < 2
        colour = edge ? dye.towelDark : warp && weft ? dye.towelPale : warp || weft ? dye.towelWarp : dye.towel
      }
      mesh.quad(mesh.vertex(pts[i][j], colour), mesh.vertex(pts[i][j + 1], colour),
        mesh.vertex(pts[i + 1][j], colour), mesh.vertex(pts[i + 1][j + 1], colour))
    }
  }
  for (const edge of [0, rows]) {
    for (let j = 1; j < cols; j += ma ? 3 : 1) {
      const [x, y, z] = pts[edge][j]
      mesh.stroke([[x, y, z], [x + 0.001, y - 0.009, z], [x + 0.002, y - 0.016, z + 0.002]],
        ma ? 0.0016 : 0.0013, ma ? dye.sariEdge : dye.towelPale)
    }
  }
}

export function torsoGeometry(figure: Figure) {
  const mesh = new FigureMesh()
  const ma = figure === 'ma'
  const skin = ma ? dye.maSkin : dye.devrajSkin
  mesh.loft([[0.14, 0.142, 0.1], [0.23, 0.129, 0.097], [0.35, 0.151, 0.111]], skin)
  mesh.loft([[0.491, 0.082, 0.078], [0.558, 0.059, 0.065], [0.654, 0.054, 0.058, 0.003],
    [0.674, 0.055, 0.055, 0.005]], skin)
  if (ma) {
    mesh.loft([[0.212, 0.140, 0.107], [0.225, 0.141, 0.109], [0.29, 0.150, 0.119, 0.005],
      [0.37, 0.178, 0.131, 0.01], [0.43, 0.179, 0.122], [0.493, 0.182, 0.092],
      [0.522, 0.144, 0.077], [0.535, 0.083, 0.071]], dye.blouse)
    mesh.loft([[0.211, 0.142, 0.11], [0.220, 0.142, 0.11]], dye.blouseEdge)
    // Skirt is fitted across the hips, then opens into pleats and a narrow woven hem.
    mesh.loft([[-0.70, 0.198, 0.165], [-0.62, 0.195, 0.162], [-0.40, 0.184, 0.158],
      [-0.18, 0.183, 0.144], [-0.03, 0.191, 0.142], [0.08, 0.171, 0.13],
      [0.15, 0.151, 0.114], [0.174, 0.148, 0.113]], dye.sari, 72, 0.084)
    mesh.loft([[-0.699, 0.202, 0.167], [-0.674, 0.20, 0.167]], dye.sariEdge, 72, 0.065)
    mesh.loft([[-0.659, 0.199, 0.166], [-0.653, 0.199, 0.166]], dye.sariWeft, 72, 0.065)
    for (let i = 0; i < 8; i++) {
      const y = -0.57 + (i % 4) * 0.15, a = (i < 4 ? -0.63 : 0.77) + (i % 2) * 0.14
      const x = 0.184 * Math.sin(a), z = 0.157 * Math.cos(a) + 0.005
      mesh.stroke([[x - 0.007, y, z], [x, y + 0.009, z + 0.001], [x + 0.007, y, z],
        [x, y - 0.009, z], [x - 0.007, y, z]], 0.0016, dye.sariWeft)
    }
  } else {
    makeShirt(mesh)
  }
  drape(mesh, figure)
  return mesh.finish()
}

export function armGeometry(figure: Figure, side: number) {
  const ma = figure === 'ma'
  const sleeve = ma ? dye.blouse : dye.olive
  const piping = ma ? dye.blouseEdge : dye.oliveEdge
  const skin = ma ? dye.maSkin : dye.devrajSkin
  const upper = new FigureMesh(), lower = new FigureMesh()
  upper.loft([[-0.279, 0.040, 0.041], [-0.245, 0.045, 0.047], [-0.17, 0.053, 0.051],
    [-0.066, 0.060, 0.060], [0.007, 0.054, 0.058]], skin)
  const hem = ma ? -0.143 : -0.205
  upper.loft([[hem, 0.058, 0.058], [hem + 0.014, 0.060, 0.059], [-0.058, 0.068, 0.069],
    [-0.006, 0.068, 0.067], [0.028, 0.055, 0.052], [0.045, 0.030, 0.032], [0.048, 0.006, 0.008]], sleeve)
  upper.loft([[hem, 0.059, 0.059], [hem + (ma ? 0.007 : 0.024), 0.062, 0.061]], piping)
  lower.loft([[-0.225, 0.028, 0.027], [-0.195, 0.031, 0.030], [-0.114, 0.040, 0.04],
    [-0.054, 0.045, 0.046], [-0.016, 0.041, 0.042], [0.016, 0.035, 0.035]], skin)
  lower.oval([0, -0.241, 0.006], [0.027, 0.043, 0.040], skin, [-0.12, 0, -side * 0.05])
  for (let i = 0; i < 4; i++) {
    const z = (i - 1.5) * 0.0135 + 0.005
    lower.oval([-0.002 * side, -0.278 + Math.abs(i - 1.5) * 0.004, z],
      [0.012, 0.025 - Math.abs(i - 1) * 0.003, 0.009], skin, [0.09, 0, -side * 0.21])
  }
  lower.oval([-0.013 * side, -0.245, 0.040], [0.012, 0.027, 0.013], skin, [-0.35, 0, 0])
  if (ma) {
    for (const y of [-0.202, -0.190]) lower.loft([[y, 0.034, 0.033], [y + 0.005, 0.034, 0.033]], dye.brass)
  } else if (side > 0) {
    lower.loft([[-0.202, 0.033, 0.032], [-0.184, 0.034, 0.032]], dye.leather)
    lower.oval([0.019, -0.193, 0.022], [0.019, 0.020, 0.006], dye.brass, [0, 0.55, 0])
    lower.oval([0.021, -0.193, 0.025], [0.015, 0.016, 0.005], dye.towelPale, [0, 0.55, 0])
    lower.stroke([[0.024, -0.181, 0.028], [0.023, -0.193, 0.029], [0.018, -0.197, 0.031]], 0.0011, dye.hair)
  }
  return { upper: upper.finish(), lower: lower.finish() }
}

export function legGeometry(figure: Figure) {
  const ma = figure === 'ma'
  const thigh = new FigureMesh(), shin = new FigureMesh(), foot = new FigureMesh()
  const skin = ma ? dye.maSkin : dye.devrajSkin
  thigh.loft([[-0.438, 0.061, 0.064], [-0.38, 0.071, 0.077], [-0.24, 0.075, 0.082],
    [-0.12, 0.083, 0.09], [0.04, 0.069, 0.081]], ma ? dye.sariFold : dye.denim, 18)
  shin.loft([[-0.43, 0.036, 0.034], [-0.38, 0.039, 0.039], [-0.26, 0.042, 0.044], [-0.12, 0.053, 0.052],
    [-0.03, 0.057, 0.057], [0.016, 0.058, 0.057]], skin)
  if (!ma) {
    shin.loft([[-0.337, 0.054, 0.055], [-0.279, 0.057, 0.06], [-0.164, 0.063, 0.065],
      [-0.074, 0.067, 0.067], [-0.008, 0.062, 0.065], [0.027, 0.056, 0.059]], dye.denim, 20, 0.025)
    shin.loft([[-0.338, 0.055, 0.057], [-0.329, 0.055, 0.057]], dye.denimSeam)
  }
  foot.oval([0, -0.065, 0.042], [0.053, 0.013, 0.118], dye.sole)
  foot.oval([0, -0.047, 0.043], [0.047, 0.026, 0.105], skin, [-0.07, 0, 0])
  for (const z of [0.006, 0.097]) {
    foot.surface(3, 14, (v, u) => {
      const a = Math.PI * u
      return [-0.049 * Math.cos(a), -0.054 + Math.sin(a) * (z > 0.05 ? 0.035 : 0.049),
        z + (v - 0.5) * 0.023 + 0.01 * Math.cos(a)]
    }, dye.leather)
  }
  return { thigh: thigh.finish(), shin: shin.finish(), foot: foot.finish() }
}

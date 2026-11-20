import { BufferGeometry, CatmullRomCurve3, Color, Euler, Float32BufferAttribute, Vector3 } from 'three'

export type Point = [number, number, number]
export type Ring = [height: number, width: number, depth: number, centreZ?: number]
export type Figure = 'devraj' | 'ma'

// Fabric, wood and skin colours share one matte, vertex-coloured material on the rig.
export const dye = {
  devrajSkin: '#a86843', maSkin: '#9b5f43', lid: '#8d523d', lip: '#945649', mouth: '#56302e',
  nostril: '#653a30', hair: '#272323', hairLight: '#39312e', eye: '#c9b7a2', iris: '#392b25',
  pupil: '#201e20', shine: '#efe3c6', olive: '#526044', oliveEdge: '#6f7654',
  collar: '#384737', denim: '#3e4b4b', denimSeam: '#53605b', sole: '#4e3933',
  leather: '#7e5034', brass: '#b58550', blouse: '#505541', blouseEdge: '#767558',
  sari: '#843e46', sariFold: '#753740', sariEdge: '#b78357', sariWeft: '#a65f54',
  towel: '#ad5942', towelPale: '#debd8c', towelWarp: '#c48665', towelDark: '#904731',
  cap: '#aa845c', capShadow: '#85694c', capSeam: '#ba996f',
}

const colours = new Map<string, Color>()
function thread(colour: string) {
  if (!colours.has(colour)) colours.set(colour, new Color(colour))
  return colours.get(colour)!
}

/** Indexed parametric surfaces are batched per moving joint. All coordinates are metres. */
export class FigureMesh {
  private positions: number[] = []
  private colours: number[] = []
  private indices: number[] = []

  vertex(point: Point, colour: string | Color) {
    const index = this.positions.length / 3
    this.positions.push(...point)
    const c = typeof colour === 'string' ? thread(colour) : colour
    this.colours.push(c.r, c.g, c.b)
    return index
  }

  quad(a: number, b: number, c: number, d: number) {
    this.indices.push(a, b, c, b, d, c)
  }

  surface(rows: number, columns: number, sample: (v: number, u: number) => Point,
    colour: string | ((v: number, u: number, p: Point) => Color), wrap = false) {
    const first = this.positions.length / 3
    const stride = wrap ? columns : columns + 1
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col < stride; col++) {
        const v = row / rows, u = col / columns
        const p = sample(v, u)
        this.vertex(p, typeof colour === 'string' ? colour : colour(v, u, p))
      }
    }
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const a = first + row * stride + col
        const b = first + row * stride + (col + 1) % stride
        this.quad(a, b, a + stride, b + stride)
      }
    }
  }

  loft(rings: Ring[], colour: string, sides = 24, pleat = 0, offsetX = 0) {
    this.surface(rings.length - 1, sides, (v, u) => {
      const [y, w, d, z = 0] = rings[Math.round(v * (rings.length - 1))]
      const a = Math.PI * 2 * u
      const ridge = 1 + pleat * (0.7 * Math.cos(9 * a + y) + 0.3 * Math.cos(14 * a))
      return [offsetX + w * Math.sin(a) * ridge, y, z + d * Math.cos(a) * ridge]
    }, colour, true)
    for (const [index, isTop] of [[0, false], [rings.length - 1, true]] as const) {
      const [y, w, d, z = 0] = rings[index]
      const centre = this.vertex([offsetX, y, z], colour)
      const rim: number[] = []
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2
        const ridge = 1 + pleat * (0.7 * Math.cos(9 * angle + y) + 0.3 * Math.cos(14 * angle))
        rim.push(this.vertex([offsetX + w * Math.sin(angle) * ridge, y, z + d * Math.cos(angle) * ridge], colour))
      }
      for (let j = 0; j < sides; j++) {
        const next = rim[(j + 1) % sides]
        this.indices.push(centre, isTop ? rim[j] : next, isTop ? next : rim[j])
      }
    }
  }

  oval(centre: Point, size: Point, colour: string, rotation: Point = [0, 0, 0], sides = 16) {
    const euler = new Euler(...rotation)
    const p = new Vector3()
    this.surface(8, sides, (v, u) => {
      const lat = (v - 0.5) * Math.PI
      const angle = u * Math.PI * 2
      p.set(Math.sin(angle) * Math.cos(lat) * size[0], Math.sin(lat) * size[1],
        Math.cos(angle) * Math.cos(lat) * size[2]).applyEuler(euler)
      return [p.x + centre[0], p.y + centre[1], p.z + centre[2]]
    }, colour, true)
  }

  stroke(points: Point[], radius: number, colour: string, tapered = false, sides = 6) {
    const path = new CatmullRomCurve3(points.map(p => new Vector3(...p)))
    const steps = Math.max(5, points.length * 2)
    const frames = path.computeFrenetFrames(steps, false)
    const line = path.getSpacedPoints(steps)
    this.surface(steps, sides, (v, u) => {
      const i = Math.round(v * steps)
      const r = radius * (tapered ? 0.14 + 0.86 * Math.pow(Math.sin(Math.PI * v), 0.55) : 1)
      const a = u * 2 * Math.PI
      const point = line[i].clone().addScaledVector(frames.normals[i], r * Math.cos(a))
        .addScaledVector(frames.binormals[i], r * Math.sin(a))
      return [point.x, point.y, point.z]
    }, colour, true)
  }

  finish() {
    const result = new BufferGeometry()
    result.setAttribute('position', new Float32BufferAttribute(this.positions, 3))
    result.setAttribute('color', new Float32BufferAttribute(this.colours, 3))
    result.setIndex(this.indices)
    result.computeVertexNormals()
    result.computeBoundingSphere()
    return result
  }
}

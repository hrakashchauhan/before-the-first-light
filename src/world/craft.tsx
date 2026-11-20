import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'

export type Point = [number, number, number]
export interface Piece {
  at: Point
  size?: Point
  turn?: Point
  tint: string
}

/** Seeded placement is independent of the frame rate, zoom, and quest state. */
export function seedRandom(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
}

export function pick<T>(list: readonly T[], rand: () => number): T {
  return list[Math.floor(rand() * list.length)]
}

export const earth = {
  plaster: '#d9b587', wash: '#e7cc94', oxide: '#a65f42', tile: '#a46046',
  darkWood: '#563e31', wood: '#82634c', door: '#51736a', dark: '#44392f',
  cane: '#bd9865', clay: '#a76043', brass: '#c69b52', charcoal: '#493b32',
}

export const box = new THREE.BoxGeometry(1, 1, 1)
export const groundPatch = new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2)
export const log = new THREE.CylinderGeometry(0.5, 0.59, 1, 8)
export const pebble = new THREE.IcosahedronGeometry(1, 0)
export const matte = new THREE.MeshLambertMaterial()
export const doubleMatte = new THREE.MeshLambertMaterial({ side: THREE.DoubleSide })

// A very fine dry grain breaks up broad plaster, clay and bare-earth highlights.
export const coarse = new THREE.MeshStandardMaterial({ roughness: 0.93 })
coarse.onBeforeCompile = (shader) => {
  shader.vertexShader = 'varying vec3 vGrainPos;\n' + shader.vertexShader.replace(
    '#include <project_vertex>',
    `#include <project_vertex>
      #ifdef USE_INSTANCING
        vGrainPos = (modelMatrix * instanceMatrix * vec4(position, 1.)).xyz;
      #else
        vGrainPos = (modelMatrix * vec4(position, 1.)).xyz;
      #endif`,
  )
  shader.fragmentShader = `varying vec3 vGrainPos;
    float clayHash(vec2 p){
      vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33);
      return fract((q.x+q.y)*q.z);
    }
    float clayNoise(vec2 p){
      vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
      return mix(mix(clayHash(i),clayHash(i+vec2(1,0)),f.x),
                 mix(clayHash(i+vec2(0,1)),clayHash(i+1.),f.x),f.y);
    }
    ` + shader.fragmentShader.replace(
    '#include <color_fragment>',
    `#include <color_fragment>
    vec2 plasterUV = vGrainPos.xz + vec2(.36,.85)*vGrainPos.y;
    float mottling = clayNoise(plasterUV * vec2(1.8,2.4)) - .5;
    float grain = clayHash(floor(plasterUV * 63.)) - .5;
    float visibleGrain = 1. - smoothstep(.012, .065, length(fwidth(vGrainPos)));
    diffuseColor.rgb *= 1. + mottling*.19 + grain*.12*visibleGrain;`,
  )
}

/** One draw per material and shape, independent of the number of tiles or leaves. */
export function Batch({ geometry, parts, material = matte, cast = false, receive = true }: {
  geometry: THREE.BufferGeometry
  parts: Piece[]
  material?: THREE.Material
  cast?: boolean
  receive?: boolean
}) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    if (!mesh.current || typeof mesh.current.setMatrixAt !== 'function') return
    const obj = new THREE.Object3D()
    const color = new THREE.Color()
    parts.forEach(({ at, turn = [0, 0, 0], size = [1, 1, 1], tint }, i) => {
      obj.position.fromArray(at)
      obj.rotation.set(...turn)
      obj.scale.fromArray(size)
      obj.updateMatrix()
      mesh.current!.setMatrixAt(i, obj.matrix)
      mesh.current!.setColorAt(i, color.set(tint))
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
    mesh.current.computeBoundingSphere()
  }, [parts])
  if (!parts.length) return null
  return <instancedMesh ref={mesh} args={[geometry, material, parts.length]} castShadow={cast} receiveShadow={receive} />
}

export function beam(from: Point, to: Point, width: number, tint: string, depth = width): Piece {
  const a = new THREE.Vector3(...from)
  const b = new THREE.Vector3(...to)
  const v = b.clone().sub(a)
  const e = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize()))
  return { at: a.lerp(b, 0.5).toArray(), size: [width, v.length(), depth], turn: [e.x, e.y, e.z], tint }
}

export function surface(vertices: number[], indices: number[], colors?: number[]) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  g.setIndex(indices)
  if (colors) g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  g.computeVertexNormals()
  return g
}

/** Folded, pointed leaf, used at several scales with a distinct silhouette. */
export const leaf = surface([
  0,0,0, -.35,.06,.3, -.39,.13,.59, 0,-.02,1,
  .38,.06,.59, .34,.04,.27, 0,.19,.46,
], [0,1,6, 1,2,6, 2,3,6, 3,4,6, 4,5,6, 5,0,6])

export function vessel(profile: [number, number][], sides = 18) {
  return new THREE.LatheGeometry(profile.map(([r,y]) => new THREE.Vector2(r,y)), sides)
}

export const waterJar = vessel([[0,0],[.11,0],[.17,.055],[.24,.18],[.25,.26],[.22,.34],[.135,.405],[.115,.43],[.13,.455],[.13,.478],[.1,.478],[.098,.43]])

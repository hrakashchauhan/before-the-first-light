import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import { Vector3 } from 'three'
import { COURTYARD_ANCHORS, type TargetId } from '../systems/interaction/household'
export interface SceneSample { fps: number; p95: number; longest: number; calls: number; triangles: number; geometries: number; textures: number }
interface Props { marker: RefObject<HTMLDivElement | null>; target: TargetId | null; sample: RefObject<SceneSample | null> }
export function SceneReadout({ marker, target, sample }: Props) {
  const projected = useRef(new Vector3())
  const frames = useRef<number[]>([])
  const seconds = useRef(0)
  useFrame(({ camera, size, gl }, delta) => {
    const label = marker.current
    if (label && target) {
      const point = projected.current.fromArray(COURTYARD_ANCHORS[target])
      point.y += target === 'npc_mother' ? 1.94 : target === 'npc_artisan' ? 1.6 : 0.95
      point.project(camera)
      label.hidden = point.z < -1 || point.z > 1 || Math.abs(point.x) > 0.92 || Math.abs(point.y) > 0.90
      label.style.transform = `translate(${(point.x + 1) * size.width / 2}px,${(1 - point.y) * size.height / 2}px) translate(-50%,-100%)`
    }
    if (delta <= 0) return
    frames.current.push(delta * 1000)
    seconds.current += delta
    if (seconds.current < 1) return
    const window = frames.current.sort((a,b) => a-b)
    sample.current = {
      fps: Math.round(window.length / seconds.current), p95: Math.round(window[Math.ceil(window.length * 0.95)-1]),
      longest: Math.round(window[window.length-1]), calls: gl.info.render.calls, triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries, textures: gl.info.memory.textures,
    }
    gl.domElement.dataset.performance = JSON.stringify(sample.current)
    frames.current = []
    seconds.current = 0
  })
  return null
}

import { useEffect, useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { GAME_CONFIG } from '../config'
import { boundedZoom, useGameStore } from '../../systems/quests/gameStore'
import { COURTYARD_ANCHORS, type WorldPosition } from '../../systems/interaction/household'
import { isGameplayKey } from '../../systems/interaction/gameInput'

interface CameraControllerProps {
  targetPosition: WorldPosition
  zoomDistance: number
  onZoomChange?: (newDistance: number) => void
}

export function CameraController({ targetPosition, zoomDistance, onZoomChange }: CameraControllerProps) {
  const { camera, gl } = useThree()
  const input = useRef({ zoom: zoomDistance, onZoomChange })
  const aim = useRef(new Vector3())
  const aimGoal = useRef(new Vector3())
  const boom = useRef(new Vector3())
  const boomGoal = useRef(new Vector3())
  const initialized = useRef(false)
  const reducedMotion = useRef(false)
  useLayoutEffect(() => { input.current = { zoom: zoomDistance, onZoomChange } }, [zoomDistance, onZoomChange])
  useLayoutEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const update = () => { reducedMotion.current = media?.matches ?? false }
    update()
    media?.addEventListener('change', update)
    return () => media?.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const isBlocked = () => useGameStore.getState().dialogueActive || useGameStore.getState().isDebugOpen || !!document.querySelector('[aria-modal="true"]')
    const adjust = (value: number) => {
      const next = boundedZoom(value)
      input.current.zoom = next
      input.current.onZoomChange?.(next)
    }
    const wheel = (event: WheelEvent) => {
      if (isBlocked() || event.ctrlKey || event.metaKey || event.deltaY === 0) return
      event.preventDefault()
      const units = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? gl.domElement.clientHeight : 1
      const ticks = MathUtils.clamp(event.deltaY * units / 100, -2, 2)
      adjust(input.current.zoom * Math.exp(ticks * 0.14))
    }
    const keydown = (event: KeyboardEvent) => {
      if (!isGameplayKey(event) || isBlocked()) return
      const key = event.key
      if (key === '0') adjust(GAME_CONFIG.camera.defaultDistance)
      else if (key === '+' || key === '=') adjust(input.current.zoom - 1.2)
      else if (key === '-' || key === '_') adjust(input.current.zoom + 1.2)
      else return
      event.preventDefault()
    }
    const el = gl.domElement
    el.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('keydown', keydown)
    return () => { el.removeEventListener('wheel', wheel); window.removeEventListener('keydown', keydown) }
  }, [gl.domElement])

  useFrame(({ size }, dt) => {
    const config = GAME_CONFIG.camera
    const dialogue = useGameStore.getState().dialogueTargetId
    const talkingToMa = dialogue === 'npc_mother'
    const [px, py, pz] = targetPosition
    const view = MathUtils.smoothstep(zoomDistance, config.minDistance, config.defaultDistance)
    const portraitScale = MathUtils.clamp(size.height / size.width, 1, 1.26)
    const distance = (talkingToMa ? Math.min(zoomDistance, 4.5) : zoomDistance) * portraitScale
    const pitch = MathUtils.lerp(0.09, config.defaultPitch, view)
    const angle = talkingToMa ? config.defaultAngle - 0.46 : config.defaultAngle
    const groundDistance = distance * Math.cos(pitch)
    boomGoal.current.set(groundDistance * Math.cos(angle), distance * Math.sin(pitch), groundDistance * Math.sin(angle))
    if (talkingToMa) {
      const [mx, my, mz] = COURTYARD_ANCHORS.npc_mother
      aimGoal.current.set(MathUtils.lerp(px, mx, 0.73), my + 1.22, MathUtils.lerp(pz, mz, 0.8))
    } else {
      aimGoal.current.set(px, py + MathUtils.lerp(1.18, 1.22, view), pz - 0.75 * view)
    }
    if (!initialized.current || reducedMotion.current) {
      aim.current.copy(aimGoal.current)
      boom.current.copy(boomGoal.current)
      initialized.current = true
    } else {
      aim.current.lerp(aimGoal.current, 1 - Math.exp(-7 * dt))
      boom.current.lerp(boomGoal.current, 1 - Math.exp(-6 * dt))
    }
    camera.position.copy(aim.current).add(boom.current)
    camera.lookAt(aim.current)
  }, -1)
  return null
}

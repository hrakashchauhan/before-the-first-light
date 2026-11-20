import { render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { PerspectiveCamera } from 'three'
import { CameraController } from '../game/camera/CameraController'
import { GAME_CONFIG } from '../game/config'
import { PLAYER_START } from '../systems/interaction/household'
import { useGameStore } from '../systems/quests/gameStore'

type Frame = (state: { size: { width: number; height: number } }, dt: number) => void
const hooks = vi.hoisted(() => ({
  useFrame: vi.fn<(callback: Frame, order: number) => void>(),
  useThree: vi.fn(),
}))
vi.mock('@react-three/fiber', () => hooks)

afterEach(() => { vi.unstubAllGlobals(); useGameStore.getState().resetGame(); vi.clearAllMocks() })

it('honours a live reduced-motion preference change on the next zoom, follow, and Ma conversation frame', () => {
  const camera = new PerspectiveCamera()
  hooks.useThree.mockReturnValue({ camera, gl: { domElement: document.createElement('canvas') } })
  const media = Object.assign(new EventTarget(), { matches: false })
  vi.stubGlobal('matchMedia', () => media)
  const { rerender } = render(<CameraController targetPosition={PLAYER_START} zoomDistance={GAME_CONFIG.camera.defaultDistance}/>)
  const frame = () => hooks.useFrame.mock.calls.at(-1)![0]({ size: { width: 1280, height: 720 } }, 1 / 60)
  frame()
  rerender(<CameraController targetPosition={PLAYER_START} zoomDistance={GAME_CONFIG.camera.minDistance}/>)
  frame()
  const moving = camera.position.clone()
  frame()
  expect(camera.position.distanceTo(moving)).toBeGreaterThan(0.1)

  media.matches = true
  media.dispatchEvent(new Event('change'))
  frame()
  const settled = camera.position.clone()
  frame()
  expect(camera.position.distanceTo(settled)).toBe(0)

  rerender(<CameraController targetPosition={[0.8, 0, -0.7]} zoomDistance={GAME_CONFIG.camera.defaultDistance}/>)
  frame()
  const followed = camera.position.clone()
  frame()
  expect(camera.position.distanceTo(followed)).toBe(0)
  useGameStore.getState().interactWithTarget('npc_mother')
  frame()
  const twoShot = camera.position.clone()
  expect(twoShot.distanceTo(followed)).toBeGreaterThan(1)
  frame()
  expect(camera.position.distanceTo(twoShot)).toBe(0)
})

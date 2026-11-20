import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// JSDOM mock for ResizeObserver needed by React Three Fiber
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis !== 'undefined') {
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
}

// Mock R3F hooks for non-Canvas test rendering in JSDOM
vi.mock('@react-three/fiber', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@react-three/fiber')>()
  return {
    ...actual,
    useFrame: vi.fn(),
    useThree: () => ({
      camera: { position: { lerp: vi.fn() }, lookAt: vi.fn() },
      gl: { domElement: { addEventListener: vi.fn(), removeEventListener: vi.fn() } },
    }),
  }
})

import '@testing-library/jest-dom/vitest'

// JSDOM mock for ResizeObserver needed by React Three Fiber
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis !== 'undefined') {
  globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
}

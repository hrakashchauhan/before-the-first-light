import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { GAME_CONFIG } from './config'
import { CameraController } from './camera/CameraController'

interface GameCanvasProps {
  children?: React.ReactNode
  targetPosition?: [number, number, number]
  zoomDistance?: number
  onZoomChange?: (newDistance: number) => void
}

export function GameCanvas({
  children,
  targetPosition = [0, 0, 1.8],
  zoomDistance = GAME_CONFIG.camera.defaultDistance,
  onZoomChange,
}: GameCanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        dpr={[GAME_CONFIG.dpr.min, GAME_CONFIG.dpr.max]}
        camera={{
          fov: GAME_CONFIG.camera.fov,
          near: GAME_CONFIG.camera.near,
          far: GAME_CONFIG.camera.far,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={({ scene }) => {
          scene.background = null
        }}
      >
        {/* Camera Tracking Controller with Wheel & Key Zoom */}
        <CameraController
          targetPosition={targetPosition}
          zoomDistance={zoomDistance}
          onZoomChange={onZoomChange}
        />

        {/* Soft Ambient Light (Warm Morning Daylight Fill) */}
        <ambientLight
          color={GAME_CONFIG.lighting.ambientColor}
          intensity={GAME_CONFIG.lighting.ambientIntensity}
        />

        {/* Directional Sun Light (Soft Morning Key Shadows) */}
        <directionalLight
          castShadow
          position={GAME_CONFIG.lighting.sunPosition}
          intensity={GAME_CONFIG.lighting.sunIntensity}
          color={GAME_CONFIG.lighting.sunColor}
          shadow-mapSize-width={GAME_CONFIG.lighting.shadowMapSize}
          shadow-mapSize-height={GAME_CONFIG.lighting.shadowMapSize}
          shadow-camera-near={0.5}
          shadow-camera-far={60}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={16}
          shadow-camera-bottom={-16}
          shadow-bias={-0.0005}
        />

        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  )
}

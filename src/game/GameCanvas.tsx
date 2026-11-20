import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { GAME_CONFIG } from './config'

interface GameCanvasProps {
  children?: React.ReactNode
}

export function GameCanvas({ children }: GameCanvasProps) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        dpr={[GAME_CONFIG.dpr.min, GAME_CONFIG.dpr.max]}
        camera={{
          position: GAME_CONFIG.camera.position,
          fov: GAME_CONFIG.camera.fov,
          near: GAME_CONFIG.camera.near,
          far: GAME_CONFIG.camera.far,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={({ scene, camera }) => {
          scene.background = null
          camera.lookAt(...GAME_CONFIG.camera.target)
        }}
      >
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
          shadow-camera-far={45}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0005}
        />

        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}

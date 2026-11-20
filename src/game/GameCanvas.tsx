import { Suspense, useEffect, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { GAME_CONFIG } from './config'
import { CameraController } from './camera/CameraController'
interface Props {
  children?: ReactNode; targetPosition?: [number,number,number]; zoomDistance?: number
  onZoomChange?: (newDistance:number)=>void; paused?:boolean
}

function ShadowRefresh() {
  const { gl } = useThree()
  const elapsed = useRef(0)
  useEffect(() => {
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
    return () => { gl.shadowMap.autoUpdate = true }
  }, [gl])
  useFrame((_, delta) => {
    elapsed.current += delta
    if (elapsed.current >= 0.25) {
      gl.shadowMap.needsUpdate = true
      elapsed.current = 0
    }
  })
  return null
}
export function GameCanvas({children,targetPosition=[0,0,1.8],zoomDistance=GAME_CONFIG.camera.defaultDistance,onZoomChange,paused=false}:Props) {
  const light = GAME_CONFIG.lighting
  return <Canvas shadows frameloop={paused?'demand':'always'} dpr={[GAME_CONFIG.dpr.min,GAME_CONFIG.dpr.max]}
    camera={{fov:GAME_CONFIG.camera.fov,near:GAME_CONFIG.camera.near,far:GAME_CONFIG.camera.far}}
    gl={{antialias:true,powerPreference:'high-performance',alpha:false}}>
    <color attach="background" args={['#dcc1a2']}/>
    <fog attach="fog" args={['#e8c8a1', 19, 78]}/>
    <CameraController targetPosition={targetPosition} zoomDistance={zoomDistance} onZoomChange={onZoomChange}/>
    <ShadowRefresh/>
    <hemisphereLight args={['#e0eef0','#d2ad86',1.4]}/>
    <ambientLight color={light.ambientColor} intensity={light.ambientIntensity}/>
    <directionalLight castShadow position={light.sunPosition} intensity={light.sunIntensity} color={light.sunColor}
      shadow-mapSize-width={light.shadowMapSize} shadow-mapSize-height={light.shadowMapSize}
      shadow-camera-near={0.5} shadow-camera-far={46} shadow-camera-left={-12} shadow-camera-right={12}
      shadow-camera-top={11} shadow-camera-bottom={-11} shadow-normalBias={0.018} shadow-bias={-0.00015}/>
    <Suspense fallback={null}>{children}</Suspense>
  </Canvas>
}

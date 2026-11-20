import * as THREE from 'three'
import { Batch, beam, coarse, log, vessel } from '../../world/craft'
import type { Point, Piece } from '../../world/craft'
const casting=vessel([[0,0],[.167,0],[.184,.025],[.185,.06],[.122,.09],[.113,.22],[.082,.44],[.077,.81],[.094,.84],[.1,1.19],[.087,1.25],[.048,1.265],[0,1.265]],14)
const iron=new THREE.MeshStandardMaterial({metalness:.18,roughness:.69})
const teal='#45605b'
const main:Piece[]=[{at:[0,.085,0],tint:teal}]
const spout=[beam([0,.91,.03],[0,.89,.235],.074,teal),beam([0,.90,.21],[0,.81,.30],.073,teal)]
const lever=[beam([0,1.30,-.07],[0,1.51,-.32],.053,'#4b5351'),beam([0,1.5,-.31],[0,1.25,-.93],.047,'#484e4c'),beam([0,1.25,-.90],[0,1.21,-1.0],.054,'#806348')]
const slab=vessel([[0,0],[1.09,0],[1.07,.077],[1.017,.102],[.99,.096],[.96,.064],[0,.062]],27)
export function Handpump({position=[4.6,0,3.2]}:{position?:Point}){
  return <group position={position} name="handpump">
    <Batch geometry={slab} material={coarse} parts={[{at:[0,0,0],tint:'#aaa793'}]} />
    <Batch geometry={casting} parts={main} material={iron} cast />
    <Batch geometry={log} parts={spout} material={iron} cast />
    <Batch geometry={log} parts={lever} material={iron} cast />
  </group>
}

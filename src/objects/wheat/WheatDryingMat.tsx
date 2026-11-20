import { Batch, box, coarse, pebble, pick, seedRandom } from '../../world/craft'
import type { Point, Piece } from '../../world/craft'
export type WheatStage='empty_mat'|'sorting'|'spread'
const mat:Piece[]=[],rim:Piece[]=[],heaps:Piece[]=[], kernels:Piece[]=[]
const r=seedRandom(3621)
for(let i=0;i<43;i++)mat.push({at:[-1.067+i*.0508,.012,0],size:[.050,.019,1.37+(r()-.5)*.025],
  tint:pick(['#caa477','#d3b383','#c7a274','#d7b788','#cba879'],r)})
for(let i=0;i<24;i++)mat.push({at:[0,.024,-.67+i*.0585],size:[2.16,.008,.012],tint:i%6===1?'#a78060':'#b79570'})
for(const x of [-1.01,.98])for(let i=0;i<3;i++)rim.push({at:[x+i*.027,.030,0],size:[i===1?.025:.012,.011,1.38],tint:i===1?'#976953':'#b38260'})
for (const z of [-.689,.689]) rim.push({at:[0,.024,z],size:[2.2,.024,.029],tint:'#a67f5b'})
for(let i=0;i<1300;i++){
  const a=r()*6.28, dist=Math.sqrt(r()), jitter=1+.06*Math.sin(3*a)+Math.cos(5*a)*.05
  const s=.015+r()*.011
  const kern:Piece={at:[Math.cos(a)*dist*.92*jitter,.048+r()*.013,Math.sin(a)*dist*.55*jitter],
    turn:[0,r()*6.28,(r()-.5)*.3],size:[s,.011+r()*.005,s*1.9],tint:pick(['#d59a44','#e4b461','#c99756','#e9c279','#d6a75d'],r)}
  kernels.push(kern)
  if(i<250)heaps.push({...kern,at:[-.58+Math.cos(a)*dist*.25,.06+.095*(1-dist*dist)+r()*.012,-.12+Math.sin(a)*dist*.18]})
}
export function WheatDryingMat({position=[1.2,.02,1.8],stage='spread'}:{position?:Point;stage?:WheatStage}){
  return <group position={position} name={'wheat-'+stage}>
    <Batch geometry={box} parts={mat} material={coarse} />
    <Batch geometry={box} parts={rim} />
    <Batch geometry={pebble} parts={stage==='sorting'?heaps:stage==='spread'?kernels:[]} />
  </group>
}

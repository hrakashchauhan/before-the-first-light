import * as THREE from 'three'
import { Batch, box, doubleMatte, pick, seedRandom, surface, vessel } from '../../world/craft'
import type { Point, Piece } from '../../world/craft'
const r=seedRandom(4912), wicker=['#d2aa6c','#b68d59','#d1a56b','#bf955e','#ddba80']
const weave:Piece[]=[], bands:Piece[]=[], slats:Piece[]=[]
const ring=new THREE.TorusGeometry(1,.028,5,34)
const deep=vessel([[0,.01],[.16,.01],[.19,.05],[.25,.15],[.29,.29],[.292,.33],[.278,.33],[.275,.29],[.232,.15],[.15,.035],[0,.035]],28)
for(let i=0;i<8;i++){
  const y=.045+i*.038,radius=.183+Math.sin((y/.36)*1.47)*.112
  bands.push({at:[.59,y,.08],size:[radius,radius,radius],turn:[Math.PI/2,.018*Math.sin(i),0],tint:pick(wicker,r)})
}
function rib() {
  const v:number[]=[],ix:number[]=[]
  for(let i=0;i<10;i++){
    const y=.019+i*.034
    const radius=.17+Math.sin((y/.36)*1.48)*.127+(i%2?.005:-.003)
    v.push(-.009,y,radius,.009,y,radius)
    if(i<9){const n=i*2;ix.push(n,n+1,n+2,n+2,n+1,n+3)}
  }
  return surface(v,ix)
}
const upright=rib()
for(let i=0;i<29;i++)weave.push({at:[.59,0,.08],turn:[0,i*2*Math.PI/29,0],tint:pick(wicker,r)})
// The shallow winnowing tray narrows at the mouth and rises toward the back.
for(let i=0;i<17;i++){
  const z=-.29+i*.036,frac=i/16
  slats.push({at:[-.01,.03+.095*(1-frac)**2,z],size:[.52-.085*frac,.019,.036],turn:[.2*(1-frac),0,0],tint:pick(wicker,r)})
}
for(let i=0;i<13;i++)slats.push({at:[-.239+i*.038,.073,-.01],size:[.012,.013,.58],turn:[.165,0,0],tint:'#bf9664'})
for(const s of [-1,1])slats.push({at:[s*.237,.094,-.01],size:[.022,.052,.60],turn:[.18,s*-.07,0],tint:'#aa8155'})
slats.push({at:[0,.148,-.295],size:[.54,.075,.028],tint:'#aa8055'})
const body:Piece[]=[{at:[.59,0,.08],tint:'#bb945c'}]
export function BambooBaskets({position=[-1.5,.32,-2.4],showDaura=true}:{position?:Point;showDaura?:boolean}){
  return <group position={position} name="household-baskets">
    <Batch geometry={box} parts={slats} cast />
    {showDaura&&<>
      <Batch geometry={deep} parts={body} cast />
      <Batch geometry={ring} parts={bands} />
      <Batch geometry={upright} parts={weave} material={doubleMatte} />
    </>}
  </group>
}

import { Batch, beam, box, earth, log, pick, seedRandom, surface, vessel } from '../../world/craft'
import type { Piece, Point } from '../../world/craft'
const parts:Piece[]=[], rails:Piece[]=[], warp:Piece[]=[], posts:Piece[]=[]
const turned=vessel([[.037,0],[.043,.035],[.032,.075],[.032,.27],[.049,.31],[.05,.45],[.063,.465],[.051,.5],[.024,.53],[0,.53]],10)
for (const x of [-.88,.88])for(const z of [-.48,.48])posts.push({at:[x,0,z],tint:earth.wood})
for(const x of [-.88,.88])rails.push(beam([x,.409,-.49],[x,.409,.49],.062,earth.wood))
for(const z of [-.48,.48])rails.push(beam([-.9,.409,z],[.9,.409,z],.065,earth.wood))
const rand=seedRandom(317),twine=['#c1a577','#b99c70','#c8ab7b','#b99b6c']
for(let i=0;i<48;i++){
  const x=-.817+i*.0345
  warp.push({at:[x,.408,0],size:[.023,.017,.93],tint:pick(twine,rand)})
}
for(let j=0;j<20;j++){
  const z=-.439+j*.046
  for(let i=0;i<15;i++){
    const x=-.737+i*.102
    warp.push(beam([x,.423,z],[x+.052,.424,z+(i%2?-.031:.031)],.014, i%2?'#d3b684':'#c6a572',.019))
  }
}
function foldedCloth(){
  const v:number[]=[],ix:number[]=[],cs:number[]=[]
  const colors=[[.22,.37,.34],[.27,.42,.37],[.58,.53,.37],[.24,.39,.35]]
  for(let iz=0;iz<=25;iz++)for(let ixp=0;ixp<=7;ixp++){
    const t=iz/25,u=ixp/7,z=-.42+t*1.03
    const hem=Math.max(0,z-.46)
    const h=.455+Math.sin(u*19+t*.8)*.011+Math.sin(t*4)*.005
    v.push(.21+u*.54,h-hem*1.71,Math.min(z,.46)+hem*.23)
    const c=colors[iz%12===1||iz%12===3?2:ixp%3===0?1:0]
    cs.push(...c)
    if(iz<25&&ixp<7){const k=iz*8+ixp;ix.push(k,k+8,k+1,k+1,k+8,k+9)}
  }
  return surface(v,ix,cs)
}
const cloth=foldedCloth()
parts.push({at:[.48,.431,0],size:[.52,.028,.88],tint:'#79765d'})
export function Charpai({position=[-3.2,0,3.4],rotation=[0,.25,0]}:{position?:Point;rotation?:Point}){
  return <group position={position} rotation={rotation} name="rope-cot">
    <Batch geometry={turned} parts={posts} cast /><Batch geometry={log} parts={rails} cast />
    <Batch geometry={box} parts={warp} /><Batch geometry={box} parts={parts} />
    <mesh geometry={cloth} castShadow receiveShadow><meshStandardMaterial vertexColors roughness={1}/></mesh>
  </group>
}

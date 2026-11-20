import * as THREE from 'three'
import { Batch, box, coarse, doubleMatte, leaf, pebble, pick, seedRandom, surface } from '../craft'
import type { Piece } from '../craft'
const rand = seedRandom(8911)
const saturate=(n:number)=>Math.min(1,Math.max(0,n))
const green=new THREE.Color('#8a9668'), dust=new THREE.Color('#ae896b'), path=new THREE.Color('#d5ae8b')
const colorMat=new THREE.MeshLambertMaterial({vertexColors:true})
function terrain() {
  const v:number[]=[], ind:number[]=[], c:number[]=[]
  const coords=[-100,-68,-45,-35,-27,-21,-17,-14,-12,-11,-10,-9,-8,-7,-6,
    ...Array.from({length:54},(_,i)=>-5+i*.5),22,23,25,27,31,35,45,68,100]
  for(let j=0;j<coords.length;j++)for(let i=0;i<coords.length;i++){
    const x=coords[i],z=coords[j]
    const broad=Math.sin(x*.38+z*.18)*.47+Math.sin(z*.55+x*.2)*.21
    const dist=Math.hypot((x+.1)/6.0,(z-.8)/5.25)
    const court=saturate((1.4-dist)*3.5+broad*.2)
    const laneZ=4.23+Math.sin(x*.45)*.23
    const lane=saturate((2.08-Math.abs(z-laneZ))*.9)*saturate(x-2.)
    const westLane=saturate(1.6-Math.abs(x+9.5+Math.sin(z*.17)*2.5))
    const wear=saturate((1.2-dist)*.87 + lane*.8+westLane*.7)
    const tint=green.clone().lerp(dust,saturate(court+westLane+lane)).lerp(path,wear)
    const isPond=x>=21.5&&x<=35.5&&Math.abs(z-3.5)<10
    const y=isPond?-.38:(court>.1||lane>.1?-.013: -.065+Math.sin(z*.6)*Math.sin(x*.49)*.045)
    const shade=1+broad*.085+(rand()-.5)*(court>.3?.046:.12)
    tint.multiplyScalar(shade)
    v.push(x,y,z); c.push(tint.r,tint.g,tint.b)
    if(i<coords.length-1&&j<coords.length-1){
      const a=j*coords.length+i,n=coords.length
      ind.push(a,a+n,a+1,a+1,a+n,a+n+1)
    }
  }
  return surface(v,ind,c)
}
const ground=terrain()
const walls: Piece[]=[], caps:Piece[]=[], stones:Piece[]=[], straw:Piece[]=[], swept:Piece[]=[], grass:Piece[]=[]
for(const [x,z,sx,sz,h] of [[-5.4,2.64,.38,5.78,1.27],[6.2,-.63,.34,6.05,1.06]]){
  walls.push({at:[x,h*.5,z],size:[sx,h,sz],tint:'#c8a37a'})
  walls.push({at:[x,.13,z],size:[sx+.012,.26,sz+.012],tint:'#ac8160'})
  const alongX=sx>sz, length=Math.max(sx,sz),n=Math.ceil(length/.51)
  for(let i=0;i<n;i++){
    const offset=(i+.5)*length/n-length/2
    caps.push({at:[x+(alongX?offset:0),h+.022+rand()*.009,z+(alongX?0:offset)],size:[alongX?length/n-.016:sx+.046,.082,alongX?sz+.044:length/n-.016],
      tint:pick(['#b97d57','#bf8860','#af7857','#cd9270'],rand)})
  }
}
// At the opening, a weathered brick toe marks the edge of the yard without
// masking the family or mat from the inspection camera.
for(let i=0;i<33;i++){
  const x=-5.55+i*.284
  caps.push({at:[x,.042+rand()*.014,6.42+Math.sin(i*.52)*.018],size:[.274,.106,.24],turn:[0,(rand()-.5)*.05,0],tint:pick(['#ab8268','#b08a6f','#b49275'],rand)})
}
// Weathered stones and opportunistic grass collect at wall feet, away from the swept area.
for(let i=0;i<490;i++){
  const a=rand()*6.28,r=5.18+rand()*6.8
  const x=Math.cos(a)*r,z=.74+Math.sin(a)*r*.89
  if((x>3.6&&z>1.8&&z<6.2)||(x>-4.8&&x<4.8&&z<-1.5)||(x<4&&z>5.8))continue
  for(let j=0;j<5;j++){
    grass.push({at:[x+(rand()-.5)*.25,-.006,z+(rand()-.5)*.2],size:[.035+rand()*.05,.08,.14+rand()*.29],
      turn:[-.79-rand()*.55,rand()*6.28,rand()*.22],tint:pick(['#81924c','#8c9855','#989954','#6a7d43','#b2ad6b'],rand)})
  }
}
for(let i=0;i<130;i++){
  const a=rand()*6.28,r=4.83+rand()*1.43,x=Math.cos(a)*r,z=Math.sin(a)*r+.6
  const s=.024+rand()*.09
  stones.push({at:[x,.001,z],size:[s,.28*s,s*.8],turn:[0,rand()*6.3,0],tint:pick(['#a98864','#b89975','#c7ab84'],rand)})
}
const leafColors=['#a7723f','#917247','#ac8d54','#9e6942','#b89563']
for(let i=0;i<86;i++){
  const t=rand()*6.28,r=Math.sqrt(rand())
  const x=-.47+Math.cos(t)*r*2.7,z=.47+Math.sin(t)*r*2.5
  if(x>.18&&x<2.6&&z>1.01&&z<2.6)continue
  straw.push({at:[x,.004,z],size:[.083+rand()*.07,.015,.095+rand()*.09],turn:[0,rand()*6.28,0],tint:pick(leafColors,rand)})
}
// Sweeping clears scattered leaves into a small pile by the compound wall.
for(let i=0;i<37;i++){
  const a=rand()*6.28, r=Math.sqrt(rand())
  swept.push({at:[-4.63+Math.cos(a)*r*.46,.012+(1-r)*.08,.47+Math.sin(a)*r*.21],
    size:[.1,.016,.15],turn:[(rand()-.5)*.38,rand()*6.28,0],tint:pick(leafColors,rand)})
}
// Shallow arced broom traces are real ground-following geometry.
function rakeLines(){
  const v:number[]=[], ix:number[]=[]
  for(let row=0;row<19;row++){
    const originX=row<11?-1.21:1.05, originZ=row<11?-.7:-.3
    const radius=.8+(row%11)*.055
    const angle=rand()*.4
    for(let j=0;j<13;j++){
      const a=.25+angle+j*.11
      const k=v.length/3
      for(const w of [0,.012])v.push(originX+Math.cos(a)*(radius+w),.003,originZ+Math.sin(a)*(radius+w))
      if(j<12)ix.push(k,k+2,k+1,k+1,k+2,k+3)
    }
  }
  return surface(v,ix)
}
const traces=rakeLines()
const traceMat=new THREE.MeshStandardMaterial({color:'#c7a47f',roughness:1,side:THREE.DoubleSide})
export function CourtyardGround({isCleaned=false}:{isCleaned?: boolean}){
  return <group name="courtyard-earth">
    <mesh geometry={ground} material={colorMat} receiveShadow />
    <Batch geometry={box} parts={walls} material={coarse} cast />
    <Batch geometry={box} parts={caps} material={coarse} />
    <Batch geometry={pebble} parts={stones} />
    <Batch geometry={leaf} parts={grass} material={doubleMatte} />
    <Batch geometry={leaf} parts={isCleaned?swept:straw} material={doubleMatte} />
    {isCleaned&&<mesh geometry={traces} material={traceMat} receiveShadow />}
  </group>
}

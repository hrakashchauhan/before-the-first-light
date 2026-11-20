import * as THREE from 'three'
import { Batch, beam, box, doubleMatte, groundPatch, leaf, log, pebble, pick, seedRandom, surface } from '../craft'
import type { Piece, Point } from '../craft'

const rand = seedRandom(19783)
const fields: Piece[] = []
const crops: Piece[] = []
const harvestColors = ['#9ca268','#929e68','#a5a273','#9eab74','#a9a776','#9f9d69']
for (const side of [-1,1]) {
  for (let j=0;j<6;j++) for (let i=0;i<5;i++) {
    const x=side*(13.5+i*6.8), z=-11.8-j*7.3, yaw=side*.11
    const tint=pick(harvestColors,rand)
    fields.push({at:[x,.003,z],size:[6.33,.04,7.04],turn:[0,yaw,0],tint})
    for (let row=0;row<7;row++) {
      const dx=(row-3)*.86
      crops.push({at:[x+dx*Math.cos(yaw),.031,z-dx*Math.sin(yaw)],size:[.13,.019,6.36],turn:[0,yaw,0],
        tint:pick(['#9da270','#a4a475','#a1a470'],rand)})
    }
  }
}
const boughs: Piece[] = [], crowns: Piece[] = [], horizon: Piece[] = [], leaves: Piece[] = [], huts: Piece[] = [], roofs: Piece[] = []
const greens = ['#596e49','#6d8250','#82935b','#6e8654','#5e7550','#899759']
const highlights = ['#809456','#879954','#798e53','#a4a764','#687f46','#9f9f57']
// A lobed crown with a cool underside. The irregular lower hem breaks its
// silhouette; leaf fans continue that edge into individually readable foliage.
function crownGeometry(){
  const v:number[]=[],ix:number[]=[],tints:number[]=[]
  const rows=[[.06,-.71],[.52,-.59],[.91,-.34],[1,.03],[.89,.33],[.56,.62],[.03,.71]]
  for(let j=0;j<rows.length;j++)for(let i=0;i<13;i++){
    const a=i*Math.PI*2/13+Math.sin(j*.7)*.11
    const [rr,h]=rows[j],r=rr*(1+.11*Math.sin(a*5+j*.92)+.07*Math.cos(a*3+j*.28))
    v.push(Math.cos(a)*r,h+Math.sin(a*4+j)*.065,Math.sin(a)*r)
    const light=.61+.45*(j/(rows.length-1))+.07*Math.sin(a*3+j)
    tints.push(light*.94,light,light*.94)
    if(j<rows.length-1){const q=j*13+i,b=j*13+(i+1)%13;ix.push(q,q+13,b,b,q+13,b+13)}
  }
  return surface(v,ix,tints)
}
const crown=crownGeometry()
const crownMat=new THREE.MeshLambertMaterial({vertexColors:true})
function plantTree(x: number, z: number, scale: number, distant = false) {
  const at = (dx: number, dy: number, dz: number): Point => [x+dx*scale, dy*scale, z+dz*scale]
  boughs.push(beam(at(0,-.06,0),at(.12,2.3,-.06),scale*.28, '#65543c'))
  const limbs = distant ? 3 : 8
  for(let i=0;i<limbs;i++) {
    const a=i*2.39996+rand()*.24
    const r=.68+rand()*.73
    const dx=Math.cos(a)*r, dz=Math.sin(a)*r
    const y=2.55+rand()*1.1
    boughs.push(beam(at(.07,.85+rand()*.7,-.025),at(dx,y,dz),scale*.09, '#776041'))
    const spread=.62+rand()*.36
    const blobs = distant ? horizon : crowns
    blobs.push({at:at(dx,y+.18,dz),size:[spread*scale, (.59+rand()*.27)*scale,spread*scale*.86],
      turn:[rand()*.15,rand()*3,rand()*.19],tint:pick(greens,rand)})
    if(distant) continue
    const leafCount=43
    for(let j=0;j<leafCount;j++) {
      const t=rand()*6.28, rr=spread*(.57+rand()*.54)
      const lx=dx+Math.cos(t)*rr, lz=dz+Math.sin(t)*rr
      const ly=y+.1+.49*(1-(rr/spread)**2)+rand()*.31
      const w=(.13+rand()*.11)*scale
      leaves.push({at:at(lx,ly,lz),size:[w,w,(.23+rand()*.30)*scale],
        turn:[.15+rand()*.81, Math.PI/2-t+rand()*.8-.4,(rand()-.5)*1.23],tint:pick(j%5===0?greens:highlights,rand)})
    }
  }
  const top = distant ? horizon : crowns
  top.push({at:at(.1,3.63,-.02),size:[scale*.96,scale*.71,scale*.85],tint:pick(greens,rand)})
}
// Leave a gap on the left between two stands of trees for the sunrise and fields.
for(const [x,z,s] of [[-11.7,-5.8,1.36],[8.5,-10.5,1.73],[2,-14,1.24],[-15,4,1.6],[-9.2,1.2,1.04],
  [14.1,-5.4,1.5],[23,-10,1.45],[-19,-15,1.35],[-14,-23,1.12],[-4,-23,.92],[32,11,1.27],[-18,8,1.25]]) plantTree(x,z,s)
for(let i=0;i<31;i++){
  const a=i*(Math.PI*2/31), r=32+rand()*24
  plantTree(Math.sin(a)*r,Math.cos(a)*r,.55+rand()*.70,true)
}
function homestead(x:number,z:number,w:number,yaw:number) {
  const transform = (lx:number,y:number,lz:number):Point => [x+lx*Math.cos(yaw)+lz*Math.sin(yaw),y,z-lx*Math.sin(yaw)+lz*Math.cos(yaw)]
  const d=w*.65, h=w*.42, rise=w*.17
  huts.push({at:transform(0,h/2,0),size:[w,h,d],turn:[0,yaw,0],tint:pick(['#b79d7d','#ceae86','#d0b48d'],rand)})
  huts.push({at:transform(0,.13,d*.501),size:[w,.26,.032],turn:[0,yaw,0],tint:'#9f7c60'})
  for(const dx of [-w*.29,w*.12]) {
    const isDoor=dx<0
    huts.push({at:transform(dx,isDoor?h*.41:h*.57,d*.51),size:[w*.14,h*(isDoor?.79:.4),.04],turn:[0,yaw,0],tint:'#675d4c'})
    huts.push({at:transform(dx,h*.82,d*.51+.025),size:[w*.21,h*.05,.055],turn:[0,yaw,0],tint:'#8f795b'})
  }
  for(const sign of [-1,1]) {
    const dz=(d*.57)*sign
    roofs.push({at:transform(0,h+rise*.52,dz*.5),size:[w*1.12,.12,Math.hypot(dz,rise)],turn:[0,yaw,0],
      tint:pick(['#9f7253','#ac7a55','#ae805c'],rand)})
    const p=roofs[roofs.length-1]
    const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),yaw).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),sign*Math.atan2(rise,Math.abs(dz))))
    const e=new THREE.Euler().setFromQuaternion(q)
    p.turn=[e.x,e.y,e.z]
  }
}
for(const [x,z,w,a] of [[-13,-16,3.8,.65],[13,-16,4.2,-.63],[-5,-26,5.2,.19],[-20,-23,4.5,-.24],
  [-23,-8,4.1,-.33],[18,-19,4.7,.31],[28,-10,3.9,.5],[-33,-15,4.1,.22]]) homestead(x,z,w,a)

// Evaluate broad atmospheric colour once on the CPU. The sky only shades the
// pixels left after opaque objects, with a cheap optical disc in the fragment.
const skyGeometry = new THREE.SphereGeometry(126,56,32)
const skyPosition=skyGeometry.getAttribute('position')
const skyColors:number[]=[]
const ray=new THREE.Vector3(), sun=new THREE.Vector3(-.51,.136,-1).normalize()
function skyNoise(x:number,y:number){
  const hash=(a:number,b:number)=>{const h=Math.sin(a*127.1+b*311.7)*43758.5453;return h-Math.floor(h)}
  const i=Math.floor(x),j=Math.floor(y)
  const u=THREE.MathUtils.smoothstep(x-i,0,1),v=THREE.MathUtils.smoothstep(y-j,0,1)
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(i,j),hash(i+1,j),u),THREE.MathUtils.lerp(hash(i,j+1),hash(i+1,j+1),u),v)
}
const horizonColor=new THREE.Color(1,.80,.63),zenith=new THREE.Color(.55,.72,.78), glow=new THREE.Color(1,.825,.58)
const clouds=new THREE.Color(1,.834,.68),skyColor=new THREE.Color()
for(let i=0;i<skyPosition.count;i++){
  ray.fromBufferAttribute(skyPosition,i).normalize()
  const h=Math.max(0,ray.y), d=ray.distanceTo(sun),x=(ray.x+ray.z*.22)*7,y=h*31.5
  skyColor.copy(horizonColor).lerp(zenith,THREE.MathUtils.smoothstep(h,-.018,.235)).lerp(glow,.66*Math.exp(-d*5))
  const bank=.75*skyNoise(x,y)+.25*skyNoise(x*2.7,y*2.7)
  const alpha=THREE.MathUtils.smoothstep(bank,.5,.74)*THREE.MathUtils.smoothstep(h,.01,.1)*(1-THREE.MathUtils.smoothstep(h,.40,.72))
  skyColor.lerp(clouds,alpha*.64)
  skyColors.push(skyColor.r,skyColor.g,skyColor.b)
}
skyGeometry.setAttribute('color',new THREE.Float32BufferAttribute(skyColors,3))
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite:false, fog:false, vertexColors:true,
  vertexShader:`varying vec3 viewDir; varying vec3 skyColor;
    void main(){ vec3 p = (modelMatrix * vec4(position,1.)).xyz;
    skyColor=color; viewDir = p - cameraPosition; gl_Position = projectionMatrix * viewMatrix * vec4(p,1.); }`,
  fragmentShader:`
    varying vec3 viewDir; varying vec3 skyColor;
    void main() {
      vec3 d=normalize(viewDir);
      vec3 sun=normalize(vec3(-.51,.136,-1.));
      float solar = smoothstep(.99957,.99964,dot(d,sun));
      vec3 col=mix(skyColor,vec3(1.,.97,.80),solar);
      gl_FragColor=vec4(col,1.);
    }`,
})
// Eight distant birds, shaped as two kinked wings each, are legible against the sky.
const birdVerts:number[] = [], birdIndices:number[] = []
for(let i=0;i<8;i++){
  const x=-21+i*1.03+rand()*.38, y=7.3+Math.sin(i*.8)*.69+rand()*.34, z=-35+rand()*2
  const size=.24+rand()*.15
  for(const s of [-1,1]){
    const n=birdVerts.length/3
    birdVerts.push(x,y,z, x+s*size*.44,y+size*.26,z, x+s*size,y+size*.22,z+.05,
      x+s*size*.43,y+size*.09,z+.055)
    birdIndices.push(n,n+1,n+3,n+1,n+2,n+3)
  }
}
const birds=surface(birdVerts,birdIndices)
const birdMat = new THREE.MeshBasicMaterial({color:'#736650',side:THREE.DoubleSide})
export function VillageAtmosphere() {
  return <group name="dawn-and-village">
    <mesh geometry={skyGeometry} material={skyMat} renderOrder={100} />
    <Batch geometry={groundPatch} parts={fields} receive={false} />
    <Batch geometry={groundPatch} parts={crops} receive={false} />
    <Batch geometry={box} parts={huts} cast />
    <Batch geometry={box} parts={roofs} cast />
    <Batch geometry={log} parts={boughs} cast />
    <Batch geometry={crown} parts={crowns} material={crownMat} cast />
    <Batch geometry={pebble} parts={horizon} receive={false} />
    <Batch geometry={leaf} parts={leaves} material={doubleMatte} receive={false} />
    <mesh geometry={birds} material={birdMat} />
  </group>
}

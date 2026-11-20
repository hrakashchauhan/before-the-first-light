import * as THREE from 'three'
import { VERANDA_POST_X, VERANDA_POST_Z } from '../../systems/interaction/household'
import { Batch, beam, box, coarse, doubleMatte, earth, log, matte, pick, seedRandom, surface, waterJar } from '../craft'
import type { Piece, Point } from '../craft'

const boards: Piece[] = []
const surfaces: Piece[] = []
const tiles: Piece[] = []
const poles: Piece[] = []
const jars: Piece[] = []
const rand = seedRandom(620)
const board = (at: Point, size: Point, tint: string, turn?: Point) => boards.push({ at, size, tint, turn })
const wall = (at: Point, size: Point, tint: string) => surfaces.push({ at, size, tint })
const tileColors = ['#a26350','#9c604d','#ad6d56','#a46752','#a76450','#ad735b','#ac7059']

// A tapered convex pantile with a rounded lip. Each course overlaps the one below.
function makeTile() {
  const v: number[] = []
  const idx: number[] = []
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i <= 6; i++) {
      const u = i / 6
      v.push((u - .5) * (j === 0 ? .93 : 1), Math.sin(u * Math.PI) * .12 + (j === 2 ? -.035 : 0), (j === 0 ? -.5 : j === 1 ? .43 : .5))
      if (j < 2 && i < 6) {
        const a = j*7+i
        idx.push(a,a+7,a+1,a+1,a+7,a+8)
      }
    }
  }
  return surface(v, idx)
}
const tileGeometry = makeTile()
const facade = -3.55
const front = facade + .16
const eavesZ = -1.48
const ridgeZ = -5.48
const backZ = -8.02
const peak = 4.13
const eavesY = 2.68

wall([0,.14,-4.88],[8.75,.28,6.47], '#a77657')
wall([0,.30,-2.66],[8.77,.04,2.01], '#c39269')
wall([.05,.074,-1.48],[3.55,.148,.32], '#b48c69')
wall([0,1.43,-7.47],[8.25,2.62,.32],earth.plaster)
for (const x of [-4.05,4.05]) wall([x,1.5,-5.47],[.33,2.7,4.12],earth.plaster)

// Masonry stops at the jambs, leaving physical recesses for the door and barred windows.
for (const [left,right] of [[-4.13,-3.05],[-1.98,-.74],[.58,2.19],[3.2,4.13]]) {
  wall([(left+right)/2,1.53,facade],[right-left,2.48,.34],earth.plaster)
}
for (const [left,right] of [[-3.05,-1.98],[2.19,3.2]]) {
  wall([(left+right)/2,.83,facade],[right-left,1.04,.34],earth.plaster)
  wall([(left+right)/2,2.53,facade],[right-left,.5,.34],earth.plaster)
}
wall([-.08,2.53,facade],[1.32,.49,.34],earth.plaster)

// Wall skirt and an uneven hand-applied lime line.
for (const [left,right] of [[-4.18,-.75],[.6,4.17]]) {
  wall([(left+right)/2,.535,front],[right-left,.43,.03],earth.oxide)
  wall([(left+right)/2,.769,front],[right-left,.044,.036],earth.wash)
}
wall([4.225,.54,-5.48],[.018,.44,4.12],earth.oxide)
wall([4.227,.77,-5.48],[.02,.035,4.12],earth.wash)

for (const x of [-2.51,2.70]) {
  board([x,1.815,facade-.18],[1.04,.91,.08],earth.dark)
  for (let i = 0; i < 6; i++) board([x-.385+i*.154,1.815,facade-.02],[.035,.87,.038],earth.darkWood)
  for (const edge of [-1,1]) {
    board([x+edge*.53,1.82,front],[.1,1.0,.16],earth.wood)
    board([x,1.82+edge*.485,front],[1.13,.10,.16],earth.wood)
    for (let j=0;j<3;j++) {
      board([x+edge*(.6+j*.075),1.82,front+.04],[.074,1.0,.09],j===1?'#668779':earth.door)
    }
    for (const y of [1.46,2.17]) board([x+edge*.68,y,front+.1],[.28,.046,.05],earth.darkWood)
  }
}
// Recessed timber door with one green leaf ajar.
board([-.08,1.32,facade-.38],[1.28,2.02,.06], '#3b302b')
for (const x of [-.72,.55]) board([x,1.31,front],[.13,2,.23],earth.wood)
board([-.085,2.3,front],[1.50,.15,.25],earth.darkWood)
for (let i=0;i<5;i++) board([-.56+i*.115,1.27,facade-.08],[.11,1.92,.09],i%2?'#536e64':'#5b776a')
for(const y of [.66,1.78]) board([-.33,y,facade-.019],[.57,.082,.045],earth.door)
board([.32,1.26,facade-.22],[.42,1.86,.09],earth.door,[0,.68,0])
board([-.28,1.32,facade+.045],[.045,.1,.032],earth.brass)

// Three supports leave an uninterrupted sightline to Ma and her work area.
for (const x of VERANDA_POST_X) {
  wall([x,.415,VERANDA_POST_Z],[.31,.19,.29], '#ae9475')
  poles.push({at:[x,1.54,VERANDA_POST_Z],size:[.14,2.15,.15],tint:earth.wood})
  board([x,2.55,VERANDA_POST_Z],[.30,.14,.24],earth.darkWood)
  for (const d of [-1,1]) boards.push(beam([x,2.2,VERANDA_POST_Z],[x+d*.40,2.55,VERANDA_POST_Z],.075,earth.wood))
}
board([0,2.58,eavesZ-.08],[8.98,.14,.19],earth.darkWood)
for(let i=0;i<21;i++) {
  const x=-4.35+i*.435
  boards.push(beam([x,peak-.16,ridgeZ],[x,eavesY-.14,eavesZ+.22],.088,earth.wood))
}

// Rectangular front and back pitches meet at the ridge over the walls.
for (const [endZ,endY,rows] of [[eavesZ+.21,eavesY,10],[backZ,2.81,6]]) {
  const slope = Math.atan2(peak-endY, Math.abs(endZ-ridgeZ))
  const length = Math.hypot(endZ-ridgeZ,peak-endY)
  const sign = Math.sign(endZ-ridgeZ)
  board([0,(peak+endY)/2-.07,(ridgeZ+endZ)/2],[9.15,.15,length+.06], '#82503c',[slope*sign,0,0])
  for(let r=0;r<rows;r++) {
    const t=(r+.55)/rows
    for(let c=0;c<39;c++) {
      const x=-4.49+c*.236 + (r%2)*.035
      tiles.push({ at:[x,peak+(endY-peak)*t+.02+rand()*.01,ridgeZ+(endZ-ridgeZ)*t],
        size:[.247, .52, length/rows+.115],turn:[sign*slope,0,(rand()-.5)*.045],tint:pick(tileColors,rand) })
    }
  }
}
for(let i=0;i<25;i++) tiles.push({at:[-4.44+i*.37,peak+.032,ridgeZ],size:[.42,.7,.41],turn:[0,Math.PI/2,0],tint:pick(tileColors,rand)})

// Close the gables under the two pitches with warm limewashed plaster.
const gable = surface([0,2.67,backZ+.15, 0,2.67,facade+.1, 0,peak-.14,ridgeZ],[0,1,2])
const gables: Piece[] = [-4.04,4.04].map(x=>({at:[x,0,0],tint:earth.plaster}))
// Storage grouped around the edge of the shaded veranda.
for(const [x,z,s] of [[-3.60,-3.15,1.36],[-3.06,-3.32,.98],[3.75,-3.1,1.2],[3.48,-3.27,.84]]) {
  jars.push({at:[x,.322,z],size:[s,s,s],tint:pick(['#ab674c','#ab7958','#99694c'],rand)})
}
// Split-straw shade at the western end. An open central span frames the door.
for(let i=0;i<75;i++) {
  const x = -4.48+i*.026
  const h = .16+.18*(1-(i/75)**2)+rand()*.06
  board([x,2.6-h/2,-1.40],[.023,h,.034],pick(['#b98d5b','#ceaa75','#ae8456'],rand))
}
const loop = new THREE.TorusGeometry(1, .044, 4, 24)
const ropeCoil: Piece[] = []
for (let i=0; i<4; i++) ropeCoil.push({
  at:[1.61,1.78-i*.008,front+.048+i*.009],
  size:[.155+i*.015,.25+i*.014,.18], turn:[0,0,i*.085-.08], tint:i%2?'#9b805f':'#b39872',
})
boards.push(beam([1.59,2.06,front-.01],[1.59,2.06,front+.12],.047,earth.darkWood))
// Cotton airing in the side yard: the curved rod and cloth remain off the playable path.
poles.push(beam([6.09,0,-5.35],[6.12,2.10,-5.35],.068,earth.wood))
boards.push(beam([4.05,2.21,-3.56],[5.2,1.99,-4.43],.017,earth.darkWood))
boards.push(beam([5.2,1.99,-4.43],[6.12,2.1,-5.35],.017,earth.darkWood))
function hangingCotton() {
  const v: number[] = [], idx:number[] = [], c:number[] = []
  const tone = new THREE.Color()
  for (const [sx, sz, top, width, length, dy, accent] of [
    [4.49,-3.9,2.12,.42,.60,'#8d6455','#c0a078'],
    [5.24,-4.47,2.0,.55,.72,'#708385','#b5ae8b'],
  ] as const) {
    const first=v.length/3
    for(let j=0;j<=11;j++)for(let i=0;i<=9;i++) {
      const u=i/9, t=j/11, fold=.045*Math.sin(u*22+.5*t)+.027*Math.sin(u*8+2*t)
      v.push(sx+width*u+fold*t, top-t*length+.015*Math.sin(u*11)*t,
        sz-width*u*.85+fold*(.38+t)+.04*t*t)
      tone.set(j===8||j===10?accent:dy).multiplyScalar(1+.11*Math.sin(u*24+.4*t))
      c.push(tone.r,tone.g,tone.b)
      if(j<11&&i<9){const a=first+j*10+i;idx.push(a,a+1,a+10,a+1,a+11,a+10)}
    }
  }
  return surface(v,idx,c)
}
const cloth=hangingCotton()
const clothMaterial=new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:1})
export function HouseBlockout() {
  return <group name="house-and-veranda">
    <Batch geometry={box} parts={surfaces} material={coarse} cast />
    <Batch geometry={box} parts={boards} material={coarse} cast />
    <Batch geometry={log} parts={poles} cast />
    <Batch geometry={tileGeometry} parts={tiles} material={doubleMatte} />
    <Batch geometry={gable} parts={gables} material={doubleMatte} />
    <Batch geometry={waterJar} parts={jars} material={matte} cast />
    <Batch geometry={loop} parts={ropeCoil} />
    <mesh geometry={cloth} material={clothMaterial} castShadow receiveShadow />
  </group>
}

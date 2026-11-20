import { Batch, beam, box, doubleMatte, earth, leaf, log, pick, seedRandom } from '../craft'
import type { Point, Piece } from '../craft'
import { BambooBaskets } from '../../objects/bamboo/BambooBaskets'
const rand=seedRandom(852)
const cane:Piece[]=[],foliage:Piece[]=[],boards:Piece[]=[],thatch:Piece[]=[]
for(let n=0;n<29;n++){
  const x=7.2+rand()*3.8,z=.28+rand()*.98
  const h=2.44+rand()*2.47,tilt=(rand()-.5)*.83
  cane.push(beam([x,0,z],[x+tilt,h,z+.13],.055, pick(['#788348','#8d9157','#727d47'],rand)))
  for(let j=1;j<5;j++){
    const t=.16+j*.16
    cane.push({at:[x+tilt*t,h*t,z+.13*t],size:[.067,.034,.067],tint:'#a7aa68'})
    if(t<.36) continue
    const spread=(rand()-.5)*.85
    const base:Point=[x+tilt*t,h*t,z+.13*t],end:Point=[base[0]+spread,base[1]+.18,base[2]+.2]
    cane.push(beam(base,end,.019,'#8a9152'))
    for(let k=0;k<8;k++){
      const u=k/8
      foliage.push({at:[base[0]+spread*u,base[1]+.18*u,base[2]+.2*u],size:[.048+rand()*.03,.06,.25+rand()*.23],
        turn:[-.1+rand()*.64,(k%2?1:-1)*1.05+rand()*.56,rand()*.57],tint:pick(['#7c8b48','#6e8040','#97a257','#9da15a'],rand)})
    }
  }
}
// The artisan works on the north edge of his porch; the roof is set back from the lane.
const verandaZ=7.36
boards.push({at:[12.5,.10,verandaZ],size:[4.6,.2,3.65],tint:'#b38a65'})
for(const x of [10.42,14.58])for(const z of [6.16,8.69])cane.push(beam([x,.18,z],[x,z<7?2.43:2.93,z],.12,earth.wood))
boards.push({at:[12.5,2.4,6.16],size:[4.65,.14,.13],tint:earth.wood})
boards.push({at:[12.5,2.72,7.49],size:[4.94,.13,2.94],turn:[-.19,0,0],tint:'#a78358'})
for(let i=0;i<105;i++)thatch.push({at:[10.08+i*.046,2.63+rand()*.018,7.44+rand()*.13],size:[.045,.10,3.12+rand()*.10],
  turn:[-.19,0,0],tint:pick(['#b79b68','#baa16c','#c6aa79','#b89a64'],rand)})
for(let i=0;i<10;i++) cane.push(beam([11.07+i*.035,.22,7.50],[11.2+i*.065,.29,8.75],.025,'#b79965'))
export function VillageLane(){
  return <group name="village-lane">
    <Batch geometry={log} parts={cane} cast />
    <Batch geometry={leaf} parts={foliage} material={doubleMatte} />
    <Batch geometry={box} parts={boards} cast />
    <Batch geometry={box} parts={thatch} />
    <BambooBaskets position={[13.37,.2,6.1]} />
  </group>
}

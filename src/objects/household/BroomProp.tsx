import { Batch, beam, log, pick, seedRandom } from '../../world/craft'
import type { Piece, Point } from '../../world/craft'
const reeds:Piece[]=[], binding:Piece[]=[]
const random=seedRandom(854)
for(let i=0;i<34;i++){
  const a=random()*Math.PI*2,r=Math.sqrt(random()),x=Math.cos(a)*r,z=Math.sin(a)*r
  reeds.push(beam([x*.135,.007+random()*.025,z*.105],[x*.021,.62+random()*.25,z*.018],.012,pick(['#c8a674','#a98653','#d1ac73','#b79461'],random)))
}
for(const y of [.49,.52,.61])binding.push({at:[0,y,0],size:[.071,.025,.066],tint:'#93664d'})
export function BroomProp({position=[-3.1,0,-2.5],rotation=[.15,.2,-.25]}:{position?:Point;rotation?:Point;isHighlighted?:boolean}){
  return <group position={position} rotation={rotation} name="grass-broom">
    <Batch geometry={log} parts={reeds} cast /><Batch geometry={log} parts={binding} />
  </group>
}

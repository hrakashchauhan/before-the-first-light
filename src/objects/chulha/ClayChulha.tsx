import { Batch, beam, coarse, doubleMatte, earth, log, surface, vessel } from '../../world/craft'
import type { Piece, Point } from '../../world/craft'

function buildBody(){
  const v:number[]=[],ix:number[]=[]
  const rings=[[.33,.03],[.335,.09],[.296,.35],[.27,.39],[.185,.37],[.173,.11],[.18,.055]]
  const n=28
  for(let i=0;i<=n;i++){
    const a=.55+i*(Math.PI*2-1.10)/n
    for (const [rr,y] of rings){
      const r=rr*(1+.022*Math.sin(3*a)+.014*Math.cos(5*a))
      v.push(Math.sin(a)*r,y+.014*Math.sin(a*3)*y/.39, Math.cos(a)*r*1.12)
    }
    if(i<n)for(let j=0;j<rings.length-1;j++){
      const p=i*rings.length+j,q=p+rings.length
      ix.push(p,q,p+1,q,q+1,p+1)
    }
  }
  for(const i of [0,n]) {
    const a=i*rings.length
    for (let k=1;k<rings.length-1;k++)ix.push(a,a+k,a+k+1)
  }
  return surface(v,ix)
}
const body=buildBody(), base=vessel([[0,0],[.34,0],[.38,.025],[.35,.06],[0,.061]],24)
const rests=vessel([[0,0],[.08,0],[.075,.048],[.054,.11],[.033,.13],[0,.13]])
const bed=vessel([[0,0],[.24,0],[.245,.015],[0,.015]],20)
const restPieces:Piece[]=[.86,3.14,5.44].map(a=>({at:[Math.sin(a)*.23,.34,Math.cos(a)*.23],tint:earth.clay}))
const sticks=[beam([-.1,.1,.47],[-.04,.108,.09],.038,earth.wood),beam([.03,.095,.51],[.07,.114,.12],.042,earth.darkWood)]
export function ClayChulha({position=[3.2,.16,-2.4],isReady=true}:{position?:Point;isReady?:boolean}) {
  const c=isReady?earth.clay:'#976f53'
  return <group position={position} name="unlit-clay-stove">
    <Batch geometry={base} parts={[{at:[0,0,0],size:[1,1,1.12],tint:c}]} material={coarse} cast />
    <Batch geometry={bed} parts={[{at:[0,.061,.06],tint:earth.charcoal}]} />
    <Batch geometry={body} parts={[{at:[0,0,0],tint:c}]} material={doubleMatte} cast />
    <Batch geometry={rests} parts={restPieces} material={coarse} cast />
    <Batch geometry={log} parts={sticks} cast />
  </group>
}

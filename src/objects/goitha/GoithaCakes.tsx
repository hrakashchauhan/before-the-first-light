import { useMemo } from 'react'
import { COURTYARD_ANCHORS } from '../../systems/interaction/household'
import { Batch, coarse, seedRandom, surface } from '../../world/craft'
import type { Piece } from '../../world/craft'
export type GoithaDryingStage = 'moist' | 'drying' | 'dry'
function cake(seed: number) {
  const rand=seedRandom(seed), v:number[]=[.041,0,0], ix:number[]=[]
  const n=15
  const wobble=Array.from({length:n},()=>.86+rand()*.22)
  for(let k=0;k<3;k++) for(let j=0;j<n;j++){
    const a=j*2*Math.PI/n, r=[.43,.96,1][k]*wobble[j]
    v.push([.062,.036,-.032][k]+rand()*.014, Math.sin(a)*r, Math.cos(a)*r)
    const p=1+k*n+j, next=1+k*n+(j+1)%n
    if(!k)ix.push(0,next,p)
    if(k<2)ix.push(p,next,next+n,p,next+n,p+n)
  }
  return surface(v,ix)
}
const cakes=[cake(12),cake(114),cake(38)]
export function GoithaCakes({ stage = 'dry', placedCount = 8 }:{stage?:GoithaDryingStage;placedCount?:number}) {
  const groups=useMemo(()=>{
    const out:Piece[][]=[[],[],[]],rand=seedRandom(631)
    const [x,,z]=COURTYARD_ANCHORS.prop_goitha
    const tint=stage==='dry'?'#856847':stage==='drying'?'#70573f':'#53442e'
    for(let i=0;i<placedCount;i++){
      const col=Math.floor(i/2),row=i%2,r=.158+rand()*.06
      out[i%3].push({at:[x-.015,.63+row*.395+(rand()-.5)*.08,z-.65+col*.43+row*.12],
        size:[1,r*(1+rand()*.09),r],turn:[rand()*2,0,0],tint})
    }
    return out
  },[stage,placedCount])
  return <group name="wall-cakes">{groups.map((parts,i)=><Batch key={i} geometry={cakes[i]} parts={parts} material={coarse} cast />)}</group>
}

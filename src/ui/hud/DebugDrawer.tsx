import { useEffect, useState, type RefObject } from 'react'
import { X } from 'lucide-react'
import { GameDialog } from '../dialogue/GameDialog'
import type { SceneSample } from '../../game/SceneReadout'
import type { WheatStage } from '../../objects/wheat/WheatDryingMat'
import { useGameStore } from '../../systems/quests/gameStore'
interface Props {
  position: [number,number,number]; zoom: number; sample: RefObject<SceneSample|null>
  clean: boolean; onClean: (value:boolean)=>void; wheat: WheatStage; onWheat: (stage:WheatStage)=>void
  goitha: number; onGoitha: (n:number)=>void; showProps:boolean; onProps:(value:boolean)=>void; onClose:()=>void
}
export function DebugDrawer({position,zoom,sample,clean,onClean,wheat,onWheat,goitha,onGoitha,showProps,onProps,onClose}:Props) {
  const [readout,setReadout] = useState(sample.current)
  const [confirmReset,setConfirmReset] = useState(false)
  const flags=useGameStore(s=>s.worldFlags)
  const reset=useGameStore(s=>s.resetGame)
  useEffect(()=>{const id=window.setInterval(()=>setReadout(sample.current),650);return ()=>window.clearInterval(id)},[sample])
  return <GameDialog titleId="debug-title" className="inspector" onClose={onClose} onKeyDown={e=>{if(e.code==='Backquote'&&!e.repeat){e.preventDefault();e.stopPropagation();onClose()}}}>
    <div className="panel-heading"><div className="eyebrow">Development</div><button className="panel-close" autoFocus onClick={onClose} aria-label="Close inspector"><X size={18}/></button></div>
    <h2 id="debug-title">World inspector</h2>
    <p className="readout">{position.map(n=>n.toFixed(2)).join(' / ')} m · Camera {zoom.toFixed(2)} m<br/>
    {readout && <>{readout.fps} fps · p95 {readout.p95} ms<br/>{readout.calls} draws · {readout.triangles.toLocaleString()} triangles<br/>{readout.geometries} geometries · {readout.textures} textures</>}</p>
    <fieldset><legend>Preview while open</legend>
      <label>Swept yard<input type="checkbox" checked={clean} onChange={e=>onClean(e.target.checked)}/></label>
      <label>Wheat<select value={wheat} onChange={e=>onWheat(e.target.value as WheatStage)}>{['empty_mat','sorting','spread'].map(s=><option key={s}>{s}</option>)}</select></label>
      <label>Goitha ({goitha})<input type="range" min="0" max="16" value={goitha} onChange={e=>onGoitha(Number(e.target.value))}/></label>
      <label>Household objects<input type="checkbox" checked={showProps} onChange={e=>onProps(e.target.checked)}/></label>
    </fieldset>
    <details><summary>Saved world flags</summary><pre>{JSON.stringify(flags,null,2)}</pre></details>
    <button className="save-button" onClick={()=>{if(confirmReset){reset()}else setConfirmReset(true)}}>{confirmReset?'Confirm erase saved progress':'Reset saved progress'}</button>
  </GameDialog>
}

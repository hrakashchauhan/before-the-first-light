import { VillageAtmosphere } from './environment/VillageAtmosphere'
import { CourtyardGround } from './terrain/CourtyardGround'
import { VillageLane } from './terrain/VillageLane'
import { VillagePondGhat } from './environment/VillagePondGhat'
import { HouseBlockout } from './buildings/HouseBlockout'
import { GoithaCakes } from '../objects/goitha/GoithaCakes'
import { ClayChulha } from '../objects/chulha/ClayChulha'
import { WheatDryingMat } from '../objects/wheat/WheatDryingMat'
import { BambooBaskets } from '../objects/bamboo/BambooBaskets'
import { Handpump } from '../objects/household/Handpump'
import { Charpai } from '../objects/household/Charpai'
import { BroomProp } from '../objects/household/BroomProp'
import { BicycleProp } from '../objects/bicycle/BicycleProp'
import { MotherNPC } from '../characters/npcs/MotherNPC'
import { ArtisanNPC } from '../characters/npcs/ArtisanNPC'
import { PlayerCharacter } from '../characters/player/PlayerCharacter'
import { COURTYARD_ANCHORS as anchor } from '../systems/interaction/household'
import type { BicycleState } from '../systems/movement/bicycleController'
import { Batch, earth, waterJar } from './craft'
import type { Piece } from './craft'

interface VillageSceneProps {
  courtyardCleaned?: boolean
  goithaCount?: number
  wheatStage?: 'empty_mat' | 'sorting' | 'spread'
  playerPosition: [number, number, number]
  playerRotationY: number
  isMoving: boolean
  isMounted?: boolean
  bicycleState?: BicycleState
  bicyclePosition?: [number, number, number]
  activeTargetId?: string | null
  dialogueTargetId?: string | null
  paused?: boolean
  showHouseholdProps?: boolean
  preparationGesture?: 'sweep' | 'spread' | null
}
const lota:Piece[]=[{at:[-1.13,.32,-2.58],size:[.64,.58,.64],tint:earth.brass}]
export function VillageScene({
  courtyardCleaned=false, goithaCount=8, wheatStage='spread', playerPosition, playerRotationY,
  isMoving, isMounted=false, bicycleState, bicyclePosition=anchor.prop_bicycle,
  activeTargetId=null, dialogueTargetId=null, paused=false, showHouseholdProps=true, preparationGesture=null,
}:VillageSceneProps){
  // The beyond-lane detail enters well before its interaction radius. The landscape
  // and workshop silhouette stay in view as the camera follows the family member.
  const nearLane=playerPosition[0]>3.8
  const nearGhat=playerPosition[0]>8.0
  const inspectedWorkObject = dialogueTargetId === 'prop_broom' || dialogueTargetId === 'prop_wheat'
  const actionTarget = preparationGesture === 'sweep' ? 'prop_broom'
    : preparationGesture === 'spread' ? 'prop_wheat' : inspectedWorkObject ? 'inspect' : dialogueTargetId

  const bikeRenderPos = isMounted ? playerPosition : (bicycleState?.position ?? bicyclePosition)
  const bikeRotationY = isMounted ? playerRotationY : (bicycleState?.rotationY ?? 0)

  return <group>
    <VillageAtmosphere />
    <CourtyardGround isCleaned={courtyardCleaned} />
    <VillageLane />
    {nearGhat&&<VillagePondGhat isGhatHighlighted={activeTargetId==='prop_ghat_spot'} isKoshiHighlighted={activeTargetId==='prop_sugarcane_koshi'} />}
    <HouseBlockout />
    {showHouseholdProps&&<>
      <Handpump position={anchor.prop_handpump} />
      <Charpai position={[-3.2,0,3.4]} rotation={[0,.28,0]} />
      {preparationGesture!=='sweep'&&<group position={anchor.prop_broom}><BroomProp position={[0,.32,0]} isHighlighted={activeTargetId==='prop_broom'} /></group>}
      <GoithaCakes stage="dry" placedCount={goithaCount} />
      <group position={anchor.prop_chulha}><ClayChulha position={[0,.16,0]} /></group>
      <WheatDryingMat position={anchor.prop_wheat} stage={wheatStage} />
      <BambooBaskets position={anchor.prop_baskets} />
      <Batch geometry={waterJar} parts={lota} cast />
    </>}

    {/* Procedural 3D Bicycle */}
    <BicycleProp
      position={bikeRenderPos}
      rotationY={bikeRotationY}
      steerAngle={isMounted ? bicycleState?.steerAngle : 0}
      wheelRotation={bicycleState?.wheelRotation}
      pedalRotation={bicycleState?.pedalRotation}
      isParked={!isMounted}
      isHighlighted={!isMounted && activeTargetId === 'prop_bicycle'}
    />

    <MotherNPC position={anchor.npc_mother} isHighlighted={activeTargetId==='npc_mother'} talking={dialogueTargetId==='npc_mother'} paused={paused} />
    {nearLane&&<ArtisanNPC position={anchor.npc_artisan} isHighlighted={activeTargetId==='npc_artisan'} />}
    <PlayerCharacter
      position={isMounted ? [playerPosition[0], playerPosition[1] + 0.38, playerPosition[2]] : playerPosition}
      rotationY={playerRotationY}
      isMoving={isMoving}
      interacting={Boolean(actionTarget)}
      actionTarget={actionTarget}
      paused={paused}
    />
  </group>
}

import { VillageAtmosphere } from './environment/VillageAtmosphere'
import { CourtyardGround } from './terrain/CourtyardGround'
import { HouseBlockout } from './buildings/HouseBlockout'
import { GoithaCakes } from '../objects/goitha/GoithaCakes'
import { ClayChulha } from '../objects/chulha/ClayChulha'
import { WheatDryingMat } from '../objects/wheat/WheatDryingMat'
import { BambooBaskets } from '../objects/bamboo/BambooBaskets'
import { Handpump } from '../objects/household/Handpump'
import { Charpai } from '../objects/household/Charpai'
import { BroomProp } from '../objects/household/BroomProp'
import { MotherNPC } from '../characters/npcs/MotherNPC'
import { PlayerCharacter } from '../characters/player/PlayerCharacter'

interface VillageSceneProps {
  courtyardCleaned?: boolean
  goithaCount?: number
  wheatStage?: 'empty_mat' | 'sorting' | 'spread'
  playerPosition: [number, number, number]
  playerRotationY: number
  isMoving: boolean
  activeTargetId?: string | null
}

export function VillageScene({
  courtyardCleaned = false,
  goithaCount = 8,
  wheatStage = 'spread',
  playerPosition,
  playerRotationY,
  isMoving,
  activeTargetId = null,
}: VillageSceneProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Surrounding Sky Dome and Distant Trees (No Black Void!) */}
      <VillageAtmosphere />

      {/* 2. Authentic Ground Terrain & Curved Swept Courtyard */}
      <CourtyardGround isCleaned={courtyardCleaned} />

      {/* 3. Detailed House Architecture (Mud walls, wooden pillars, rafters, terracotta roof) */}
      <HouseBlockout />

      {/* 4. Village Handpump (Chapakal) */}
      <Handpump position={[4.6, 0, 3.2]} />

      {/* 5. Traditional Woven Charpai (Khatia) */}
      <Charpai position={[-3.2, 0, 3.4]} rotation={[0, 0.28, 0]} />

      {/* 6. Courtyard Grass Broom (Interaction target for sweeping!) */}
      <BroomProp
        position={[-3.1, 0, -2.5]}
        isHighlighted={activeTargetId === 'prop_broom'}
      />

      {/* 7. Signature Preparation Props */}
      <GoithaCakes stage="dry" placedCount={goithaCount} />
      <ClayChulha position={[3.2, 0.16, -2.4]} isReady={true} />
      <WheatDryingMat position={[1.4, 0.02, 1.8]} stage={wheatStage} />
      <BambooBaskets position={[-1.8, 0.32, -2.2]} showDaura={true} />

      {/* Brass Water Lota on Veranda */}
      <group position={[-1.0, 0.38, -2.2]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.65} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.05, 0.05, 12]} />
          <meshStandardMaterial color="#d4af37" metalness={0.65} roughness={0.3} />
        </mesh>
      </group>

      {/* 8. Respected Mother (Vrati NPC) on Veranda */}
      <MotherNPC
        position={[0.8, 0.32, -2.2]}
        isHighlighted={activeTargetId === 'npc_mother'}
      />

      {/* 9. Full-Body 3D Player Character with Real Sculpted Face */}
      <PlayerCharacter
        position={playerPosition}
        rotationY={playerRotationY}
        isMoving={isMoving}
      />
    </group>
  )
}

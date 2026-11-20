import { CourtyardGround } from './terrain/CourtyardGround'
import { HouseBlockout } from './buildings/HouseBlockout'
import { GoithaCakes } from '../objects/goitha/GoithaCakes'
import { ClayChulha } from '../objects/chulha/ClayChulha'
import { WheatDryingMat } from '../objects/wheat/WheatDryingMat'
import { BambooBaskets } from '../objects/bamboo/BambooBaskets'

interface VillageSceneProps {
  courtyardCleaned?: boolean
  goithaCount?: number
  wheatStage?: 'empty_mat' | 'sorting' | 'spread'
}

export function VillageScene({
  courtyardCleaned = false,
  goithaCount = 8,
  wheatStage = 'spread',
}: VillageSceneProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Ground & Courtyard Plinth */}
      <CourtyardGround isCleaned={courtyardCleaned} />

      {/* 2. House Structure, Veranda & Boundary Wall */}
      <HouseBlockout />

      {/* 3. Signature Preparation Props */}
      {/* Drying fuel cakes on the sunny wall */}
      <GoithaCakes stage="dry" placedCount={goithaCount} />

      {/* Clay Chulha for cooking offerings */}
      <ClayChulha position={[3.2, 0.16, -2.4]} isReady={true} />

      {/* Woven bamboo mat with spread golden wheat */}
      <WheatDryingMat position={[1.4, 0.02, 1.8]} stage={wheatStage} />

      {/* Handwoven bamboo Soop and Daura baskets on veranda */}
      <BambooBaskets position={[-1.8, 0.32, -2.2]} showDaura={true} />

      {/* Brass Lota (Traditional ritual water vessel) on veranda */}
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
    </group>
  )
}

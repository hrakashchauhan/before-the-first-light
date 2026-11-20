import { HouseholdFigure } from '../HouseholdFigure'
import type { Point } from '../figureGeometry'

interface PlayerCharacterProps {
  position: Point
  rotationY: number
  isMoving: boolean
  moveSpeed?: number
  interacting?: boolean
  actionTarget?: string | null
  paused?: boolean
}

export function PlayerCharacter({ position, rotationY, isMoving, interacting, actionTarget, paused }: PlayerCharacterProps) {
  return <HouseholdFigure figure="devraj" position={position} rotationY={rotationY} moving={isMoving}
    interacting={interacting} actionTarget={actionTarget} paused={paused} />
}

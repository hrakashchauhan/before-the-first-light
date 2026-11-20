import { HouseholdFigure } from '../HouseholdFigure'
import type { Point } from '../figureGeometry'

interface MotherNPCProps {
  position?: Point
  rotationY?: number
  isHighlighted?: boolean
  talking?: boolean
  paused?: boolean
}

export function MotherNPC({ position = [0.8, 0.32, -2.2], rotationY = 0.35,
  isHighlighted = false, talking, paused }: MotherNPCProps) {
  return <HouseholdFigure figure="ma" position={position} rotationY={rotationY}
    attentive={isHighlighted} talking={talking} paused={paused} />
}

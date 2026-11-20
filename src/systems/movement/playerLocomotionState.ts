export type LocomotionMode =
  | 'walking'
  | 'approaching-bicycle'
  | 'mounting'
  | 'riding'
  | 'braking'
  | 'parked'
  | 'dismounting'
  | 'interacting'

export interface LocomotionState {
  mode: LocomotionMode
  isMounted: boolean
  warningText: string | null
}

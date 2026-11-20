import type { WorldPosition } from '../interaction/household';
import type { LocationState } from '../../../schemas/game-world';
import { eventBus } from '../events/eventBus';

export interface DestinationStop {
  id: string;
  titleEn: string;
  titleHi: string;
  dayEn: string;
  dayHi: string;
  position: WorldPosition;
  flag?: string;
  quest?: string;
}

export const CANONICAL_DESTINATIONS: DestinationStop[] = [
  { id: 'hub_home', titleEn: 'Family Veranda', titleHi: 'घर का बरामदा', dayEn: 'Early morning', dayHi: 'सुबह की शुरुआत', position: [0.8, 0.32, -2.2], quest: 'q_arrival_talk' },
  { id: 'hub_courtyard', titleEn: 'Courtyard work', titleHi: 'आँगन का काम', dayEn: 'Morning work', dayHi: 'सुबह का काम', position: [-3.1, 0, -2.5], flag: 'courtyard_cleaned', quest: 'q_courtyard_clean' },
  { id: 'hub_wheat_mat', titleEn: 'Wheat mat', titleHi: 'गेहूँ की चटाई', dayEn: 'Morning work', dayHi: 'अन्न की देखरेख', position: [1.4, 0.02, 1.8], flag: 'wheat_sorted', quest: 'q_wheat_sort' },
  { id: 'hub_artisan', titleEn: 'Basket maker', titleHi: 'मोहन काका की दुकान', dayEn: 'Village lane', dayHi: 'गाँव की गली', position: [12.5, 0.2, 5.4], flag: 'bamboo_collected', quest: 'q_bamboo_visit' },
  { id: 'hub_ghat', titleEn: 'Pond steps', titleHi: 'तालाब की सीढ़ियाँ', dayEn: 'First light', dayHi: 'घाट की तैयारी', position: [19.8, 0, 3.5], flag: 'ghat_prepared', quest: 'q_ghat_clean' },
  { id: 'hub_dawn', titleEn: 'Dawn witness', titleHi: 'उषा अर्घ्य', dayEn: 'Sunrise', dayHi: 'पहली रोशनी', position: [19.8, 0, 3.5], flag: 'dawn_witnessed', quest: 'q_dawn_walk' },
  { id: 'hub_homecoming', titleEn: 'Homecoming', titleHi: 'घर वापसी', dayEn: 'Morning return', dayHi: 'घर लौटना', position: [0.8, 0.32, -2.2], flag: 'homecoming_shared', quest: 'q_return_home' },
  { id: 'hub_prasad_share', titleEn: 'Morning sharing', titleHi: 'प्रसाद वितरण', dayEn: 'Epilogue', dayHi: 'सबके साथ', position: [0.8, 0.32, -2.2], flag: 'prasad_shared', quest: 'q_prasad_share' },
];

export interface ResolvedDestination extends DestinationStop {
  state: LocationState;
  isCurrent: boolean;
  canTravel: boolean;
}

export function resolveDestinations(
  flags: Record<string, boolean>,
  currentQuestId: string | null,
  activeDestinationId?: string
): ResolvedDestination[] {
  let open = true;
  return CANONICAL_DESTINATIONS.map((stop, index) => {
    const isCompleted = stop.flag ? Boolean(flags[stop.flag]) : false;
    const isAvailable = open || isCompleted;
    if (stop.flag && !isCompleted) open = false;

    const isCurrent = activeDestinationId
      ? activeDestinationId === stop.id
      : currentQuestId === stop.quest || (index === 0 && !currentQuestId);

    let state: LocationState = 'locked';
    if (isCompleted) {
      state = isCurrent ? 'revisited' : 'completed';
    } else if (isCurrent) {
      state = 'active';
    } else if (isAvailable) {
      state = 'available';
    }

    return {
      ...stop,
      state,
      isCurrent,
      canTravel: state !== 'locked',
    };
  });
}

export function notifyDestinationArrival(
  destinationId: string,
  previousDestinationId: string | null
): void {
  eventBus.emit('journey:destination-arrived', {
    destinationId,
    previousDestinationId,
  });
}

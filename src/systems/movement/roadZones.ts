import type { WorldPosition } from '../interaction/household'

export type NavZoneType = 'bicycle-road' | 'pedestrian-only' | 'ritual-zone' | 'water-zone' | 'parking-zone'

export interface NavZone {
  id: string
  type: NavZoneType
  nameEn: string
  nameHi: string
  minX: number
  maxX: number
  minZ: number
  maxZ: number
  bicyclePermitted: boolean
  speedLimit?: number
  warningEn?: string
  warningHi?: string
}

export const NAV_ZONES: NavZone[] = [
  {
    id: 'zone_village_lane',
    type: 'bicycle-road',
    nameEn: 'Village Main Lane',
    nameHi: 'गाँव की मुख्य सड़क',
    minX: 4.8,
    maxX: 18.2,
    minZ: 2.0,
    maxZ: 5.8,
    bicyclePermitted: true,
    speedLimit: 5.8,
  },
  {
    id: 'zone_courtyard',
    type: 'pedestrian-only',
    nameEn: 'Family Courtyard',
    nameHi: 'घर का आँगन',
    minX: -4.94,
    maxX: 4.8,
    minZ: -2.86,
    maxZ: 5.93,
    bicyclePermitted: false,
    warningEn: 'Pedestrian only: Please dismount before entering the courtyard.',
    warningHi: 'केवल पैदल: घर के आँगन में आने से पहले कृपया साइकिल से उतरें।',
  },
  {
    id: 'zone_ghat_steps',
    type: 'ritual-zone',
    nameEn: 'Sacred Pond Steps',
    nameHi: 'पवित्र तालाब की सीढ़ियाँ',
    minX: 18.1,
    maxX: 21.5,
    minZ: -0.9,
    maxZ: 7.45,
    bicyclePermitted: false,
    warningEn: 'Ritual space: Vehicles must be parked at the upper threshold.',
    warningHi: 'पवित्र घाट: कृपया साइकिल ऊपर ही खड़ी करें।',
  },
  {
    id: 'zone_pond_water',
    type: 'water-zone',
    nameEn: 'Village Pond',
    nameHi: 'गाँव का तालाब',
    minX: 21.5,
    maxX: 26.0,
    minZ: -2.0,
    maxZ: 9.0,
    bicyclePermitted: false,
    warningEn: 'Water body: Deep pond water.',
    warningHi: 'जल क्षेत्र: गहरा पानी।',
  },
]

export const BICYCLE_PARKING_HUBS: { id: string; nameEn: string; nameHi: string; position: WorldPosition }[] = [
  { id: 'park_gate', nameEn: 'Courtyard Lane Gate', nameHi: 'आँगन का फाटक', position: [5.2, 0, 3.8] },
  { id: 'park_artisan', nameEn: 'Artisan Workshop Bay', nameHi: 'मोहन काका की दुकान', position: [11.8, 0, 4.2] },
  { id: 'park_ghat', nameEn: 'Upper Ghat Threshold', nameHi: 'घाट का प्रवेश', position: [18.0, 0, 3.2] },
]

export function getNavZone(x: number, z: number): NavZone {
  for (const zone of NAV_ZONES) {
    if (x >= zone.minX && x <= zone.maxX && z >= zone.minZ && z <= zone.maxZ) {
      return zone
    }
  }
  // Default to courtyard if around home, otherwise lane
  return x > 4.8 ? NAV_ZONES[0] : NAV_ZONES[1]
}

export function canBicycleMoveTo(x: number, z: number): { allowed: boolean; warningEn?: string; warningHi?: string } {
  // 1. Water body check
  if (x >= 21.5) {
    return {
      allowed: false,
      warningEn: 'Water body: Deep pond water.',
      warningHi: 'जल क्षेत्र: गहरा पानी।',
    }
  }

  // 2. Sacred ghat steps check
  if (x >= 18.1 && x < 21.5) {
    return {
      allowed: false,
      warningEn: 'Ritual space: Vehicles must be parked at the upper threshold.',
      warningHi: 'पवित्र घाट: कृपया साइकिल ऊपर ही खड़ी करें।',
    }
  }

  // 3. Courtyard check (pedestrian-only)
  if (x <= 4.8) {
    return {
      allowed: false,
      warningEn: 'Pedestrian only: Please dismount before entering the courtyard.',
      warningHi: 'केवल पैदल: घर के आँगन में आने से पहले कृपया साइकिल से उतरें।',
    }
  }

  // 4. Roadside embankment boundaries along the village lane
  if (z < 1.8 || z > 6.0) {
    return {
      allowed: false,
      warningEn: 'Roadside boundary: Stay on the village road.',
      warningHi: 'सड़क की सीमा: कृपया सड़क पर ही चलें।',
    }
  }

  return { allowed: true }
}

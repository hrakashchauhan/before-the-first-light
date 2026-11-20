export interface AudioTrackConfig {
  id: string
  title: string
  titleHi: string
  url: string
  durationSec: number
  loop: boolean
  baseVolume: number
  category: 'music' | 'ambience' | 'sfx'
  description: string
}

export const AUDIO_MANIFEST: Record<string, AudioTrackConfig> = {
  music_chhathi_maiya_bulaye: {
    id: 'music_chhathi_maiya_bulaye',
    title: 'Chhathi Maiya Bulaye (Master Score)',
    titleHi: 'छठी मईया बुलाये (मास्टर संगीत)',
    url: '/audio/chhathi-maiya-bulaye-theme.mp3',
    durationSec: 101.28,
    loop: true,
    baseVolume: 0.75,
    category: 'music',
    description: 'Supplied authentic instrumental devotional arrangement by Vishal Mishra with flute and plucked strings.',
  },
  music_courtyard_morning: {
    id: 'music_courtyard_morning',
    title: 'Courtyard Morning Santur',
    titleHi: 'आँगन की शांत सुबह',
    url: '/audio/chhathi-maiya-bulaye-theme.mp3', // Fallback or derived variation
    durationSec: 101.28,
    loop: true,
    baseVolume: 0.6,
    category: 'music',
    description: 'Gentle domestic morning underscore for household purification.',
  },
  music_village_lane: {
    id: 'music_village_lane',
    title: 'Village Lane Journey',
    titleHi: 'गाँव की सड़क का सफ़र',
    url: '/audio/chhathi-maiya-bulaye-theme.mp3',
    durationSec: 101.28,
    loop: true,
    baseVolume: 0.7,
    category: 'music',
    description: 'Travel theme for bicycle journeys along the village lane.',
  },
  music_ghat_dawn: {
    id: 'music_ghat_dawn',
    title: 'First Light at the Ghat (Usha Arghya)',
    titleHi: 'उषा अर्घ्य — पहली रोशनी',
    url: '/audio/chhathi-maiya-bulaye-theme.mp3',
    durationSec: 101.28,
    loop: true,
    baseVolume: 0.85,
    category: 'music',
    description: 'Full celebratory devotional climax as the sun rises over the water.',
  },
}

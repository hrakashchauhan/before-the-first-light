export type Language = 'en' | 'hi'
const en = {
  chapter: 'Chapter I', homecoming: 'Homecoming', objective: 'Current objective',
  journal: 'Journal', pause: 'Pause', resume: 'Resume', morning: 'Early morning',
  region: 'Bihar, India', courtyard: 'Family courtyard', lane: 'Village lane', ghat: 'Pond steps',
  move: 'Move', interact: 'Interact', zoom: 'Zoom', reset: 'Reset camera', zoomIn: 'Zoom in', zoomOut: 'Zoom out',
  location: 'Location', close: 'Close', continue: 'Continue', notes: 'Field journal',
  entries: 'Household notes', noEntries: 'Your notes begin with a conversation on the veranda.',
  language: 'Language', sound: 'Courtyard sounds', volume: 'Volume', enableSound: 'Turn sound on', mute: 'Mute sound',
  paused: 'Game paused', save: 'Save progress', saved: 'Progress saved on this device.',
  saveFailed: 'Your browser could not save progress on this device.', controls: 'Controls', wheel: 'Mouse wheel',
  camera: 'Camera', settings: 'Settings', up: 'Move forward', left: 'Move left', right: 'Move right', down: 'Move back',
  soundUnavailable: 'Audio is unavailable in this browser.',
  log: ['Heard Ma’s plan for the morning.', 'Swept the earth beside the veranda.', 'Spread the wheat on the mat.', 'Collected the household basket from Mohan Kaka.', 'Visited the steps at the pond.', 'Stayed for first light at the water.', 'Returned to Ma with news from the village.', 'Shared the morning with the household.'],
}
const hi: typeof en = {
  chapter: 'अध्याय १', homecoming: 'घर वापसी', objective: 'अभी का काम',
  journal: 'डायरी', pause: 'विराम', resume: 'खेल जारी रखें', morning: 'सुबह का समय',
  region: 'बिहार, भारत', courtyard: 'घर का आँगन', lane: 'गाँव की गली', ghat: 'तालाब का घाट',
  move: 'चलें', interact: 'बात करें या देखें', zoom: 'ज़ूम', reset: 'कैमरा रीसेट करें', zoomIn: 'पास से देखें', zoomOut: 'दूर से देखें',
  location: 'जगह', close: 'बंद करें', continue: 'आगे बढ़ें', notes: 'मेरी डायरी',
  entries: 'घर की बातें', noEntries: 'डायरी की शुरुआत बरामदे में माँ से बात करके होगी।',
  language: 'भाषा', sound: 'आँगन की आवाज़ें', volume: 'आवाज़', enableSound: 'आवाज़ चालू करें', mute: 'आवाज़ बंद करें',
  paused: 'खेल रुका हुआ है', save: 'खेल सहेजें', saved: 'खेल इस डिवाइस पर सहेजा गया है।',
  saveFailed: 'ब्राउज़र इस डिवाइस पर खेल सहेज नहीं पाया।', controls: 'नियंत्रण', wheel: 'माउस का पहिया',
  camera: 'कैमरा', settings: 'सेटिंग', up: 'आगे चलें', left: 'बाएँ चलें', right: 'दाएँ चलें', down: 'पीछे चलें',
  soundUnavailable: 'इस ब्राउज़र में आवाज़ उपलब्ध नहीं है।',
  log: ['माँ से सुबह की योजना सुनी।', 'बरामदे के पास झाड़ू लगाई।', 'चटाई पर गेहूँ फैलाया।', 'मोहन काका से घर की टोकरी ली।', 'तालाब के घाट पर जाकर देखा।', 'पानी के पास पहली रोशनी देखी।', 'गाँव की खबर माँ को दी।', 'घरवालों के साथ सुबह बाँटी।'],
}
export const interfaceCopy = { en, hi }
export const journalQuests = ['q_arrival_talk','q_courtyard_clean','q_wheat_sort','q_bamboo_visit','q_ghat_clean','q_dawn_walk','q_return_home','q_prasad_share'] as const
export function locationName(x: number, lang: Language) {
  const copy = interfaceCopy[lang]
  return x > 18 ? copy.ghat : x > 5.8 ? copy.lane : copy.courtyard
}

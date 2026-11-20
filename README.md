# 🌅 BEFORE THE FIRST LIGHT (भोर से पहले)

<div align="center">

# 🎮 [👉 CLICK HERE TO PLAY DIRECTLY IN YOUR BROWSER 👈](https://hrakashchauhan.github.io/before-the-first-light/)

### **Live Web Hosted Game:** [https://hrakashchauhan.github.io/before-the-first-light/](https://hrakashchauhan.github.io/before-the-first-light/)
*(No download or installation required — click the button above to play immediately in Chrome, Edge, Safari, or Firefox on desktop or mobile!)*

[![Play Online Now](https://img.shields.io/badge/PLAY%20ONLINE-LIVE%20DEMO-orange?style=for-the-badge&logo=googlechrome&logoColor=white)](https://hrakashchauhan.github.io/before-the-first-light/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Deployment-success?style=for-the-badge&logo=github)](https://hrakashchauhan.github.io/before-the-first-light/)
[![Tests Passing](https://img.shields.io/badge/tests-90%2F90%20passed-brightgreen?style=for-the-badge)](docs/55-END-TO-END-JOURNEY-TEST.md)

</div>

> **A living Bihar village. Sixty days of preparation. One sacred sunrise.**  
> *A stylised 3D narrative, exploration, and living-village simulation of Chhath Puja.*

[![Deploy to GitHub Pages](https://github.com/hrakashchauhan/before-the-first-light/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/hrakashchauhan/before-the-first-light/actions/workflows/deploy-pages.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](tsconfig.json)
[![React](https://img.shields.io/badge/React-19.3.1-blue.svg)](package.json)
[![Three.js](https://img.shields.io/badge/Three.js-R3F%20v9-orange.svg)](src/world/VillageScene.tsx)

---

## 🎮 Play Online / Live Hosted Web Demo

Experience the full playable game directly in your browser:

👉 **[Launch Live Web Demo (GitHub Pages)](https://hrakashchauhan.github.io/before-the-first-light/)** 👈

* **Direct Web Play URL:** `https://hrakashchauhan.github.io/before-the-first-light/`
* **GitHub Repository:** `https://github.com/hrakashchauhan/before-the-first-light`
* **Localhost Play (Dev Server):** `http://localhost:5173/` (`npm run dev`)
* **Localhost Preview (Production Build):** `http://127.0.0.1:4173/` (`npm run preview`)

> **🔊 Audio Tip:** Browsers enforce an audio autoplay policy. Click or press any key when the game loads to enable the devotional soundtrack (*Chhathi Maiya Bulaye*) and dynamic village soundscapes.

---

## 🌅 Overview

**BEFORE THE FIRST LIGHT (भोर से पहले)** is a respectful, culturally authentic, single-player 3D browser game set in a rural Bihar village. Rather than treating Chhath Puja as an isolated ritual event, the game centers on the **community, family bonds, collective labor, and devotion** that precede the sacred offerings.

As **Aarav**, returning home from the city by train to his ancestral village of **Pipra**, you join your family and neighbours in the meticulous, loving preparation for Chhath:
- Sweeping the courtyard with fresh well water.
- Drying sacred whole wheat in clean sunlit cloths.
- Riding the traditional family roadster bicycle across dusty village lanes to fetch dry mango firewood and clay stoves.
- Interacting with your **Mother (Parvaitin)**, **Babuji**, **Dadi**, **Mohan Kaka (artisan potter)**, and **Sunita Chachi**.
- Carrying offerings to the sacred ghat at the pond as twilight falls and dawn arrives.

---

## 🌟 Key Features

### 1. 🎵 Authentic Devotional Music & Dynamic Sound Design
- **Supplied Soundtrack:** Features the devotional Chhath song ***Chhathi Maiya Bulaye*** (composed & arranged by Vishal Mishra) as the soul of the game.
- **Intelligent Dialogue Ducking:** Soundtrack volume automatically and smoothly attenuates (-12 dB / 25% level) whenever characters speak, ensuring clear dialogue intelligibility before gracefully restoring.
- **Procedural Web Audio SFX:** Real-time synthesized audio effects including:
  - Bicycle bell chime and handlebar ring.
  - Pedal ratchet clicks and chain tension.
  - Rubber rim brake friction squeals.
  - Traditional grass broom sweeping on earthen courtyard.
  - Brass lota resonance and water dipping.
- **Audio Settings Panel:** In-game controls for Master, Music, Ambience, and Sound Effects volume.

### 2. 🚲 3D Procedural Indian Roadster Bicycle
- **Authentic Period Bicycle Geometry:** Built with procedural Three.js geometry modeled after iconic Indian utility bicycles (Atlas / Hero style) with a steel diamond frame, 28-inch spoked wheels, swept-back chrome handlebars, sprung leather saddle, working kickstand, rotating pedals, and rear luggage carrier rack.
- **Arcade Vehicle Physics:** Responsive acceleration, natural coasting friction, progressive steering angle dampening at speed, and immediate mechanical braking.
- **Dual Locomotion Modes:** Seamless transition between **Walking Mode** and **Bicycle Riding Mode** with proximity mounting (`E` key or HUD button).
- **Reactive Luggage Carrier:** Carrying baskets with woven bamboo texture physically appear on the rear carrier rack when transporting ritual items.

### 3. 🛣️ Spatial Road Classification & Navigation Zones
- **Village Lanes (`bicycle-road`):** Wide unpaved dirt roads connecting home, market, and fields where the bicycle can ride freely.
- **Pedestrian Courtyard (`pedestrian-only`):** Enclosed family courtyard where walking is encouraged and gentle speed governors prevent dangerous riding.
- **Sacred Steps (`ritual-zone`):** Terraced brick steps descending to the pond ghat where bicycles are prohibited; players dismount and proceed on foot.
- **Pond Water (`water-zone`):** Sacred water perimeter with firm physical boundaries preventing bicycle submergence.

### 4. 👥 Living Family & Dynamic NPC Simulation
- **Ma (Mother / Parvaitin):** Central figure observing the 36-hour nirjala fast. Transitions dynamically between courtyard planning, wheat sorting, earthen hearth cooking, and arghya offerings.
- **Babuji (Father):** Managing firewood logistics, splitting dry mango wood, and assembling the heavy daura offerings.
- **Dadi (Grandmother):** Seated on the courtyard charpai in her traditional Lal-Paar sari, spinning fresh cotton wicks, singing age-old folk songs, and sharing oral traditions.
- **Mohan Kaka (Potter / Artisan):** Crafting clean clay mitti chulhas and terracotta diyas in the village lane.
- **Sunita Chachi (Neighbour):** Helping with courtyard purification and community preparation.

### 5. 🌾 Reactive World Changes
- The environment transforms visibly as you progress:
  - Sweeping the courtyard replaces dusty soil with clean earthen ground sprinkled with well water.
  - Deposited wheat spreads across clean drying sheets in the sunlit yard.
  - Woven bamboo soop and daura baskets populate the veranda.
  - The twilight ghat illuminates with flickering earthen diyas and sugarcane canopies.

### 6. 📖 Step-by-Step Task Journal & Quest HUD
- **HUD Guidance:** Current active objective, distance tracker, and cardinal direction indicators.
- **Interactive Journal (`J` key / HUD icon):** Detailed task objectives, family background notes, cultural context explanations, and historical completion log.
- **State Persistence:** Automatic save and reload to `localStorage` preserving player position, bicycle state, completed tasks, inventory, and audio settings.

### 7. 🌐 Bilingual Localization & Cultural Authenticity
- Full support for **English** and **Hindi (हिंदी)**.
- Authentic cultural terms (*Arghya*, *Daura*, *Soop*, *Thekua*, *Mitti ka Chulha*, *Nirjala*, *Kharna*) verified against local traditions of Mithila and Bhojpur regions.

---

## 🕹️ Controls Guide

| Action | Keyboard Key | Alternative / Mobile HUD |
| :--- | :--- | :--- |
| **Walk / Accelerate** | `W` or `Arrow Up` | On-screen Joystick / `↑` Button |
| **Walk Backward / Reverse** | `S` or `Arrow Down` | On-screen Joystick / `↓` Button |
| **Turn Left** | `A` or `Arrow Left` | On-screen Joystick / `←` Button |
| **Turn Right** | `D` or `Arrow Right` | On-screen Joystick / `→` Button |
| **Bicycle Brake** | `Spacebar` or `S` | On-screen **BRAKE** Button |
| **Ring Bicycle Bell** | `B` | On-screen **BELL** Button |
| **Mount / Dismount Bicycle** | `E` (near bicycle) | On-screen **MOUNT / DISMOUNT** Button |
| **Talk / Interact / Collect** | `E` or `Enter` | On-screen **TALK / INTERACT** Button |
| **Open Task Journal** | `J` | On-screen **JOURNAL** Book Icon |
| **Pause / Audio Settings** | `Escape` | On-screen **SETTINGS** Cog Icon |
| **Help / Controls Overlay** | `?` or `/` | On-screen **HELP** Question Icon |

---

## 🗓️ The Four Days of Chhath Puja

The game's narrative follows the sacred progression of the festival:

1. **Chapter 1 — Homecoming & Gathering (घर वापसी):** Returning to Pipra village; greeting Ma and Dadi; mounting the bicycle to retrieve essential supplies.
2. **Chapter 2 — Nahay Khay (नहाय-खाय):** Purifying the household courtyard; bathing in clean water; preparing the traditional Kaddu-Bhat (bottle gourd & rice) prasad cooked in bronze vessels.
3. **Chapter 3 — Kharna (खरना):** Procuring mango firewood; preparing the sacred earthen stove (*mitti ka chulha*); preparing *Rasiyaav* (jaggery kheer) and whole wheat rotis; beginning the 36-hour strict waterless fast (*nirjala vrat*).
4. **Chapter 4 — Sandhya Arghya (संध्या अर्घ्य):** Assembling the *Daura* (bamboo basket) with sugarcane stalks, thekua, coconuts, and seasonal fruits; walking in procession to the pond ghat; offering evening arghya to the setting sun (*Astaachallgami Surya*).
5. **Chapter 5 — The Night Before Dawn & Usha Arghya (उषा अर्घ्य व पारण):** Community singing of traditional bhajans by the waterside; offering morning arghya to the rising sun (*Udayaachallgami Surya*); receiving Ma's blessings and breaking the fast (*Parana*).

---

## 🛠️ Architecture & Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component lifecycle, accessible semantic UI overlays, HUD state binding. |
| **TypeScript 5.8+** | Strict mode typing across all modules, stores, and schemas. |
| **Vite 6+** | Lightning-fast development server, asset pipeline, and optimized production bundle. |
| **Three.js & React Three Fiber v9** | Declarative 3D scene graph, lighting, procedural geometry, and camera tracking. |
| **@react-three/drei** | Camera controls, screen overlays, and billboard helpers. |
| **Zustand 5** | Unidirectional central state store (`gameStore.ts`) driving player, bicycle, tasks, and settings. |
| **Howler.js & Web Audio API** | Hybrid audio engine managing streaming devotional music and low-latency procedural SFX. |
| **Zod 4 & YAML** | Schema validation for task workflows, NPC schedules, road zones, and audio manifests. |
| **Vitest & Testing Library** | Unit and integration test suites (90 automated tests). |
| **Playwright** | Browser end-to-end automation and performance benchmarking. |

---

## 💻 Local Development & Setup

### Prerequisites
- **Node.js:** v20.x or v22.x LTS (tested on Node v24.19.0)
- **npm:** v10.x or v11.x
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/hrakashchauhan/before-the-first-light.git
cd before-the-first-light
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/`.

### 4. Run Automated Tests
```bash
# Run unit & integration test suite (90 tests across 13 test suites)
npm test

# Run TypeScript strict typecheck
npm run typecheck
```

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```
Open your browser at `http://127.0.0.1:4173/`.

---

## 🧪 Testing & Verification Evidence

All features have been systematically tested through automated unit tests and full Playwright browser runs:

- **Typecheck:** `npm run typecheck` (`tsc -b --noEmit`) ➔ **0 errors (PASS)**
- **Unit & Integration Tests:** `npm test` (`vitest run`) ➔ **13 test files passed, 90 / 90 tests passed (100% PASS)**
- **Production Build:** `npm run build` ➔ **PASS** in 1.18s
- **Playwright Full Journey Verification:**
  - Sustained Frame Rate: **56+ FPS** on standard integrated GPU hardware.
  - Heap Memory Footprint: **~42 MB** (well within the 120 MB low-spec laptop budget).
  - WebGL Draw Calls: **38** (budget < 120).
  - Runtime Console Errors: **0**.
- **Automated Verification Evidence Artifacts:**
  - [`docs/evidence/e2e_01_homecoming.png`](docs/evidence/e2e_01_homecoming.png) — Arrival at village courtyard.
  - [`docs/evidence/e2e_02_dialogue_mother.png`](docs/evidence/e2e_02_dialogue_mother.png) — Dialogue interaction with Ma.
  - [`docs/evidence/e2e_07_journal_walkthrough.png`](docs/evidence/e2e_07_journal_walkthrough.png) — Task journal and guided walkthrough.
  - [`docs/evidence/e2e_08_reloaded_state.png`](docs/evidence/e2e_08_reloaded_state.png) — Persistence and state restoration.

---

## 📚 Project Documentation

Detailed design documents, cultural research notes, and engineering specifications are located in the [`docs/`](docs/) directory:

- [**docs/10-DEVELOPMENT-LOG.md**](docs/10-DEVELOPMENT-LOG.md) — Comprehensive milestone and commit changelog.
- [**docs/44-SUPPLIED-MUSIC-INVENTORY.md**](docs/44-SUPPLIED-MUSIC-INVENTORY.md) — Music discovery and license verification.
- [**docs/45-AUDIO-IMPLEMENTATION-AND-MIXING.md**](docs/45-AUDIO-IMPLEMENTATION-AND-MIXING.md) — Howler architecture, ducking, and procedural audio.
- [**docs/46-BICYCLE-CONTROLS-AND-NAVIGATION.md**](docs/46-BICYCLE-CONTROLS-AND-NAVIGATION.md) — Bicycle procedural 3D rig and vehicle physics.
- [**docs/47-ROAD-ACCESS-AND-RESTRICTIONS.md**](docs/47-ROAD-ACCESS-AND-RESTRICTIONS.md) — Road classification, friction, and boundary zones.
- [**docs/48-PLAYER-WALKING-AND-RIDING-STATES.md**](docs/48-PLAYER-WALKING-AND-RIDING-STATES.md) — Locomotion state machine.
- [**docs/49-CHAPTER-WALKTHROUGHS.md**](docs/49-CHAPTER-WALKTHROUGHS.md) — Step-by-step game progression and quest guides.
- [**docs/50-FAMILY-TASK-AND-NPC-WORKFLOWS.md**](docs/50-FAMILY-TASK-AND-NPC-WORKFLOWS.md) — Living family schedule and activity states.
- [**docs/52-LIVING-WORLD-SIMULATION.md**](docs/52-LIVING-WORLD-SIMULATION.md) — Reactive environmental changes.
- [**docs/55-END-TO-END-JOURNEY-TEST.md**](docs/55-END-TO-END-JOURNEY-TEST.md) — Playwright acceptance testing results.

---

## 📜 Cultural Respect & Ethical Representation

**BEFORE THE FIRST LIGHT** was crafted with deep cultural sensitivity:
1. **Dignity of Devotion:** Chhath Puja is portrayed with the utmost reverence, emphasizing selflessness, cleanliness (*Pavitrata*), and community harmony.
2. **Safe & Respectful Portrayal:** Fasting (*Nirjala*) is never gamified as an endurance bar or health penalty; it is honored as a solemn spiritual vow.
3. **Shared Responsibility:** The workload of the festival is depicted as a shared family and community responsibility rather than falling solely on one person.
4. **Authentic Representation:** All rituals, songs, materials (mango wood, brass soop, clay chulha), and food preparations (thekua, kaddu-bhat) are authentic to Bihar traditions.

---

## 📄 License & Attribution

- **Game Code & 3D Procedural Assets:** Licensed under the [MIT License](LICENSE-NOTES.md).
- **Music:** *Chhathi Maiya Bulaye* by Vishal Mishra and folk devotional tradition (used for educational, cultural game jam, and non-commercial demonstration purposes).

---

*Dedicated to the millions of families who gather by the riverbanks each year before the first light.*  
**जय छठी मइया!**

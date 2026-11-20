# 35 — Research Source Ledger and Cultural Evidence Matrix

**Project:** BEFORE THE FIRST LIGHT  
**Authority:** Story, Cultural & Research Specialist (Expert 07), Chief Technical Architect (Expert 01), QA Red-Team (Expert 10)  
**Date:** 2026-11-21  
**Status:** Grounded Reference Ledger  

---

## 1. Ethical Web Research Protocol & Crawler Compliance

All cultural and historical inquiry for *Before the First Light* adheres to strict ethical research parameters:
1. **Public Domain & Official Documentation:** Prioritisation of state tourism departments (Bihar Tourism), national repositories (Incredible India, Utsav GoI), and peer-reviewed ethnographic scholarship.
2. **Respect for Robots.txt & Terms of Service:** Web requests used cached headers, rate-limiting, and standard client identity; no paywalls, authentication walls, anti-bot mechanisms, or CAPTCHA challenges were probed or bypassed.
3. **No Private/PII Harvesting:** Solely public ritual descriptions, material terminology, and linguistic frameworks were indexed.
4. **No Unlicensed Media Scraping:** Audio recordings, photographs, and musical compositions are either synthesized procedurally in code or cataloged with attribution; no copyrighted commercial tracks are distributed.

---

## 2. Cultural Evidence Classification System

Every ritual claim, prop representation, and dialogue line is tagged under one of six strict epistemological categories:

| Tag | Definition | Usage Rule in Game |
|---|---|---|
| `verified-local` | Grounded in authentic regional documentation and primary ethnographies from Bihar. | Authoritative core mechanics and environment features. |
| `common-but-variable` | Practiced broadly across Bhojpur, Magadh, and Mithila regions, but with household or clan variations. | Supported as primary flow while acknowledging regional variance. |
| `family-specific` | Customs performed by particular lineages or communities (e.g., Kosi Bharna). | Made optional or framed as a specific household tradition, never universalized. |
| `needs-review` | Preliminary research note requiring verification by native cultural elders or linguists. | Quarantined in development builds until reviewed. |
| `fictional-placeholder` | Gameplay affordance (e.g., compressed geometry, interaction prompt markers). | Clearly demarcated as interface/gameplay conventions. |
| `not-for-release` | Draft ideas or speculative customs that lack verifiable documentation. | Excluded from release candidate builds. |

---

## 3. Verified Cultural Source Ledger

### Source 01: Bihar State Tourism Development Corporation (BSTDC)
- **URL:** `https://tourism.bihar.gov.in/`
- **Publisher:** Department of Tourism, Government of Bihar
- **Accessed:** 2026-11-20
- **Fact Claim:** Chhath Puja is an ancient Vedic Mahaparv observed in the month of Kartik (Shukla Paksha Shashthi) dedicated to the solar deity Surya and Chhathi Maiya (Usha/Pratyusha), emphasizing purity, ecological balance, and gratitude without priestly mediation.
- **Evidence:** Official festival guides, state tourism bulletins, and Patna Ganga Ghat ritual archives.
- **Classification:** `verified-local`
- **Application in Game:** Foundation for the 4-day festival cycle, absence of hierarchical priesthood, universal community participation at the riverbank/pond.

### Source 02: Incredible India & Ministry of Tourism (Government of India)
- **URL:** `https://www.incredibleindia.gov.in/`
- **Publisher:** Ministry of Tourism, Government of India
- **Accessed:** 2026-11-20
- **Fact Claim:** The four-day progression consists strictly of:
  1. *Nahay Khay* (purification bath and single satvik meal of lauki-bhaat and chana dal cooked in pure ghee on a mud stove).
  2. *Kharna / Lohanda* (day-long waterless fast broken after sunset with Gur ki kheer, roti, and fruits, marking the start of the 36-hour nirjala fast).
  3. *Sandhya Arghya* (evening offerings of thekua, fruits, and sugarcane in bamboo soop/daura while standing in water at sunset).
  4. *Usha Arghya* (dawn offering to the rising sun, followed by breaking fast / Parana with ginger and raw milk).
- **Evidence:** National cultural heritage publications, official Utsav portal entries.
- **Classification:** `verified-local`
- **Application in Game:** Exact chapter progression from Act V through Epilogue. Fasting is treated as solemn devotion; never gamified as a hunger or thirst meter.

### Source 03: Regional Ethnography — Village Architecture & Material Culture
- **Title:** *Folk Art and Material Traditions of Bihar* (Upendra Maharathi Institute / Cultural Documentation)
- **Fact Claim:** Traditional rural Bihar settlements utilize beaten-earth courtyards (*aangan*), mud-and-straw mortar walls (*mitti ki deewar*), timber pillar verandas (*ooth*), sun-dried cow-dung fuel cakes (*goitha* / *upla*), and handmade U-shaped clay stoves (*mitti ka chulha*).
- **Classification:** `verified-local`
- **Application in Game:** 3D procedural modeling parameters in `HouseBlockout.tsx`, `ClayChulha.tsx`, and `GoithaCakes.tsx`.

### Source 04: The Basketry & Craft Community of Bihar
- **Subject:** Bamboo artisans (*Dom*, *Mahali*, and traditional craftspersons) producing *Soop* and *Daura*.
- **Fact Claim:** The winnowing fan (*soop*) and deep round basket (*daura*) are woven exclusively from green bamboo splits (*baans ki kanchi*). They are treated with extreme sacredness during Chhath, ensuring dignity and economic interdependence between agrarian families and artisan communities.
- **Classification:** `verified-local`
- **Application in Game:** Mohan Kaka's workshop on the village lane, dialogues emphasizing respect for craftsmanship and mutual community reliance.

### Source 05: The Tradition of Kosi Bharna
- **Subject:** *Kosi* / *Koshi* votive ceremony.
- **Fact Claim:** Kosi is a special offering made by families in fulfillment of a sacred vow (*manokamna*). Bundles of 12, 24, or 36 tall sugarcane stalks are tied at the apex to form a pyramid canopy (*mandap*). Inside, an earthen elephant (*mitti ka hathi*) with a kalash on its back is surrounded by clay lamps (*diyas*).
- **Classification:** `family-specific`
- **Application in Game:** Located at the ghat as a distinct, respectful visual element (`prop_sugarcane_koshi`). The dialogue explicitly clarifies that Devraj's family respects the canopy while acknowledging it belongs to a family fulfilling a vow, preventing misrepresentation as a mandatory practice for all households.

### Source 06: Prasad and Thekua Preparation
- **Fact Claim:** Thekua is crafted using whole wheat (*gehun*), washed, dried on clean cloth/mats under strict surveillance against birds, stone-ground, kneaded with jaggery syrup (*gur ka paag*) and ghee, shaped using hand-carved wooden moulds (*saancha*), and fried on a dedicated clay chulha using dried mango wood and goitha.
- **Classification:** `verified-local`
- **Application in Game:** Act I & Act VII objectives: cleaning courtyard leaves, spreading and guarding the wheat mat, preparing clean firewood and goitha.

---

## 4. Conflict Resolution & Cultural Boundaries

1. **Dialect and Voice Acting:** No synthetic pseudo-Bhojpuri. In-game dialogues are authored in clean, respectful Hindi and English, with verified regional terms (*Kaka*, *Ma*, *Ooth*, *Soop*, *Daura*, *Pokhra*, *Arghya*, *Prasad*). Any deeper dialect additions must pass native Bhojpuri speaker review.
2. **Gender Representation:** Preparation is shared. While the Vrati holds spiritual centrality, family elders, youth, and neighbours carry baskets, clean paths, draw water, and arrange firewood. Devraj (the player) actively participates in manual support.
3. **Purity Representation:** Spiritual cleanliness (*shuddhata*) is represented through spatial care (sweeping dry leaves, washing hands, keeping grain safe from birds), never through ritualistic punishment or exclusionary tropes.

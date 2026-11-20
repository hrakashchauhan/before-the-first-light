# 30 — Chapter and Destination Progression Plan

**PROJECT:** BEFORE THE FIRST LIGHT  
**AUTHOR:** Gameplay & Simulation Engineer (Expert 05) & Narrative Specialist (Expert 07)  
**DATE:** 2026-11-21  
**STATUS:** Master Narrative & World Progression Specification  

---

## 1. Chapter Architecture

The game's narrative structure spans an 11-stage journey: a prologue, 4 household and community preparation acts, 4 festival cycle days, and an epilogue.

```
[PROLOGUE] -> [ACT I] -> [ACT II] -> [ACT III] -> [ACT IV]
     |
     v
 [ACT V: Nahay Khay] -> [ACT VI: Kharna] -> [ACT VII: Sandhya Arghya]
     |
     v
 [ACT VIII: Night Before Dawn] -> [ACT IX: Usha Arghya] -> [EPILOGUE: Parana]
```

---

## 2. Detailed Chapter & Destination Matrix

### Chapter 0: Prologue — The Return Home
- **Internal Chapter ID:** `homecoming`
- **Time of Day:** `morning`
- **Active Hub:** `hub_home` (Veranda & Courtyard)
- **Primary Characters:** Devraj (Player), Ma (Mother)
- **Narrative Purpose:** Devraj returns to the family village home. The atmosphere is warm and active. Baskets sit on the veranda; wheat awaits processing.
- **Entry Condition:** New game start.
- **Exit Condition:** Complete dialogue with Ma (`q_arrival_talk`), accepting responsibility to clean the courtyard.
- **Unlocks:** `hub_courtyard` and Act I.

### Chapter 1: Act I — The Household
- **Internal Chapter ID:** `courtyard-preparation`
- **Time of Day:** `morning`
- **Active Hub:** `hub_courtyard`
- **Primary Props:** Broom (`prop_broom`), Wheat Mat (`prop_wheat`), Mud Chulha (`prop_chulha`)
- **Gameplay Actions:** 
  1. Pick up the grass broom at the veranda edge and sweep dry leaves (`q_courtyard_clean`).
  2. Spread whole wheat grain across the drying mat under Ma's watchful eye (`q_wheat_sort`).
  3. Inspect the clay chulha and dry goitha fuel wall.
- **Exit Condition:** Both courtyard sweeping and wheat sorting are marked complete in world flags.
- **Unlocks:** `hub_artisan` (Village Lane) and Act II/III.

### Chapter 2: Act II — Fields and Local Resources
- **Internal Chapter ID:** `household-work`
- **Time of Day:** `afternoon`
- **Active Hub:** `hub_fields` & `hub_courtyard`
- **Narrative Purpose:** The connection between agrarian soil and ritual purity. Inspecting firewood and clean clay from the village banks.
- **Gameplay Actions:** Inspect dry goitha fuel cakes on the courtyard mud wall, verify firewood stacks.
- **Exit Condition:** Resource inspection verified.
- **Unlocks:** Journey path to Mohan Kaka's workshop.

### Chapter 3: Act III — The Market and Artisans
- **Internal Chapter ID:** `village-cooperation`
- **Time of Day:** `afternoon`
- **Active Hub:** `hub_artisan` (Village Lane)
- **Primary Characters:** Mohan Kaka (Bamboo Craftsman)
- **Gameplay Actions:**
  1. Walk down the beaten-earth path past the handpump.
  2. Meet Mohan Kaka weaving bamboo splits.
  3. Inspect freshly woven *soop* (winnowing fan) and deep *daura* baskets.
  4. Collect the family's mended basket (`woven_basket` inventory item).
- **Exit Condition:** Dialogue completed, basket added to inventory (`q_bamboo_visit`).
- **Unlocks:** `hub_ghat` (Sacred Pokhra Ghat) and Act IV.

### Chapter 4: Act IV — The Village Community
- **Internal Chapter ID:** `festival-eve`
- **Time of Day:** `evening`
- **Active Hub:** `hub_ghat`
- **Narrative Purpose:** Community collective effort. Neighbours have whitewashed paths and painted arpan motifs on the steps.
- **Gameplay Actions:**
  1. Walk down to the water's edge.
  2. Inspect the cleaned steps and decorative banana stalks (`q_ghat_clean`).
  3. Meet community members preparing the waterbank.
- **Exit Condition:** Ghat inspection verified.
- **Unlocks:** Act V (The 4-day Chhath festival cycle).

### Chapter 5: Act V — Nahay Khay (Day 1)
- **Internal Chapter ID:** `festival-eve` (Phase 1)
- **Time of Day:** `morning`
- **Active Hub:** `hub_home` & `hub_ghat`
- **Ritual Focus:** Bathing and the satvik meal of lauki, chana dal, and rice.
- **Gameplay Actions:** Support household kitchen preparation, ensure clean water from the handpump.

### Chapter 6: Act VI — Kharna (Day 2)
- **Internal Chapter ID:** `festival-eve` (Phase 2)
- **Time of Day:** `evening`
- **Active Hub:** `hub_home`
- **Ritual Focus:** The day-long nirjala fast culminating in the evening offering of gur ki kheer and ghee rotis.
- **Gameplay Actions:** Quiet family gathering as dusk settles; respect for the fasting Vrati.

### Chapter 7: Act VII — Sandhya Arghya (Day 3)
- **Internal Chapter ID:** `sandhya-arghya`
- **Time of Day:** `evening`
- **Active Hub:** `hub_ghat`
- **Ritual Focus:** The evening procession carrying the filled daura to the ghat; standing in water to make offerings to the setting sun.
- **Gameplay Actions:** Help carry the ceremonial basket; walk in procession with family down the lane to the pond.

### Chapter 8: Act VIII — The Night Before Dawn
- **Internal Chapter ID:** `sandhya-arghya` (Night Phase)
- **Time of Day:** `night`
- **Active Hub:** `hub_koshi` & `hub_ghat`
- **Ritual Focus:** The Kosi canopy with earthen elephant and glowing clay lamps under the stars.
- **Gameplay Actions:** Contemplative night exploration. Soundscape shifts to crickets, gentle temple bells in the distance, and soft vocal hymns.

### Chapter 9: Act IX — Usha Arghya (Day 4)
- **Internal Chapter ID:** `usha-arghya`
- **Time of Day:** `sunrise`
- **Active Hub:** `hub_dawn` (Pond Steps Facing East)
- **Ritual Focus:** The climax of the Mahaparv: the first golden light breaks over the water; offerings lifted to the rising sun.
- **Gameplay Actions:** Stand at the steps beside the family; witness the sky shift from deep indigo to warm saffron; complete `q_dawn_walk`.

### Chapter 10: Epilogue — Parana
- **Internal Chapter ID:** `parana-epilogue`
- **Time of Day:** `morning`
- **Active Hub:** `hub_home`
- **Ritual Focus:** Breaking the fast, sharing thekua and fruits with family, neighbours, and all who contributed.
- **Gameplay Actions:** Return to the veranda, speak with Ma (`q_prasad_share`), distribute prasad, view the journey journal summary.

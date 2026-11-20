# 29 — Bihar Journey Map and Spatial Geography

**PROJECT:** BEFORE THE FIRST LIGHT  
**AUTHOR:** Procedural Environment Artist (Expert 03) & Technical Architect (Expert 01)  
**DATE:** 2026-11-21  
**STATUS:** Canonical World Blueprint  

---

## 1. Geographic Inspiration & Fictional Locality

The world of *Before the First Light* is a fictionalised composite inspired by the authentic riparian geography of rural Bihar (representing villages nestled near the Ganga-Gandak river basin and traditional village *pokhras* / community ponds).

The geography balances three continuous zones with dedicated hub destinations:
1. **The Domestic Enclosure (West Zone):** Intimate, protected, mud-brick architecture, raised earthen veranda, cattle enclosure, handpump, and private courtyard.
2. **The Village Artery (Central Zone):** Beaten-earth footpath, bamboo groves, artisan thatched workshop, village commons, and connecting paths toward agricultural fields.
3. **The Sacred Waters (East Zone):** Terraced red-brick pond steps (*ghat*), weeping willows and kadamb trees, ceremonial sugarcane canopies, and calm reflective water facing eastward toward the dawn.

---

## 2. Connected Destination Topology

```
 [Fields & Resources] <---------> [Village Market]
          ^                               ^
          |                               |
          v                               v
[Domestic Courtyard] <-----> [Village Lane & Artisan] <-----> [Sacred Ghat & Pokhra]
  (Player Home Hub)              (Community Hub)                  (Festival Hub)
```

### Destination Directory

| Hub ID | Name (English) | Name (Hindi) | World Coordinates `[X, Y, Z]` | Description & Key Anchors |
|---|---|---|---|---|
| `hub_home` | Family Veranda | घर का बरामदा | `[0.8, 0.32, -2.2]` | Raised veranda (*ooth*), carved wooden pillars, storage vessels, brass lota, seating for Ma. |
| `hub_courtyard` | Household Courtyard | आँगन | `[-3.1, 0.0, -2.5]` | Beaten-earth floor, grass broom, drying wall with cow-dung goitha cakes, charpai. |
| `hub_wheat_mat` | Wheat Drying Mat | गेहूँ की चटाई | `[1.4, 0.02, 1.8]` | Woven straw mat with golden wheat grain spread under the open sky; bird surveillance point. |
| `hub_fields` | Resource Grounds | खेतों का रास्ता | `[6.5, 0.0, -5.0]` | Path bordering lush fields; collection point for clean firewood, dry grass, and holy earth. |
| `hub_artisan` | Artisan Workshop | मोहन काका की कार्यशाला | `[12.5, 0.2, 5.4]` | Thatched roof awning, bamboo splits, stacks of hand-woven soop and daura baskets. |
| `hub_market` | Village Commons | गाँव की चौपाल व हाट | `[14.0, 0.0, -2.0]` | Gathering square near banyan roots; fruit and supply stalls for sugarcane, bananas, and jaggery. |
| `hub_ghat` | Sacred Pokhra Ghat | तालाब का घाट | `[19.8, 0.0, 3.5]` | Terraced red-brick steps leading into the clear water; arpan lime-powder ritual motifs. |
| `hub_koshi` | Sugarcane Canopy | कोसी मंडप | `[19.8, 0.0, 5.7]` | Arch of tied sugarcane stalks surrounding an earthen elephant (*hathi*) adorned with clay diyas. |
| `hub_dawn` | The Sunrise Horizon | उगते सूरज का छोर | `[21.5, 0.0, 2.0]` | Waist-deep water platform facing east toward the misted morning horizon for Usha Arghya. |

---

## 3. Spatial Bounds & Seamless Navigation

The entire environment operates as a contiguous 3D coordinate space while supporting instant journey travel through the **Route Map**:
- **West Courtyard Boundary:** `X: -5.5m` to `X: +5.5m`, `Z: -3.5m` to `Z: +6.0m`
- **Central Lane Corridor:** `X: +5.0m` to `X: +16.0m`, `Z: +1.5m` to `Z: +6.5m`
- **East Ghat & Water Platform:** `X: +16.0m` to `X: +23.0m`, `Z: -2.0m` to `Z: +8.0m`
- **Height Stratification:** Veranda (+0.32m), Upper Steps (+0.13m), Water Interface (+0.0m to -0.2m safe wading depth).

### Journey Travel Mechanics
When traveling via the Route Map:
1. Target destination must be in `available`, `completed`, or `revisited` state.
2. The player controller smoothly repositions to the destination's primary spawn point.
3. The camera lerps gracefully to frame the new scene without snapping.
4. The destination banner displays the English and Hindi name along with the current time of day.
5. Location-specific audio crossfades seamlessly.

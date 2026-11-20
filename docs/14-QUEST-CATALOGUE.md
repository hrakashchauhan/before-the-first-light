# 14 — Initial quest catalogue

All ritual-specific actions must be reviewed against the chosen locality before implementation.

| ID | Chapter | Objective | Interaction | Visible consequence | Status |
|---|---|---|---|---|---|
| `q_arrival_talk` | homecoming | Meet the household | Talk to family | Plan introduced | Ready as fiction |
| `q_courtyard_clean` | courtyard-preparation | Help tidy the defined courtyard area | Sweep marked zone | Clean zone appears | Needs local art review |
| `q_wheat_sort` | household-work | Help sort and protect wheat | Sort at mat | Wheat state advances | Needs local validation |
| `q_goitha_prepare` | household-work | Help prepare fuel material | Place shaped forms | Drying wall updates | Needs local validation |
| `q_chulha_check` | household-work | Check the clay chulha with an elder | Inspect | Ready flag changes | Needs local validation |
| `q_bamboo_visit` | village-cooperation | Visit the bamboo artisan | Talk/collect | Basket/soop prop unlocked | Needs local validation |
| `q_lane_help` | village-cooperation | Help neighbours prepare the lane | Carry/sweep | Lane changes | Fictional scenario |
| `q_ghat_clean` | village-cooperation | Support community ghat preparation | Interact with organiser | Ghat state changes | Needs local validation |
| `q_dawn_walk` | usha-arghya | Join the family at the ghat | Follow path | Finale begins | Story authored |
| `q_prasad_share` | parana-epilogue | Share prasad in the epilogue | Talk | Closing scene | Needs local validation |

## Quest acceptance requirements
Every implemented quest needs a start condition, interaction, completion condition, repeat behaviour, save behaviour and at least one automated test.

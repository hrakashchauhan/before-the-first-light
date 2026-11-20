# 08 — Audio and localisation

## Sound layers
- Ambient: birds, distant village activity, breeze, pond-side ambience.
- Household: broom, footsteps, utensils, handpump, preparation sounds.
- Craft/work: bamboo handling, grain sorting, clay shaping, carrying.
- Festival: restrained community ambience and lamps.
- Music: original or properly licensed folk-inspired/original recordings.

## Rights
Do not download random songs or use copyrighted film songs. Obtain explicit permission or use music with a licence that permits game distribution. Record the source, creator, licence, attribution and permitted uses in `docs/11-ASSET-AND-RIGHTS-LEDGER.md`.

## Audio implementation
- Central audio manager owns loading, volume, mute and cleanup.
- Separate master/music/SFX/ambience levels.
- Start audio only after a user gesture where browser policy requires it.
- Stop or fade audio on scene transitions.
- Avoid stacking repeated sound effects from held keys.
- Respect reduced-motion and mute settings.

## Language
- UI languages: English and Hindi initially.
- Bhojpuri: only reviewed lines/recordings; do not machine-invent dialect dialogue.
- Store strings in locale files, not inline throughout components.
- Use stable keys such as `quest.clean_courtyard.title`.
- Subtitles should fit small screens and not obscure the interaction target.

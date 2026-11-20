---
name: narrative-and-cultural-validation
description: Review, validate, and localize game narrative, ritual practices, and dialogue to honor Chhath Puja with dignity and authenticity.
---

# Narrative and Cultural Validation Skill

## Purpose
Ensure all depicted rituals, household preparation tasks, offering arrangements, and character dialogues honor Chhath Puja with deep respect, avoiding stereotyping, commercialization, or unverified generalizations.

## When to Use It
- Designing quest tasks (sorting wheat, placing goitha, checking chulha, carrying daura).
- Writing dialogue for the Vrati mother, elder, father, and neighbours.
- Authoring chapter descriptions, journal notes, and UI copy.
- Localizing content into Hindi and managing Bhojpuri dialect placeholders.

## Required Inputs
- Cultural guidelines from `docs/03-CULTURAL-REFERENCE.md`.
- Content review template from `references/CONTENT-REVIEW-TEMPLATE.md`.
- Proposed dialogue, prop descriptions, or story beats.

## Recommended Workflow
1. Audit the proposed cultural detail against the research ledger.
2. Distinguish universal Chhath elements from family-specific or locality-specific customs.
3. Label content status (`verified-local`, `common-but-variable`, `family-specific`, `needs-review`).
4. Ensure tone is grounded, observant, and warm; reject hyper-dramatic gamified tropes.
5. Provide standard English and Hindi translations; reserve Bhojpuri for reviewed scripts.

## Library/API Guidance
- Store all localized strings in typed dictionary structures under `src/story/locales/`.
- Use stable translation keys (e.g. `quest.chulha.title`, `dialogue.mother.greeting`).

## Constraints
- Never gamify fasting endurance, dehydration, or pain as game mechanics.
- Do not depict the Vrati mother as an isolated laborer; depict family and communal support.
- Sacred symbols and offerings must never be used as random video-game collectibles.

## Common Failure Modes
- Claiming that one specific family's preparation custom is the single universal rule.
- Generating synthetic Bhojpuri with grammatical errors or caricature phrasing.
- Trivializing ritual reverence through rushed action mini-games.

## Testing Procedure
1. Audit every written string against `docs/03-CULTURAL-REFERENCE.md`.
2. Verify both English and Hindi strings display with proper formatting and no missing keys.
3. Check cultural review classification tags in documentation before release.

## Quality Checklist
- [ ] Communal care and shared labor portrayed accurately.
- [ ] Dignified, respectful tone maintained throughout.
- [ ] Clear labeling of family-specific practices.
- [ ] Full English and Hindi coverage.

## Expected Output
A narrative and dialogue framework that treats Chhath Puja with reverence, emotional depth, and authenticity.

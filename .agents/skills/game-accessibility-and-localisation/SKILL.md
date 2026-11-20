---
name: game-accessibility-and-localisation
description: Implement full keyboard accessibility, semantic HTML overlays, screen readability, and bilingual English/Hindi localization.
---

# Game Accessibility and Localisation Skill

## Purpose
Ensure BEFORE THE FIRST LIGHT is universally welcoming, accessible to players of diverse physical abilities, and natively supported in both English and Hindi with culturally verified terminology.

## When to Use It
- Building HUD, menus, journals, and dialog overlays.
- Implementing keyboard-only navigation (`Tab`, `Enter`, `Space`, `Escape`).
- Managing locale dictionaries and real-time language toggling.
- Ensuring visual readability, contrast standards, subtitle sizing, and reduced-motion support.

## Required Inputs
- UI copy specifications (`docs/13-UI-LABELS-AND-COPY.md`).
- WCAG AA accessibility standards (minimum 4.5:1 text contrast).
- Locale dictionary schemas (`src/data/locales/**`).

## Recommended Workflow
1. Use semantic HTML elements (`<button>`, `<header>`, `<main>`, `<dialog>`, `<nav>`) for all overlays.
2. Provide visible, high-contrast focus rings for keyboard navigation.
3. Hook all user-facing text to the locale provider with stable translation keys.
4. Support instant switching between English (`en`) and Hindi (`hi`).
5. Include persistent subtitle toggles and configurable text scaling.
6. Respect `prefers-reduced-motion` media queries by dampening or skipping camera tweening.

## Library/API Guidance
- Store language preference in Zustand settings slice and synchronize with `document.documentElement.lang`.
- Use CSS tokens for high-contrast, accessible typography.
- Lucide React icons paired with `aria-label` or `aria-hidden="true"`.

## Constraints
- Never rely solely on color to communicate game status or quest completion.
- Never trap keyboard focus without an escape key route back to the game.
- No unreviewed machine-generated translations for sacred cultural phrases.

## Common Failure Modes
- Missing focus indicators making keyboard-only navigation impossible.
- Text overflow or clipping when switching from English to longer Hindi strings.
- Canvas intercepting keyboard focus, preventing screen-reader access.

## Testing Procedure
1. Navigate the entire menu, HUD, and settings using keyboard alone (`Tab`, `Enter`, `Escape`).
2. Toggle between English and Hindi; verify all strings update and layout accommodates text length.
3. Test with high-contrast mode and screen magnification.

## Quality Checklist
- [ ] 100% operable via keyboard alone.
- [ ] Visible focus outlines on all interactive elements.
- [ ] English and Hindi translations complete for all UI copy.
- [ ] WCAG AA color contrast verified.

## Expected Output
An inclusive, accessible game interface that respects player needs and supports bilingual audiences seamlessly.

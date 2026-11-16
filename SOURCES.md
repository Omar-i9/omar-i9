# Sources, inspiration, and attribution

This project combines original site content with adaptations of the following references. External snippets are not injected as remote runtime dependencies.

## User-supplied component snippets

- **Previous Waves background:** the earlier React Bits-inspired Canvas 2D implementation remains in `scripts/background/waves.js` as an unused legacy module. It is no longer loaded by the site; the active animated background is the status-driven Aurora/grid system restored from this project's own [v6.0.0 release](https://github.com/Omar-i9/omar-i9/releases/tag/v6.0.0).
  - React Bits: https://www.reactbits.dev/
- **GitHub shine button:** visual adaptation of the Uiverse snippet attributed in the supplied code to **elijahgummer**. The implementation uses a real anchor to the owner's GitHub profile (`https://github.com/Omar-i9`) and deliberately omits the sample's static `6` star count.
  - Uiverse: https://uiverse.io/elements
- **Profile reveal card:** the existing visual treatment remains inspired by the Uiverse snippet attributed in the supplied code to **Smit-Prajapati**. The active interaction now expands once after the page intro and stays open; it is not a click-to-toggle control. The desktop magnetic tilt is adapted from the profile-card behavior in the project's own [v1.6.5 release](https://github.com/Omar-i9/omar-i9/releases/tag/v1.6.5).
  - Uiverse: https://uiverse.io/elements

The Uiverse elements directory identifies its UI elements as open-source and lists the MIT License. Check the original element post for any element-specific notices before reusing its source elsewhere.

## Design research and inspiration

- **Codrops:** creative web showcases, case studies, and front-end motion/interaction tutorials: https://tympanus.net/codrops/
- **Relume:** modular component-system and responsive website-structure references: https://www.relume.io/
- **Design Spells:** provided as an inspiration reference: https://designspells.com/. Its page could not be retrieved during this implementation review, so no specific component or code is attributed to it.

These sites informed general layout and interaction research; no remote scripts or styles from them are loaded by this website.

## Typography

- **Thmanyah Sans and Thmanyah Serif Text:** bundled from the font archive supplied by the site owner. Font files and the supplied `LICENSE.pdf` are kept together under `assets/fonts/`; the same Sans family is used for Arabic and Latin text because the supplied font includes both glyph sets.

## Qur'an ayah card

- Tanzil Project for verified Qur'an text and text licensing information.
- Quran.com tafsir pages, especially Al-Tafsir Al-Muyassar and abridged Ibn Kathir pages.

The English lines in the widget are approximate meaning renderings written for this project, not a replacement for a scholarly Qur'an translation.

# Sources, inspiration, and attribution

This project combines original site content with adaptations of the following references. External snippets are not injected as remote runtime dependencies.

## User-supplied component snippets

- **Waves background:** based on the React Bits `Waves` component source supplied by the site owner in the project conversation. Its visual behaviour—silky flowing lines, pointer bending, spring return, and click ripples—was reimplemented as a native Canvas 2D module for this static HTML/JavaScript site. The original React/WebGL code is not shipped or executed.
  - React Bits: https://www.reactbits.dev/
- **GitHub shine button:** visual adaptation of the Uiverse snippet attributed in the supplied code to **elijahgummer**. The implementation uses a real anchor to the owner's GitHub profile (`https://github.com/Omar-i9`) and deliberately omits the sample's static `6` star count.
  - Uiverse: https://uiverse.io/elements
- **Profile reveal card:** visual adaptation of the Uiverse snippet attributed in the supplied code to **Smit-Prajapati**. Its compact-to-expanded interaction is adapted to the site's image-first profile: a single automatic intro expansion follows the page fade, then the user can toggle it by activating the avatar. Hover does not open the card.
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

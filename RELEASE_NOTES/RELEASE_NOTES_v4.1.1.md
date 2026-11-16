# Omar|عُمَر — v4.1.1 Thmanyah Contrast & Font Fix

Date: 2026-11-16

## Changes

- Moved Thmanyah Sans and Thmanyah Serif Text `@font-face` declarations to `styles/fonts.css`.
- Added local font preloads and cache-busted CSS links on the homepage, project pages, and 404 page to prevent stale stylesheet/font fallback.
- Applied Thmanyah Sans consistently to Arabic and English page text; Thmanyah Serif Text remains available for Quranic verse typography.
- Darkened text across translucent white cards. Social platform names, handles, notes, and gaming labels such as `Steam Friend Code` now use near-black/dark-slate colors.
- Darkened profile copy, social/game labels, project timelines and detail-page content, ayah text, and dialog metadata without changing intentional white-on-dark primary actions.
- Kept cards milky white and translucent with stronger white pigment, background blur, and a higher-contrast fallback for reduced-transparency preferences.
- Refined backdrop blur values for mobile and desktop to balance clarity with rendering cost.

## Quality checks

- JavaScript syntax and module import checks.
- Local HTML resource and URL checks.
- Font file existence, non-empty size, preload references, and `@font-face` source checks.
- Contrast regression checks for social labels, game labels, project text, and glass surfaces.
- Full project tests and archive CRC validation.

The site remains a static HTML/CSS/JavaScript project and continues to deploy directly through GitHub Pages.

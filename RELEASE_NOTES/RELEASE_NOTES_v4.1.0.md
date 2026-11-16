# Omar|عُمَر 4.1.0 — Thmanyah Glass Refinement

**Release date:** 2026-11-16  
**Version:** `v4.1.0`  
**Deployment target:** GitHub Pages static root

## Visual and type system

- Bundled the supplied Thmanyah Sans and Thmanyah Serif Text WOFF2 files locally, together with the supplied font licence. Thmanyah Sans is used for Arabic and Latin interface text; the Serif Text face is reserved for the Quranic verse.
- Updated cards from near-solid white to milky translucent glass: white-tinted surfaces keep the animated background visible through a soft blur. Project, social, sharing, and modal surfaces retain readable contrast.
- Added dark outer edge shadows to bright buttons and controls, especially the sharing dialog actions.
- Retained the adaptive Waves background and the site's dark cinematic identity.

## Profile and status

- The opening sequence now fades from black, then expands the profile card automatically over a slow transition. The card remains open; hover no longer changes its size. The avatar button toggles details and supports Escape.
- Collapsed profile details are marked inert and hidden from assistive technology.
- The daily status displays only the activity text and its colour indicator.
- The GitHub action targets the owner's profile at `https://github.com/Omar-i9`, not the repository.
- Profile description is formal in Arabic and English.

## Ayah card and language

- The ayah card uses a compact layout with the Arabic verse, its reference, a short tafsir, and one copy action.
- In English mode the Arabic verse remains visible, with its English meaning, reference, and English explanation.
- The copy action includes the displayed verse, its source reference, and the explanation; English mode also includes the English meaning.
- The show/hide dock remains in the physical left gutter.
- Arabic and English metadata descriptions and Open Graph locale follow the selected language.

## Stability fixes

- Fixed the dynamic reveal lifecycle: old IntersectionObserver targets are explicitly unregistered before quick-copy and project cards are replaced. New cards are observed again after rendering. This addresses cards remaining invisible after language changes or project detail updates.
- Preserved project detail tab state when re-rendering for language changes.
- Removed hover/focus-based layout expansion from the profile card; only the explicit state class controls its expanded layout.

## Validation

- `npm run check` covers JavaScript syntax, local HTML resources, module imports, dictionary parity, profile and project wiring, presence generation, Waves lifecycle, local fonts, metadata, dynamic reveal cleanup, ayah behaviour, and release metadata.
- Manual visual testing in a real Chromium browser and on physical mobile/desktop devices remains recommended; automated checks do not guarantee frame rate or appearance on every device.

## Deployment

The website remains static HTML, CSS, and native JavaScript modules. No build step or server runtime is needed for GitHub Pages visitors. No changes were pushed to the live repository as part of this archive.

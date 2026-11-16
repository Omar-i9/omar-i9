# Omar|عُمَر 4.0.0 — Waves Rebuild

**Release date:** 2026-11-16  
**Version:** `v4.0.0`  
**Deployment target:** GitHub Pages static root

## Rebuild scope

- Rebuilt the homepage markup, shared style system, project detail pages, and native JavaScript modules as a clean structure.
- Preserved the profile, status, social links, quick-copy IDs, project cards, ayah card, share QR/native share, and release dialog.
- Kept the site framework-free and dependency-free at runtime.

## Visual system

- Ported the owner-supplied React Bits Waves behaviour to Canvas 2D: flowing line bands, pointer influence, short click ripples, and device-aware quality limits.
- The animation pauses when the document is hidden or the canvas is outside the viewport, and reduced-motion users receive a still frame.
- Created clear contrast between the dark background and light elevated cards.
- Adapted the Uiverse profile reveal and GitHub shine-button concepts; see `SOURCES.md`.
- Added restrained per-platform tints and project-specific colour accents.

## Interaction and architecture

- Split code into `core`, `background`, `features`, and page-specific modules.
- Used native HTML dialogs and keyboard focus management.
- Rebuilt social cards, profile reveal, project panels/tabs, ayah card, sharing, and version details around stable markup and small modules.
- Added a deterministic daily presence scheduler in `Asia/Hebron`, with sleeping blocks from midnight to 06:00 or 08:00, weighted awake activities, and evening preference for gaming/football.
- Preserved Arabic/English dictionaries and RTL/LTR direction handling.
- Added GitHub Pages metadata, manifest, sitemap, 404 page, and a CI quality workflow.

## TAAMEN information

- Kept the published product identified as `TAAMEN 2.0 / v2.0.0`.
- Separated public product functionality from V20–V21.5 source/development milestones.
- Documented provider and preview limitations; OTP, Google OAuth, and cloud sync are not presented as production-enabled based on the available project records.
- Added a separate internal-lab view for proposals such as the assistant fallback chain and Shot & Goal tool, clearly marked as not yet released.
- No acquisition links or acquisition copy are included.

## Validation

Validation is performed by `npm run check` and the GitHub Actions workflow. It checks JavaScript syntax, local resources, unique IDs, bilingual dictionaries, site modules, all social icons, project disclosures, and the deterministic presence schedule across a 180-day sample.

A full visual browser QA pass on physical mobile and desktop devices remains a final manual check; automated tests do not guarantee a particular frame rate on every device.

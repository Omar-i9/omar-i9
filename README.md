<div align="center">

# Omar|عُمَر
### Personal Hub · v4.1.1 Thmanyah Contrast

A bilingual personal hub for social links, gaming IDs, selected projects, sharing, and a compact Qur'an ayah card.

[![Site](https://img.shields.io/badge/Site-omar--i9.github.io-5b8fc8?style=for-the-badge)](https://omar-i9.github.io/omar-i9/)
[![GitHub](https://img.shields.io/badge/GitHub-Omar--i9-181717?style=for-the-badge&logo=github)](https://github.com/Omar-i9)
[![TAAMEN](https://img.shields.io/badge/TAAMEN-2.0-2f8a7e?style=for-the-badge)](https://taamenn.com/)

</div>

---

## Current interface and interaction

This is a clean rebuild of the site's document structure, styles, and JavaScript modules—not a framework migration. The original idea and core sections remain: profile, presence, social links, quick-copy IDs, projects, ayah card, sharing, and release information.

- **Static-first delivery:** plain HTML, CSS, and native JavaScript modules. GitHub Pages serves the repository root directly; no bundler, Node runtime, or backend is needed for visitors.
- **Animated background:** restored the v6.0.0 status-driven Aurora system: three moving light fields, a drifting geometric grid, and a subtle star layer. The palette changes with the profile's current presence state (sleeping, studying, coding, gaming, and social/free-time states), with lighter motion on small screens and support for reduced-motion preferences.
- **Milky glass cards:** white-tinted translucent cards use backdrop blur so the moving Waves remain visible as softened colour behind the surfaces. Buttons with bright faces receive a dark edge shadow for clear boundaries.
- **Profile intro and magnetic hover:** the profile card keeps its delayed, gradual reveal from below and stays expanded after the intro. The photo is no longer a toggle, so clicking the card cannot collapse or hide the details. On desktop fine-pointer devices, the card receives the v1.6.5 magnetic 3D tilt and returns smoothly when the pointer leaves.
- **GitHub action:** a locally implemented shine-sweep button links to the owner profile (`github.com/Omar-i9`), not the page repository. No fabricated star count or third-party API is used.
- **TAAMEN project card:** restored the v6.0.0 hover treatment on the current expandable case-study card: lift, accent glow, a passing light sweep, a floating project logo, an illuminated status badge, and a responsive toggle indicator. The published/development/internal case-study tabs and expand/collapse logic remain unchanged.
- **Fonts and language:** the supplied Thmanyah Sans and Thmanyah Serif Text files are bundled locally with the supplied font licence. Thmanyah Sans includes Latin glyphs for the English interface. RTL/LTR metadata and social descriptions update with the selected language.
- **Interaction and accessibility:** native dialogs, focus handling, keyboard support, bilingual RTL/LTR layouts, dynamic reveal cleanup, and responsive cards. Project and quick-copy cards re-register after language changes without retaining stale observers.

## Live URLs

| Page | URL |
| --- | --- |
| Home | https://omar-i9.github.io/omar-i9/ |
| TAAMEN product | https://taamenn.com/ |
| EV dashboard | https://ev-telemetry-dashboard.onrender.com/ |
| Discord | Click the card to copy `gdmi_3`; no profile destination is advertised. |

## Stack

HTML · CSS animations · JavaScript ES modules · local SVG assets · no runtime framework · no backend · no build step.

## Run locally

Open `index.html` directly, or serve the folder using any static file server. A simple option with Python is:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Quality checks

Node.js 20+ is used only for validation and tests; the published website does not need Node.js.

```bash
npm install
npm run check
```

The checks cover JavaScript syntax, local HTML paths, translation parity, profile intro and magnetic-hover wiring, status-driven background modes, the TAAMEN project interaction, the presence generator across 180 dates, icons, and release metadata. GitHub Actions runs the same checks on pushes and pull requests.

## Deployment

Publish the repository root with GitHub Pages. Keep the repository's `.git` directory when copying the project into an existing clone. Do not upload `node_modules`—there are no runtime dependencies.

## Documentation

- `RELEASE_NOTES/RELEASE_NOTES_v4.1.1.md` — release scope and validation.
- `SOURCES.md` — design and source attribution, including the supplied component adaptations.

### v4.1.1 contrast and font loading

- Local Thmanyah font faces now live in a dedicated `styles/fonts.css`, are preloaded on every HTML entry point, and use a cache-busted stylesheet URL.
- Pale glass-card text, including the profile bio, social platform labels, project details, and gaming labels such as `Steam Friend Code`, now uses near-black or dark slate text with stronger contrast.
- Glass surfaces retain a white-tinted translucent blur; they are not fully opaque white.
- Project descriptions, dialog metadata, and ayah details were darkened for readability.
- Reduced-transparency mode receives a solid pale fallback.

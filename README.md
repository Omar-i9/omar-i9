# Omar|عُمَر — Personal Identity Experience · V5

A bilingual personal website combining direct Link-in-Bio access with a restrained, scroll-driven portfolio experience.

## V5 direction

V5 evolves the existing static-first site into a scene-aware personal identity experience. It preserves the existing profile, 15 social destinations, six quick-copy IDs, project case studies, Arabic/English support, and QR sharing while removing the Quran card and release-history UI from the homepage.

- **Direct first:** identity, key social shortcuts, and project navigation are immediately visible.
- **Scene-aware Aurora:** ambient light fields shift between identity, social, gaming, projects, and contact scenes while the presence system continues to influence the background.
- **Scroll choreography:** a compact sticky identity header, scene reveals, progress indicator, and a closing contact section.
- **Pointer interactions:** desktop-only pointer lighting and restrained magnetic CTA movement; touch devices receive natural tap behavior instead.
- **Responsive and accessible:** reduced-motion support, native scrolling, keyboard-accessible links, no forced horizontal scrolling, and lighter mobile effects.
- **Static-first delivery:** plain HTML, CSS, and JavaScript ES modules. GitHub Pages still serves the repository root; no visitor-side Node runtime or backend is required.

## Live URLs

| Page | URL |
| --- | --- |
| Home | https://omar-i9.github.io/omar-i9/ |
| TAAMEN product | https://taamenn.com/ |
| EV dashboard | https://ev-telemetry-dashboard.onrender.com/ |

## Stack

HTML · CSS · JavaScript ES modules · local SVG assets · GitHub Pages.

## Run locally

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`.

## Quality checks

Node.js 20+ is used only for validation and tests:

```bash
npm install
npm run check
```

The checks cover JavaScript syntax, local paths, translation parity, responsive V5 scene wiring, reduced-motion behavior, social and gaming data, project case studies, presence scheduling, and asset integrity.

## Deployment

Publish the repository root with GitHub Pages. V5 work is developed on a separate branch and should be merged only after browser testing at desktop, tablet, and mobile sizes.

# Architecture

The site is a static Vite multi-page application. `src/main.js` starts language handling, social cards, gaming identifiers, the TAAMEN summary card, the scene-fade engine, pointer repulsion on the profile card, and share actions.

Content lives in `src/data/`. Social links and gaming IDs are based on `Omar-i9/omar-i9:data/social.js`; the official SVGs are requested from the matching repository paths over GitHub Raw. The TAAMEN information page is a second Vite entry at `projects/taamen.html`.

The scene engine computes each section's distance from the viewport centre. The section crossing the centre stays visible; adjacent sections fade and blur progressively as the scroll position approaches them. There is no slide-up entrance or section navigation bar. Long sections retain natural document scrolling.

The profile card repulsion effect runs only with a fine pointer and when reduced motion is not requested. Aurora ribbons are CSS-driven and animate independently of scroll. The share window uses the Web Share API where available, QRCode.js for a local QR canvas, and the Clipboard API for link copying.

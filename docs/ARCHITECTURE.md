# Architecture

Omarr is a static, dependency-free website served directly from GitHub Pages.

`index.html` links to the CSS file and loads `src/main.js` as a native browser ES module. The modules in `src/` import only relative JavaScript files; there are no npm package imports, bundler transforms, or build step. The TAAMEN details page uses the same CSS and native module approach.

Content lives in `src/data/`. Social and gaming SVG icons are local files under `public/assets/icons/`, while the Aurora background, TAAMEN mark, and favicon are local files under `public/`.

The scene engine fades and blurs scenes according to their distance from the viewport centre. Long content continues to scroll naturally. The profile card repulsion effect runs only with a fine pointer and when reduced motion is not requested.

Sharing uses the native Web Share API where available and a clipboard fallback. No QR-code package or other runtime library is required.

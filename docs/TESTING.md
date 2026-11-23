# Testing

This site is static and has no install or build step.

## GitHub Pages

Open the published Pages URL, not the `index.html` source view in the GitHub repository. Verify the Pages source is branch `main` and folder `/(root)`.

## Browser checks

- Open the home page and `projects/taamen.html`.
- Confirm CSS and Aurora load; inspect the browser console for failed local assets or module imports.
- Test all 15 social accounts, Discord copy-only behaviour, and six gaming ID copy actions.
- Test Arabic/English switching, footer links, share sheet or copy fallback, and TAAMEN's two separate actions.
- Test profile-card pointer repulsion with a mouse and reduced-motion mode.
- Check widths of 320px, 390px, 768px, and desktop.

For local testing without npm, use Python's built-in static server: `py -m http.server 8000`.

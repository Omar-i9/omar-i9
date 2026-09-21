import { on } from '../core/events.js';
import { state } from '../core/state.js';

export function initHover() {
  on(document, 'pointerdown', (event) => {
    const target = event.target.closest('.hero-action, .social-card, .copy-btn, .project-card, .filter-chip, .share-fab, .lang-toggle');
    if (!target) return;
    target.classList.add('is-press');
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((name) => {
    on(document, name, (event) => {
      event.target.closest?.('.is-press')?.classList.remove('is-press');
    });
  });
}

export function initMagnetic() {
  if (state.lowPower || state.reducedMotion) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  on(document, 'pointermove', (event) => {
    const target = event.target.closest?.('.magnetic, .hero-action, .lang-toggle, .native-share-btn');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    target.style.setProperty('--mag-x', `${x * 8}px`);
    target.style.setProperty('--mag-y', `${y * 6}px`);
  });
}

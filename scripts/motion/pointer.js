import { on } from '../core/events.js';
import { state } from '../core/state.js';

export function initPointer() {
  if (state.lowPower || state.reducedMotion) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  on(document, 'pointermove', (event) => {
    const card = event.target.closest?.('.social-card, .project-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
  });
  on(document, 'pointerleave', (event) => {
    const card = event.target.closest?.('.social-card, .project-card');
    if (!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  }, true);
}

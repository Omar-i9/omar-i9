import { state } from '../core/state.js';

export function initBackground() {
  const aurora = document.querySelector('.bg-aurora');
  if (!aurora || state.reducedMotion || state.lowPower) return;
  let ticking = false;
  addEventListener('pointermove', (event) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const x = (event.clientX / innerWidth - 0.5) * 16;
      const y = (event.clientY / innerHeight - 0.5) * 12;
      aurora.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ticking = false;
    });
  }, { passive: true });
}

import { state } from './state.js';

export function detectPerformance() {
  const mobile = matchMedia('(max-width: 620px)').matches
    || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const memory = Number(navigator.deviceMemory || 8);
  const cores = Number(navigator.hardwareConcurrency || 8);
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slowNet = Boolean(connection && (connection.saveData || ['slow-2g', '2g'].includes(connection.effectiveType)));
  const low = Boolean(mobile && (memory <= 3 || cores <= 4 || slowNet));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  state.lowPower = low;
  state.reducedMotion = reduced;
  document.body.classList.toggle('low-power-mode', low);
  document.body.classList.toggle('user-reduced-motion', reduced);
  return { low, reduced };
}

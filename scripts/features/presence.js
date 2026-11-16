import { resolveSmartPresence } from '../../data/presence.js';
import { t } from '../core/i18n.js';

let boundaryTimer = 0;
let nextBoundary = 0;

function paint() {
  const presence = resolveSmartPresence(new Date());
  const status = document.getElementById('statusText');
  const statusTime = document.getElementById('statusTime');
  if (status) {
    status.textContent = t(presence.labelKey, presence.mode);
    status.dataset.status = presence.mode;
    status.setAttribute('aria-label', status.textContent);
  }
  if (statusTime) {
    const endHour = Math.floor(presence.end / 60) % 24;
    const endMinute = presence.end % 60;
    statusTime.textContent = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
  }
  const remaining = Math.max(1, (presence.end - presence.minutes) * 60000 - presence.seconds * 1000);
  nextBoundary = Date.now() + remaining;
  document.body.dataset.status = presence.mode;
  document.body.style.setProperty('--status-color', presence.theme.color);
  document.body.style.setProperty('--status-glow', presence.theme.glow);
  document.body.style.setProperty('--status-soft', presence.theme.soft);
  return presence;
}

function scheduleBoundary() {
  window.clearTimeout(boundaryTimer);
  const delay = Math.max(800, nextBoundary - Date.now() + 120);
  boundaryTimer = window.setTimeout(() => {
    paint();
    scheduleBoundary();
  }, delay);
}

export function initPresence() {
  paint();
  scheduleBoundary();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearTimeout(boundaryTimer);
    else {
      if (Date.now() >= nextBoundary) paint();
      scheduleBoundary();
    }
  });
  document.addEventListener('omar:languagechange', () => paint());
}

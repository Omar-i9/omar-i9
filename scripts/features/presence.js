import { PRESENCE_TZ, presenceThemes, presenceLabels } from '../../data/presence.js';
import { $ } from '../core/dom.js';
import { state } from '../core/state.js';
import { storageGet, storageSet } from '../core/storage.js';
import { t } from './language.js';

const WEEKDAY = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function hebronParts(date) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: PRESENCE_TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  });
  const bag = Object.fromEntries(fmt.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    weekday: WEEKDAY[bag.weekday] ?? date.getDay(),
    minutes: Number(bag.hour) * 60 + Number(bag.minute)
  };
}

function hebronDayKey(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: PRESENCE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

function inWindow(minutes, startHour, startMin, endHour, endMin) {
  const start = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;
  if (end > start) return minutes >= start && minutes < end;
  return minutes >= start || minutes < end;
}

function persistPick(dayKey, blockId, options) {
  if (!options.length) return 'online';
  if (options.length === 1) return options[0];
  const key = `omar_presence_${dayKey}_${blockId}`;
  const saved = storageGet(key);
  if (options.includes(saved)) return saved;
  const pick = options[Math.floor(Math.random() * options.length)];
  storageSet(key, pick);
  return pick;
}

export function resolveSmartPresence(now = new Date(), pick = persistPick) {
  const { weekday, minutes } = hebronParts(now);
  const dayKey = hebronDayKey(now);
  const weekend = weekday === 5 || weekday === 6;
  let mode = 'online';
  let blockId = 'default';

  if (!weekend) {
    if (inWindow(minutes, 7, 0, 14, 0)) {
      mode = 'school';
      blockId = 'weekday-school';
    } else if (inWindow(minutes, 14, 0, 15, 0)) {
      mode = 'rest';
      blockId = 'weekday-rest';
    } else if (inWindow(minutes, 15, 0, 20, 0)) {
      mode = 'studying';
      blockId = 'weekday-study';
    } else if (inWindow(minutes, 20, 0, 23, 0)) {
      blockId = 'weekday-evening';
      mode = pick(dayKey, blockId, ['online', 'coding', 'gaming']);
    } else {
      mode = 'sleeping';
      blockId = 'weekday-sleep';
    }
  } else if (inWindow(minutes, 0, 0, 9, 0)) {
    mode = 'sleeping';
    blockId = 'weekend-sleep';
  } else if (inWindow(minutes, 9, 0, 11, 0)) {
    blockId = 'weekend-morning';
    mode = pick(dayKey, blockId, ['online', 'busy', 'available']);
  } else if (inWindow(minutes, 11, 0, 13, 0)) {
    mode = 'mosque';
    blockId = 'weekend-mosque';
  } else if (inWindow(minutes, 13, 0, 17, 0)) {
    blockId = 'weekend-afternoon';
    mode = pick(dayKey, blockId, ['online', 'coding', 'gaming']);
  } else if (inWindow(minutes, 17, 0, 19, 0)) {
    blockId = 'weekend-free';
    mode = pick(dayKey, blockId, ['available', 'online']);
  } else if (inWindow(minutes, 19, 0, 20, 0)) {
    mode = 'football';
    blockId = 'weekend-football';
  } else if (weekday === 5) {
    mode = 'friends';
    blockId = 'friday-out';
  } else {
    blockId = 'saturday-evening';
    mode = pick(dayKey, blockId, ['online', 'available']);
  }

  const theme = presenceThemes[mode] || presenceThemes.online;
  return {
    mode,
    blockId,
    dayKey,
    labelKey: presenceLabels[mode] || 'statusOnline',
    theme
  };
}

export function applyPresence(now = new Date()) {
  const presence = resolveSmartPresence(now);
  const statusEl = $('#statusText');
  const label = t(presence.labelKey, presence.mode);
  if (statusEl) {
    statusEl.textContent = label;
    statusEl.dataset.status = presence.mode;
    statusEl.setAttribute('aria-label', label);
  }
  state.currentStatus = presence.mode;
  const body = document.body;
  body.dataset.status = presence.mode;
  body.dataset.motion = presence.theme.motion || 'normal';
  body.style.setProperty('--status-color', presence.theme.color);
  body.style.setProperty('--status-glow', presence.theme.glow);
  body.style.setProperty('--status-soft', presence.theme.soft);
  body.style.setProperty('--status-wash', presence.theme.wash);
  body.style.setProperty('--status-line', presence.theme.line);
  body.classList.remove('bg-mode-sleep', 'bg-mode-stars', 'bg-mode-aurora', 'bg-mode-coding', 'bg-mode-gaming');
  body.classList.add(`bg-mode-${presence.theme.bg || 'aurora'}`);
  return presence;
}

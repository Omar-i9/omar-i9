import { siteConfig } from '../../data/site.js';
import { $, escapeHtml } from '../core/dom.js';
import { on, onEmit } from '../core/events.js';
import { state } from '../core/state.js';
import { storageGet, storageSet } from '../core/storage.js';
import { withBase } from '../core/base-path.js';
import { t } from './language.js';
import { iconMarkup, chromeIcon } from './icons.js';

function dateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function eveningStatus() {
  const choices = ['online', 'coding', 'gaming'];
  const key = `omar_evening_status_${dateKey()}`;
  const saved = storageGet(key);
  if (choices.includes(saved)) return saved;
  const picked = choices[Math.floor(Math.random() * choices.length)];
  storageSet(key, picked);
  return picked;
}

function statusKey() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 8) return 'sleeping';
  if (hour >= 8 && hour < 18) return 'busy';
  return eveningStatus();
}

export function updateSmartStatus() {
  const key = statusKey();
  const config = siteConfig.smartStatuses[key] || siteConfig.smartStatuses.busy;
  const statusEl = $('#statusText');
  if (statusEl) {
    statusEl.textContent = t(config.labelKey, key);
    statusEl.dataset.status = key;
    statusEl.setAttribute('aria-label', statusEl.textContent);
  }
  state.currentStatus = key;
  document.body.dataset.status = key;
  document.body.style.setProperty('--status-color', config.color);
  document.body.style.setProperty('--status-glow', config.glow);
  document.body.classList.remove('bg-mode-sleep', 'bg-mode-stars', 'bg-mode-aurora', 'bg-mode-coding', 'bg-mode-gaming');
  document.body.classList.add(`bg-mode-${config.bg || 'aurora'}`);
}

export function renderHeroActions() {
  const wrap = $('#heroActions');
  if (!wrap) return;
  wrap.innerHTML = siteConfig.heroActions.map((item) => {
    const label = escapeHtml(t(item.labelKey, item.id));
    const icon = iconMarkup(item.icon, 'action-icon');
    if (item.url) {
      return `<a class="hero-action magnetic" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" data-action-id="${escapeHtml(item.id)}">${icon}<span data-i18n="${escapeHtml(item.labelKey)}">${label}</span></a>`;
    }
    return `<button class="hero-action magnetic" type="button" data-action="${escapeHtml(item.action)}" data-action-id="${escapeHtml(item.id)}">${item.icon === 'share' ? chromeIcon('share') : icon}<span data-i18n="${escapeHtml(item.labelKey)}">${label}</span></button>`;
  }).join('');
}

function tickTitle() {
  const titleEl = document.getElementById('tabTitle');
  const words = siteConfig.titles;
  if (state.titlePaused || !titleEl) return;
  const word = words[state.titleIndex % words.length];
  state.charIndex += state.deleting ? -1 : 1;
  titleEl.textContent = word.slice(0, state.charIndex) || 'Omar Profiles';
  let speed = state.deleting ? 38 : 58;
  if (!state.deleting && state.charIndex >= word.length) {
    speed = 1200;
    state.deleting = true;
  }
  if (state.deleting && state.charIndex <= 0) {
    state.deleting = false;
    state.titleIndex += 1;
    speed = 250;
  }
  state.titleTimer = setTimeout(tickTitle, speed);
}

export function initProfile() {
  renderHeroActions();
  updateSmartStatus();
  setInterval(updateSmartStatus, 60 * 1000);
  onEmit('omar:languagechange', () => {
    renderHeroActions();
    updateSmartStatus();
  });

  const avatar = $('#avatarBtn');
  const pop = $('#profilePopover');
  let hideTimer = 0;
  const showPop = () => {
    pop?.classList.add('is-on');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => pop?.classList.remove('is-on'), 4200);
  };
  avatar?.addEventListener('click', showPop);
  avatar?.addEventListener('focus', showPop);

  const picture = avatar?.querySelector('img');
  if (picture) {
    picture.src = withBase('assets/img/profile.webp');
  }

  if (!state.reducedMotion) tickTitle();
  document.addEventListener('visibilitychange', () => {
    const titleEl = document.getElementById('tabTitle');
    if (document.hidden) {
      state.titlePaused = true;
      clearTimeout(state.titleTimer);
      if (titleEl) titleEl.textContent = siteConfig.hiddenTabTitle;
    } else {
      state.titlePaused = false;
      if (titleEl) titleEl.textContent = siteConfig.returnedTabTitle;
      clearTimeout(state.titleTimer);
      if (!state.reducedMotion) state.titleTimer = setTimeout(tickTitle, 900);
    }
  });

  on(document, 'click', (event) => {
    if (event.target.closest('[data-action="share"]')) {
      event.preventDefault();
      document.dispatchEvent(new CustomEvent('omar:share'));
    }
  });
}

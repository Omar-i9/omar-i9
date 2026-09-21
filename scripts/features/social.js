import { socialLinks, socialOrder } from '../../data/social.js';
import { $, $$, escapeHtml } from '../core/dom.js';
import { on } from '../core/events.js';
import { state } from '../core/state.js';
import { t } from './language.js';
import { iconMarkup } from './icons.js';
import { copyText } from './toast.js';

const badgeKeys = {
  featured: 'badgeFeatured',
  public: 'badgePublic',
  private: 'badgePrivate',
  official: 'badgeOfficial',
  contact: 'badgeContact'
};

export function orderedSocialLinks() {
  return socialLinks.slice().sort((a, b) => {
    const ai = socialOrder.indexOf(a.id);
    const bi = socialOrder.indexOf(b.id);
    const ap = ai === -1 ? 100 + socialLinks.indexOf(a) : ai;
    const bp = bi === -1 ? 100 + socialLinks.indexOf(b) : bi;
    return ap - bp;
  });
}

function badges(item) {
  const list = item.badges?.length ? item.badges : ['private'];
  return `<span class="social-badges">${list.map((badge) => {
    const key = badgeKeys[badge] || 'badgePrivate';
    return `<span class="social-badge social-badge-${escapeHtml(badge)}" data-i18n="${key}">${escapeHtml(t(key, badge))}</span>`;
  }).join('')}</span>`;
}

export function renderSocialLinks() {
  const grid = $('#linksGrid');
  if (!grid) return;
  grid.innerHTML = orderedSocialLinks().map((item, index) => {
    const title = escapeHtml(t(item.titleKey, item.id));
    const handle = escapeHtml(item.handleKey ? t(item.handleKey, item.handle) : item.handle);
    const content = `
      ${badges(item)}
      <span class="social-icon">${iconMarkup(item.icon)}</span>
      <div class="social-text"><strong data-i18n="${escapeHtml(item.titleKey)}">${title}</strong><span${item.handleKey ? ` data-i18n="${escapeHtml(item.handleKey)}"` : ''}>${handle}</span></div>`;
    const delay = `style="--delay:${Math.min(index * 55, 520)}ms"`;
    const klass = `social-card ${escapeHtml(item.className)} reveal`;
    if (item.action) {
      return `<button class="${klass}" ${delay} type="button" data-id="${escapeHtml(item.id)}" data-group="${escapeHtml(item.group)}" data-action="${escapeHtml(item.action)}" data-copy-text="${escapeHtml(item.copy || '')}" aria-label="${title}">${content}</button>`;
    }
    return `<a class="${klass}" ${delay} href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" data-id="${escapeHtml(item.id)}" data-group="${escapeHtml(item.group)}" data-copy-text="${escapeHtml(item.url)}" aria-label="${title}">${content}</a>`;
  }).join('');
  applyFilter(state.filter);
}

export function applyFilter(filter) {
  state.filter = filter || 'all';
  $$('.filter-chip').forEach((chip) => {
    const on = chip.dataset.filter === state.filter;
    chip.classList.toggle('is-on', on);
    chip.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  $$('#linksGrid .social-card').forEach((card) => {
    const show = state.filter === 'all' || card.dataset.group === state.filter;
    card.classList.toggle('is-filtered-out', !show);
    card.toggleAttribute('hidden', !show);
  });
}

export function initSocial() {
  renderSocialLinks();
  on(document, 'omar:languagechange', renderSocialLinks);
  on(document, 'click', (event) => {
    if (event.target.closest('[data-action="discord"]')) {
      event.preventDefault();
      document.dispatchEvent(new CustomEvent('omar:discord'));
    }
  });

  let longPressTimer = 0;
  on(document, 'pointerdown', (event) => {
    const card = event.target.closest?.('.social-card[data-copy-text]');
    if (!card) return;
    longPressTimer = setTimeout(() => {
      card.classList.add('is-pressed');
      state.cancelNextCardClick = true;
      copyText(card.dataset.copyText, t('copied', 'Copied ✓'));
      longPressTimer = 0;
    }, 650);
  });
  ['pointerup', 'pointercancel', 'pointerleave', 'scroll'].forEach((name) => {
    on(document, name, () => {
      if (longPressTimer) clearTimeout(longPressTimer);
      longPressTimer = 0;
    }, name === 'scroll' ? { passive: true } : undefined);
  });
  on(document, 'click', (event) => {
    const card = event.target.closest?.('.social-card');
    if (state.cancelNextCardClick && card) {
      event.preventDefault();
      event.stopPropagation();
      state.cancelNextCardClick = false;
      card.classList.remove('is-pressed');
    }
  }, true);
}

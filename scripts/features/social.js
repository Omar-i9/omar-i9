import { socialLinks, socialOrder } from '../../data/social.js';
import { escapeHtml } from '../core/dom.js';
import { currentLang, t } from '../core/i18n.js';
import { copyText } from '../core/toast.js';

function getOrderedLinks() {
  return [...socialLinks].sort((a, b) => {
    const ai = socialOrder.indexOf(a.id);
    const bi = socialOrder.indexOf(b.id);
    return (ai < 0 ? 100 + socialLinks.indexOf(a) : ai) - (bi < 0 ? 100 + socialLinks.indexOf(b) : bi);
  });
}

function badgeMarkup(item) {
  const badges = item.badges?.length ? item.badges : ['private'];
  return `<div class="social-badges">${badges.map((badge) => {
    const key = ({ featured: 'badgeFeatured', public: 'badgePublic', private: 'badgePrivate', official: 'badgeOfficial', contact: 'badgeContact' })[badge] || 'badgePrivate';
    return `<span class="social-badge social-badge--${escapeHtml(badge)}">${escapeHtml(t(key, badge))}</span>`;
  }).join('')}</div>`;
}

export function renderSocialLinks() {
  const grid = document.getElementById('linksGrid');
  if (!grid) return;
  grid.innerHTML = getOrderedLinks().map((item, index) => {
    const title = t(item.titleKey, item.id);
    const handle = item.handleKey ? t(item.handleKey, item.handle) : item.handle;
    const note = item.id === 'discord' ? t('discordUnavailable', 'رابط العرض غير متاح حالياً') : '';
    const content = `
      ${badgeMarkup(item)}
      <span class="social-icon-wrap"><img class="social-icon" src="${escapeHtml(item.icon)}" alt="" width="42" height="42" loading="lazy" decoding="async"></span>
      <span class="social-copy"><strong>${escapeHtml(title)}</strong><span class="social-handle" dir="ltr">${escapeHtml(handle)}</span>${note ? `<small class="social-note">${escapeHtml(note)}</small>` : ''}</span>
      <span class="social-card-mark" aria-hidden="true">${item.action === 'copy' ? '↗' : '↗'}</span>`;
    const style = `--card-index:${index};--brand-tint:${escapeHtml(item.tint || 'rgba(110,130,155,.12)')}`;
    if (item.action === 'copy') {
      return `<button class="social-card ${escapeHtml(item.className || '')} is-copy" style="${style}" type="button" data-social-copy="${escapeHtml(item.copy || item.handle)}" data-id="${escapeHtml(item.id)}" aria-label="${escapeHtml(t('discordCopyHint', 'اضغط لنسخ اسم المستخدم'))}: ${escapeHtml(handle)}">${content}</button>`;
    }
    return `<a class="social-card ${escapeHtml(item.className || '')}" style="${style}" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" data-id="${escapeHtml(item.id)}">${content}</a>`;
  }).join('');
}

export function initSocial() {
  renderSocialLinks();
  document.addEventListener('omar:languagechange', renderSocialLinks);
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-social-copy]');
    if (!button) return;
    const id = button.dataset.id;
    const value = button.dataset.socialCopy;
    const message = id === 'discord' ? t('discordCopied') : t('copied');
    const ok = await copyText(value, message, t('copyFailed'));
    if (ok) {
      button.classList.add('is-copied');
      window.setTimeout(() => button.classList.remove('is-copied'), 700);
    }
  });
}

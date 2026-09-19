import { quickCopy } from '../../data/social.js';
import { $, escapeHtml } from '../core/dom.js';
import { on } from '../core/events.js';
import { t } from './language.js';
import { iconMarkup, chromeIcon } from './icons.js';
import { copyText } from './toast.js';

export function renderQuickCopy() {
  const wrap = $('#copyList');
  if (!wrap) return;
  wrap.innerHTML = quickCopy.map((item, index) => {
    const label = escapeHtml(t(item.labelKey, item.id));
    return `
      <div class="copy-row reveal" style="--delay:${index * 60}ms">
        <span class="copy-icon">${iconMarkup(item.icon, 'copy-brand')}</span>
        <div class="copy-meta">
          <span class="copy-label" data-i18n="${escapeHtml(item.labelKey)}">${label}</span>
          <strong class="copy-value" dir="ltr">${escapeHtml(item.value)}</strong>
        </div>
        <button class="copy-btn" type="button" data-copy="${escapeHtml(item.value)}">
          ${chromeIcon('copy')}
          <span data-i18n="copyBtn">${escapeHtml(t('copyBtn', 'Copy'))}</span>
        </button>
      </div>`;
  }).join('');
}

export function initQuickCopy() {
  renderQuickCopy();
  on(document, 'omar:languagechange', renderQuickCopy);
  on(document, 'click', async (event) => {
    const btn = event.target.closest('[data-copy]');
    if (!btn) return;
    const ok = await copyText(btn.dataset.copy, t('copied', 'Copied ✓'));
    if (ok) {
      btn.classList.add('is-done');
      setTimeout(() => btn.classList.remove('is-done'), 1200);
    }
  });
}

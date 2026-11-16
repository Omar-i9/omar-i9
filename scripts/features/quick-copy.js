import { quickCopy } from '../../data/social.js';
import { escapeHtml } from '../core/dom.js';
import { t } from '../core/i18n.js';
import { copyText } from '../core/toast.js';
import { clearReveals, observeReveals } from '../core/reveal.js';

export function renderQuickCopy() {
  const list = document.getElementById('copyList');
  if (!list) return;
  clearReveals(list);
  list.innerHTML = quickCopy.map((item, index) => `
    <article class="copy-card" data-reveal style="--card-index:${index}">
      <img src="${escapeHtml(item.icon)}" alt="" width="38" height="38" loading="lazy" decoding="async">
      <div class="copy-meta">
        <span>${escapeHtml(t(item.labelKey, item.id))}</span>
        <strong dir="ltr">${escapeHtml(item.value)}</strong>
      </div>
      <button type="button" class="copy-action" data-copy-value="${escapeHtml(item.value)}" aria-label="${escapeHtml(t('copyBtn', 'Copy'))} ${escapeHtml(item.value)}">
        <span aria-hidden="true">⧉</span><span data-copy-label>${escapeHtml(t('copyBtn', 'نسخ'))}</span>
      </button>
    </article>`).join('');
  observeReveals(list);
}

export function initQuickCopy() {
  renderQuickCopy();
  document.addEventListener('omar:languagechange', renderQuickCopy);
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-copy-value]');
    if (!button) return;
    const ok = await copyText(button.dataset.copyValue, t('copied'), t('copyFailed'));
    if (ok) {
      const label = button.querySelector('[data-copy-label]');
      if (label) label.textContent = t('copied');
      button.classList.add('is-done');
      window.setTimeout(() => {
        button.classList.remove('is-done');
        if (label) label.textContent = t('copyBtn', 'Copy');
      }, 1100);
    }
  });
}

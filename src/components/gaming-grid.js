import { gamingIdentifiers } from '../data/social.js';
import { translate } from '../core/i18n.js';
import { showToast } from '../features/feedback.js';

export function renderGamingGrid() {
  const root = document.getElementById('gamingGrid');
  if (!root) return;
  root.innerHTML = gamingIdentifiers.map((item) => `
    <button class="gaming-card" type="button" data-copy-value="${item.value}" aria-label="${item.name}: ${item.value}">
      <span class="gaming-card__icon"><img src="${item.icon}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" /></span>
      <span class="gaming-card__copy"><strong>${item.name}</strong><small dir="ltr">${item.value}</small></span>
      <span class="gaming-card__copy-mark" aria-hidden="true">⧉</span>
    </button>`).join('');

  root.querySelectorAll('[data-copy-value]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copyValue);
        showToast(translate('copied', 'Copied'));
      } catch {
        showToast(translate('copyFailed', 'Could not copy'));
      }
    });
  });
}

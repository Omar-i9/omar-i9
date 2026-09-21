import { socialFilters } from '../../data/social.js';
import { $, escapeHtml } from '../core/dom.js';
import { on } from '../core/events.js';
import { t } from './language.js';
import { applyFilter } from './social.js';

export function renderFilters() {
  const wrap = $('#linkFilters');
  if (!wrap) return;
  wrap.innerHTML = socialFilters.map((item) => (
    `<button class="filter-chip" type="button" data-filter="${escapeHtml(item.id)}" aria-pressed="false">
      <span data-i18n="${escapeHtml(item.labelKey)}">${escapeHtml(t(item.labelKey, item.id))}</span>
    </button>`
  )).join('');
  applyFilter('all');
}

export function initFilters() {
  renderFilters();
  on(document, 'click', (event) => {
    const chip = event.target.closest('[data-filter]');
    if (!chip || !chip.closest('#linkFilters')) return;
    applyFilter(chip.dataset.filter);
  });
  on(document, 'omar:languagechange', renderFilters);
}

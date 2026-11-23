import { socialLinks, footerSocials } from '../data/social.js';
import { translate } from '../core/i18n.js';
import { showToast } from '../features/feedback.js';

async function copyValue(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(translate('copied', 'Copied'));
  } catch {
    showToast(translate('copyFailed', 'Could not copy'));
  }
}

function socialCard(item) {
  const copyOnly = Boolean(item.copy);
  const content = `
    <span class="social-card__icon"><img src="${item.icon}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" /></span>
    <span class="social-card__copy"><strong>${item.name}</strong><small dir="ltr">${item.handle}</small></span>
    <span class="social-card__arrow" aria-hidden="true">${copyOnly ? '⧉' : '↗'}</span>`;
  if (copyOnly) {
    return `<button class="social-card social-card--${item.id} social-card--copy" type="button" data-copy-value="${item.copy}" aria-label="${translate('discordCopy', 'Copy ID')} ${item.handle}">${content}</button>`;
  }
  return `<a class="social-card social-card--${item.id}" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.name}: ${item.handle}">${content}</a>`;
}

export function renderSocialGrid() {
  const root = document.getElementById('socialGrid');
  if (root) {
    root.innerHTML = socialLinks.map(socialCard).join('');
    root.querySelectorAll('[data-copy-value]').forEach((button) => {
      button.addEventListener('click', () => copyValue(button.dataset.copyValue));
    });
  }

  const footer = document.getElementById('footerSocials');
  if (footer) {
    footer.innerHTML = footerSocials.map((item) => `
      <a href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.name}" title="${item.name}">
        <img src="${item.icon}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
      </a>`).join('');
  }
}

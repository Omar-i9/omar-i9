import { translations } from '../../data/translations.js';
import { storageGet, storageSet } from '../core/storage.js';
import { $$ } from '../core/dom.js';
import { emit, on } from '../core/events.js';

const STORE_KEY = 'omar_site_lang';

export function currentLang() {
  return document.documentElement.lang === 'en' ? 'en' : 'ar';
}

export function t(key, fallback) {
  const lang = currentLang();
  return translations[lang]?.[key] ?? translations.ar?.[key] ?? fallback ?? key;
}

export function savedLanguage() {
  return storageGet(STORE_KEY) === 'en' ? 'en' : 'ar';
}

export function applyLanguage(lang) {
  const next = lang === 'en' ? 'en' : 'ar';
  const dict = translations[next] || translations.ar;
  const html = document.documentElement;
  html.lang = next;
  html.dir = next === 'ar' ? 'rtl' : 'ltr';
  storageSet(STORE_KEY, next);

  $$('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && Object.prototype.hasOwnProperty.call(dict, key)) el.textContent = dict[key];
  });

  $$('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (key && Object.prototype.hasOwnProperty.call(dict, key)) el.innerHTML = dict[key];
  });

  $$('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (key && Object.prototype.hasOwnProperty.call(dict, key)) el.setAttribute('aria-label', dict[key]);
  });

  const titleEl = document.getElementById('tabTitle');
  if (titleEl) titleEl.textContent = dict.pageTitle || 'Omar Profiles';

  const description = document.querySelector('meta[name="description"]');
  if (description && dict.metaDescription) description.setAttribute('content', dict.metaDescription);

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.dataset.lang = next;
    langBtn.setAttribute('aria-label', dict.ariaBtn || 'Switch language');
    langBtn.title = dict.ariaBtn || 'Switch language';
    const current = langBtn.querySelector('[data-lang-current]');
    const other = langBtn.querySelector('[data-lang-other]');
    if (current) current.textContent = next === 'ar' ? 'AR' : 'EN';
    if (other) other.textContent = next === 'ar' ? 'EN' : 'AR';
    langBtn.classList.toggle('is-en', next === 'en');
  }

  emit('omar:languagechange', { lang: next });
}

export function toggleLanguage() {
  applyLanguage(currentLang() === 'ar' ? 'en' : 'ar');
}

export function initLanguage() {
  applyLanguage(savedLanguage());
  on(document, 'click', (event) => {
    if (event.target.closest('#langToggleBtn')) {
      event.preventDefault();
      toggleLanguage();
    }
  });
}

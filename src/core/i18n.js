import { translations } from '../data/translations.js';

const STORAGE_KEY = 'omarr-language';
let language = readInitialLanguage();

function readInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ar' || stored === 'en') return stored;
  } catch { /* Storage is optional. */ }
  return document.documentElement.lang === 'en' ? 'en' : 'ar';
}

export function currentLanguage() { return language; }
export function translate(key, fallback = key) { return translations[language]?.[key] ?? fallback; }

export function applyLanguage(next = language) {
  language = next === 'en' ? 'en' : 'ar';
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.body.dataset.language = language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = translate(element.dataset.i18n, element.textContent);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', translate(element.dataset.i18nAria, element.getAttribute('aria-label') || ''));
  });
  const toggle = document.getElementById('languageToggle');
  if (toggle) {
    toggle.setAttribute('aria-label', language === 'ar' ? 'Switch language to English' : 'تبديل اللغة إلى العربية');
    toggle.setAttribute('aria-pressed', String(language === 'en'));
  }
  document.title = 'Omarr';
  try { localStorage.setItem(STORAGE_KEY, language); } catch { /* Preference is optional. */ }
  document.dispatchEvent(new CustomEvent('identity:languagechange', { detail: { language } }));
}

export function initLanguage() {
  applyLanguage(language);
  document.getElementById('languageToggle')?.addEventListener('click', () => applyLanguage(language === 'ar' ? 'en' : 'ar'));
}

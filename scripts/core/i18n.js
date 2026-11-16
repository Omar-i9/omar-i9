import { translations } from '../../data/translations.js';
import { copy } from '../../data/copy.js';
import { safeStorageGet, safeStorageSet, $$ } from './dom.js';

const STORAGE_KEY = 'omar_site_lang';
let activeLang = 'ar';

export function currentLang() { return activeLang; }
export function isArabic() { return activeLang === 'ar'; }

export function t(key, fallback = key) {
  return copy[activeLang]?.[key]
    ?? translations[activeLang]?.[key]
    ?? copy.ar?.[key]
    ?? translations.ar?.[key]
    ?? fallback;
}

function applyStaticText() {
  const dictionary = { ...translations[activeLang], ...copy[activeLang] };
  $$('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (Object.hasOwn(dictionary, key)) node.textContent = dictionary[key];
  });
  $$('[data-i18n-html]').forEach((node) => {
    const key = node.dataset.i18nHtml;
    if (Object.hasOwn(dictionary, key)) node.innerHTML = dictionary[key];
  });
  $$('[data-i18n-aria]').forEach((node) => {
    const key = node.dataset.i18nAria;
    if (Object.hasOwn(dictionary, key)) node.setAttribute('aria-label', dictionary[key]);
  });
  $$('[data-i18n-title]').forEach((node) => {
    const key = node.dataset.i18nTitle;
    if (Object.hasOwn(dictionary, key)) node.setAttribute('title', dictionary[key]);
  });
}

export function setLanguage(language, { persist = true } = {}) {
  activeLang = language === 'en' ? 'en' : 'ar';
  const html = document.documentElement;
  html.lang = activeLang;
  html.dir = activeLang === 'ar' ? 'rtl' : 'ltr';
  document.title = 'Omar|عُمَر';
  const description = activeLang === 'ar'
    ? 'Omar|عُمَر — الموقع الشخصي الرسمي لعرض الحسابات وروابط التواصل والمشاريع التقنية.'
    : 'Omar|عُمَر — the official personal website for social accounts, contact links, and technology projects.';
  const socialDescription = activeLang === 'ar'
    ? 'الصفحة الشخصية الرسمية لعمر؛ تعرض حساباته وروابط التواصل ومشاريعه التقنية في مكان واحد.'
    : 'Omar|عُمَر — official personal profile for social accounts, contact links, and technology projects.';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = description;
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.content = socialDescription;
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) twitterDescription.content = socialDescription;
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.content = activeLang === 'ar' ? 'ar_PS' : 'en_US';

  const toggle = document.getElementById('langToggleBtn');
  if (toggle) {
    toggle.classList.toggle('is-ar', activeLang === 'ar');
    toggle.classList.toggle('is-en', activeLang === 'en');
    toggle.setAttribute('aria-pressed', activeLang === 'en' ? 'true' : 'false');
    toggle.setAttribute('aria-label', activeLang === 'ar' ? 'Switch language to English' : 'تبديل اللغة إلى العربية');
  }
  if (persist) safeStorageSet(STORAGE_KEY, activeLang);
  applyStaticText();
  document.dispatchEvent(new CustomEvent('omar:languagechange', { detail: { language: activeLang } }));
}

export function initLanguage() {
  const saved = safeStorageGet(STORAGE_KEY);
  setLanguage(saved === 'en' ? 'en' : 'ar', { persist: false });
  document.getElementById('langToggleBtn')?.addEventListener('click', () => {
    setLanguage(activeLang === 'ar' ? 'en' : 'ar');
  });
}

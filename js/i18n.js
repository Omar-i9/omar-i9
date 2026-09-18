import { I18N } from '../data/i18n.js';

const KEY = 'omar_site_lang';

export function getLang() {
  const htmlLang = document.documentElement.lang;
  return htmlLang === 'ar' ? 'ar' : 'en';
}

export function t(path, lang = getLang()) {
  const parts = String(path).split('.');
  let node = I18N[lang] || I18N.en;
  for (const part of parts) {
    node = node?.[part];
  }
  if (node == null) {
    node = I18N.en;
    for (const part of parts) node = node?.[part];
  }
  return node == null ? path : node;
}

export function detectInitialLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || 'en').toLowerCase();
  return nav.startsWith('ar') ? 'ar' : 'en';
}

export function applyLanguage(lang) {
  const next = lang === 'ar' ? 'ar' : 'en';
  const root = document.documentElement;
  root.lang = next;
  root.dir = next === 'ar' ? 'rtl' : 'ltr';
  try { localStorage.setItem(KEY, next); } catch { /* ignore */ }

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'), next);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'), next));
  });

  const title = t('meta.title', next);
  document.title = title;
  const tab = document.getElementById('tabTitle');
  if (tab) tab.textContent = title;

  const desc = t('meta.description', next);
  document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', desc);

  document.dispatchEvent(new CustomEvent('omar:lang', { detail: { lang: next } }));
}

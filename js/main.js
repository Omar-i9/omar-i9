import { applyLanguage, detectInitialLang, t } from './i18n.js';
import { applyTheme, detectInitialTheme, toggleTheme, getTheme } from './theme.js';
import { initNav, renderNav } from './nav.js';
import { initMotion } from './motion.js';
import { initRender, renderAll } from './render.js';
import { initModal } from './modal.js';
import { toast } from './util.js';
import { SITE } from '../data/site.js';

function syncChrome() {
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.textContent = t('chrome.lang');
    langBtn.setAttribute('aria-label', t('chrome.langAria'));
  }
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    const light = getTheme() === 'light';
    themeBtn.setAttribute('aria-label', t(light ? 'chrome.themeToDark' : 'chrome.themeToLight'));
    themeBtn.dataset.theme = getTheme();
  }
}

async function shareSite() {
  const payload = {
    title: t('meta.title'),
    text: t('meta.description'),
    url: SITE.canonical
  };
  try {
    if (navigator.share) {
      await navigator.share(payload);
      toast(t('contact.shared'));
      return;
    }
  } catch {
    /* user cancelled or share failed */
  }
  try {
    await navigator.clipboard.writeText(SITE.canonical);
    toast(t('contact.shareFail'));
  } catch {
    toast(t('contact.shareFail'));
  }
}

function boot() {
  applyTheme(detectInitialTheme());
  applyLanguage(detectInitialLang());
  initNav();
  initModal();
  initRender();
  initMotion();
  syncChrome();

  document.getElementById('langBtn')?.addEventListener('click', () => {
    applyLanguage(document.documentElement.lang === 'ar' ? 'en' : 'ar');
  });
  document.getElementById('themeBtn')?.addEventListener('click', toggleTheme);
  document.getElementById('shareBtn')?.addEventListener('click', shareSite);

  document.addEventListener('omar:lang', () => {
    renderNav();
    renderAll();
    initMotion();
    syncChrome();
  });
  document.addEventListener('omar:theme', syncChrome);
}

boot();

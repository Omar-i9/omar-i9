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
    themeBtn.innerHTML = light
      ? '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.6 15.4A8 8 0 0 1 8.6 6.4 7 7 0 1 0 17.6 15.4Z"/></svg>'
      : '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm9-6a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm12.07 6.07a1 1 0 0 1 0 1.41l-.7.7a1 1 0 1 1-1.42-1.41l.71-.7a1 1 0 0 1 1.41 0ZM8.05 6.05a1 1 0 0 1 0 1.41l-.7.71A1 1 0 0 1 5.93 6.76l.7-.7a1 1 0 0 1 1.42 0Zm9.9 0a1 1 0 0 1 0 1.41l-.7.7A1 1 0 1 1 15.82 6.76l.7-.7a1 1 0 0 1 1.42 0ZM8.05 17.95a1 1 0 0 1-1.41 0l-.7-.7A1 1 0 0 1 7.34 15.82l.7.71a1 1 0 0 1 0 1.41ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"/></svg>';
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
    document.getElementById('toast')?.classList.remove('is-on');
    renderNav();
    renderAll();
    initMotion();
    syncChrome();
  });
  document.addEventListener('omar:theme', syncChrome);
}

boot();

'use strict';

(function () {
  const storeKey = 'omar_site_lang';
  const site = window.OMAR_SITE || {};
  const translations = site.translations || { ar: {}, en: {} };
  const html = document.documentElement;

  function getSavedLanguage() {
    try {
      const saved = localStorage.getItem(storeKey);
      return saved === 'en' ? 'en' : 'ar';
    } catch (_) {
      return 'ar';
    }
  }

  function saveLanguage(lang) {
    try { localStorage.setItem(storeKey, lang); } catch (_) {}
  }

  function t(key, fallback) {
    const lang = html.lang === 'en' ? 'en' : 'ar';
    return translations[lang]?.[key] ?? translations.ar?.[key] ?? fallback ?? key;
  }

  function applyLanguage(lang) {
    const next = lang === 'en' ? 'en' : 'ar';
    const isRTL = next === 'ar';
    const dict = translations[next] || translations.ar || {};
    html.lang = next;
    html.dir = isRTL ? 'rtl' : 'ltr';
    saveLanguage(next);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key && Object.prototype.hasOwnProperty.call(dict, key)) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (key && Object.prototype.hasOwnProperty.call(dict, key)) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (key && Object.prototype.hasOwnProperty.call(dict, key)) el.setAttribute('aria-label', dict[key]);
    });

    const titleEl = document.getElementById('tabTitle');
    if (titleEl) titleEl.textContent = dict.pageTitle || 'Omar Profiles';

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', next === 'en'
        ? "Omar's profile page, links, projects, and quick copy codes in one place"
        : 'صفحة Omar Profiles تجمع الروابط والمشاريع والأكواد السريعة في مكان واحد');
    }

    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
      langBtn.dataset.lang = next;
      langBtn.setAttribute('aria-label', dict.ariaBtn || 'Switch language');
      langBtn.setAttribute('title', dict.ariaBtn || 'Switch language');
    }

    document.dispatchEvent(new CustomEvent('omar:languagechange', { detail: { lang: next } }));
  }

  function toggleLanguage() {
    applyLanguage(html.lang === 'ar' ? 'en' : 'ar');
  }

  window.OMAR_I18N = {
    get lang() { return html.lang === 'en' ? 'en' : 'ar'; },
    t,
    applyLanguage,
    toggleLanguage,
    getSavedLanguage
  };
})();

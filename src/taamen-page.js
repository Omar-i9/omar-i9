import './styles/index.css';
import './styles/details.css';

const key = 'omarr-language';
let lang = 'ar';
try {
  const saved = localStorage.getItem(key);
  if (saved === 'ar' || saved === 'en') lang = saved;
} catch { /* Language preference is optional. */ }

function applyLanguage(next) {
  lang = next === 'en' ? 'en' : 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar][data-en]').forEach((element) => {
    element.textContent = element.dataset[lang];
  });
  const button = document.getElementById('detailLanguageToggle');
  button?.setAttribute('aria-label', lang === 'ar' ? 'Switch language to English' : 'تبديل اللغة إلى العربية');
  try { localStorage.setItem(key, lang); } catch { /* Ignore unavailable storage. */ }
  document.title = lang === 'ar' ? 'TAAMEN — Omarr' : 'TAAMEN — Omarr';
}

applyLanguage(lang);
document.getElementById('detailLanguageToggle')?.addEventListener('click', () => applyLanguage(lang === 'ar' ? 'en' : 'ar'));

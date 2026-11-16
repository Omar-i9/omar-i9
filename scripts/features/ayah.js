import { ayahs } from '../../data/ayahs.js';
import { t, currentLang } from '../core/i18n.js';
import { safeStorageGet, safeStorageSet, prefersReducedMotion } from '../core/dom.js';
import { copyText } from '../core/toast.js';

const PREF_KEY = 'omar_ayah_card_preference';
let currentIndex = 0;

function dailyIndex() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Hebron', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const key = `${value.year}-${value.month}-${value.day}`;
  let hash = 0;
  for (const character of key) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return (hash >>> 0) % ayahs.length;
}

function selectedAyah() { return ayahs[currentIndex] || ayahs[0]; }

function paint() {
  const ayah = selectedAyah();
  const english = currentLang() === 'en';
  const text = document.getElementById('ayahText');
  const translation = document.getElementById('ayahTranslation');
  const reference = document.getElementById('ayahRef');
  const tafsir = document.getElementById('ayahTafsirText');
  if (text) {
    text.textContent = ayah.text;
    text.lang = 'ar';
    text.dir = 'rtl';
  }
  if (translation) {
    translation.hidden = !english;
    translation.textContent = english ? ayah.en : '';
    translation.lang = 'en';
    translation.dir = 'ltr';
  }
  if (reference) reference.textContent = english ? ayah.refEn : ayah.refAr;
  if (tafsir) tafsir.textContent = english ? ayah.tafsirEn : ayah.tafsirAr;
  safeStorageSet('omar_last_ayah_index', String(currentIndex));
}

function measureDefaultVisibility(card) {
  const media = window.matchMedia?.('(min-width: 760px) and (min-height: 640px)');
  if (!media?.matches) return false;
  card.classList.remove('is-hidden');
  card.setAttribute('aria-hidden', 'false');
  const rect = card.getBoundingClientRect();
  const fits = rect.width > 0 && rect.height > 0 && rect.height <= window.innerHeight * 0.48;
  card.classList.add('is-hidden');
  card.setAttribute('aria-hidden', 'true');
  return fits;
}

function setVisible(visible, { save = true, animate = true } = {}) {
  const card = document.getElementById('ayahCard');
  const dock = document.getElementById('ayahDock');
  if (!card || !dock) return;
  if (save) safeStorageSet(PREF_KEY, visible ? 'shown' : 'hidden');
  if (visible) {
    card.classList.remove('is-hidden');
    card.setAttribute('aria-hidden', 'false');
    dock.classList.remove('is-visible');
    if (animate && !prefersReducedMotion()) {
      card.classList.remove('is-entering');
      requestAnimationFrame(() => card.classList.add('is-entering'));
      window.setTimeout(() => card.classList.remove('is-entering'), 520);
    }
  } else {
    card.classList.add('is-hidden');
    card.setAttribute('aria-hidden', 'true');
    dock.classList.add('is-visible');
  }
}

function copyCurrentAyah() {
  const ayah = selectedAyah();
  const english = currentLang() === 'en';
  const reference = english ? ayah.refEn : ayah.refAr;
  const tafsir = english ? ayah.tafsirEn : ayah.tafsirAr;
  const lines = english
    ? [ayah.text, ayah.en, reference, `Tafsir: ${tafsir}`]
    : [ayah.text, reference, `التفسير: ${tafsir}`];
  return copyText(lines.join('\n\n'), t('ayahCopied', t('copied')), t('copyFailed'));
}

export function initAyah() {
  const card = document.getElementById('ayahCard');
  const dock = document.getElementById('ayahDock');
  if (!card || !dock) return;

  const savedIndex = Number(safeStorageGet('omar_last_ayah_index'));
  currentIndex = Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < ayahs.length
    ? savedIndex
    : dailyIndex();
  paint();

  const preference = safeStorageGet(PREF_KEY);
  const defaultVisible = preference === 'shown' ? true : preference === 'hidden' ? false : measureDefaultVisibility(card);
  setVisible(defaultVisible, { save: false, animate: false });

  document.getElementById('ayahHide')?.addEventListener('click', () => setVisible(false));
  dock.addEventListener('click', () => setVisible(true));
  document.getElementById('ayahCopy')?.addEventListener('click', copyCurrentAyah);

  document.addEventListener('omar:languagechange', paint);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && card.classList.contains('is-entering')) card.classList.remove('is-entering');
  });
  window.addEventListener('resize', () => {
    if (safeStorageGet(PREF_KEY)) return;
    setVisible(measureDefaultVisibility(card), { save: false, animate: false });
  }, { passive: true });
}

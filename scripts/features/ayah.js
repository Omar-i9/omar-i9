import { ayahs } from '../../data/ayahs.js';
import { $, escapeHtml } from '../core/dom.js';
import { on } from '../core/events.js';
import { state } from '../core/state.js';
import { storageGet, storageSet } from '../core/storage.js';
import { currentLang, t } from './language.js';
import { chromeIcon } from './icons.js';
import { copyText } from './toast.js';

function shuffle(values) {
  const next = values.slice();
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function rebuildOrder(avoidIndex = -1) {
  const ids = ayahs.map((_, i) => i).filter((i) => i !== avoidIndex);
  state.ayahOrder = shuffle(ids);
  state.ayahPointer = 0;
}

function nextIndex() {
  if (!state.ayahOrder.length || state.ayahPointer >= state.ayahOrder.length) {
    rebuildOrder(state.ayahIndex);
  }
  const value = state.ayahOrder[state.ayahPointer];
  state.ayahPointer += 1;
  return value;
}

function nextDelay() {
  return state.reducedMotion ? 28000 : 16000 + Math.floor(Math.random() * 9000);
}

function copyPayload() {
  const ayah = ayahs[state.ayahIndex];
  if (!ayah) return '';
  const lang = currentLang();
  return `${ayah.text}\n${lang === 'en' ? ayah.refEn : ayah.refAr}\n${ayah.en}`;
}

function paintAyah() {
  const ayah = ayahs[state.ayahIndex];
  if (!ayah) return;
  const lang = currentLang();
  const category = $('#ayahCategory');
  if (category) category.textContent = lang === 'en' ? ayah.categoryEn : ayah.categoryAr;
  $('#ayahText').textContent = ayah.text;
  const trans = $('#ayahTranslation');
  if (trans) {
    if (lang === 'en') {
      trans.hidden = false;
      trans.textContent = ayah.en;
    } else {
      trans.hidden = true;
      trans.textContent = '';
    }
  }
  $('#ayahRef').textContent = lang === 'en' ? ayah.refEn : ayah.refAr;
  $('#ayahNote').innerHTML = `<span class="ayah-meaning-label">${escapeHtml(t('meaningLabel'))}</span> ${escapeHtml(lang === 'en' ? ayah.noteEn : ayah.noteAr)}`;
  $('#ayahDetail').textContent = lang === 'en' ? ayah.tafsirEn : ayah.tafsirAr;
  storageSet('omar_last_ayah_index', String(state.ayahIndex));
}

function restartRing(delay) {
  const ring = $('#ayahRing');
  if (!ring) return;
  ring.classList.remove('is-running');
  ring.style.setProperty('--ayah-delay', `${delay}ms`);
  requestAnimationFrame(() => ring.classList.add('is-running'));
}

function scheduleNext() {
  clearTimeout(state.ayahTimer);
  if (document.hidden || state.reducedMotion) return;
  const card = $('#ayahFloat');
  if (!card || card.classList.contains('is-hidden-hard')) return;
  const delay = nextDelay();
  restartRing(delay);
  state.ayahTimer = setTimeout(() => {
    state.ayahIndex = nextIndex();
    paintAyah();
    scheduleNext();
  }, delay);
}

export function initAyah() {
  const card = $('#ayahFloat');
  const eye = $('#ayahEye');
  const dock = $('#ayahDock');
  if (!card) return;

  if (eye) eye.innerHTML = chromeIcon('hide');
  const newBtn = $('#newAyahBtn');
  if (newBtn) newBtn.insertAdjacentHTML('afterbegin', chromeIcon('rotate'));
  const copyBtn = $('#copyAyahBtn');
  if (copyBtn) copyBtn.insertAdjacentHTML('afterbegin', chromeIcon('copy'));

  rebuildOrder();
  const savedIndex = Number(storageGet('omar_last_ayah_index'));
  state.ayahIndex = Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < ayahs.length
    ? savedIndex
    : nextIndex();
  paintAyah();

  const shouldShow = storageGet('omar_ayah_card_state') === 'shown';

  function setVisible(visible, animate = true) {
    storageSet('omar_ayah_card_state', visible ? 'shown' : 'hidden');
    card.setAttribute('aria-hidden', visible ? 'false' : 'true');
    dock?.setAttribute('aria-expanded', visible ? 'true' : 'false');
    clearTimeout(state.ayahTimer);
    if (visible) {
      card.classList.remove('is-hidden-hard', 'is-water-out');
      dock?.classList.remove('show');
      requestAnimationFrame(() => {
        if (animate) card.classList.add('is-water-in');
        setTimeout(() => card.classList.remove('is-water-in'), 380);
        scheduleNext();
      });
      return;
    }
    card.classList.remove('is-water-in', 'is-detail');
    $('#ayahRing')?.classList.remove('is-running');
    if (!animate) {
      card.classList.add('is-hidden-hard');
      dock?.classList.add('show');
      return;
    }
    card.classList.add('is-water-out');
    setTimeout(() => {
      card.classList.add('is-hidden-hard');
      dock?.classList.add('show');
    }, 350);
  }

  setVisible(shouldShow, false);

  on(document, 'omar:languagechange', paintAyah);
  on(document, 'visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(state.ayahTimer);
      $('#ayahRing')?.classList.remove('is-running');
    } else {
      scheduleNext();
    }
  });

  card.addEventListener('click', (event) => {
    if (event.target.closest('button')) return;
    if (state.drag?.moved) return;
    const open = card.classList.toggle('is-detail');
    const detail = $('#ayahDetail');
    if (detail) detail.hidden = !open;
  });

  eye?.addEventListener('click', (event) => {
    event.stopPropagation();
    setVisible(false);
  });
  dock?.addEventListener('click', () => setVisible(true));
  copyBtn?.addEventListener('click', (event) => {
    event.stopPropagation();
    copyText(copyPayload(), t('ayahCopied'));
  });
  newBtn?.addEventListener('click', (event) => {
    event.stopPropagation();
    state.ayahIndex = nextIndex();
    paintAyah();
    scheduleNext();
  });

  card.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    state.drag = {
      x: event.clientX,
      y: event.clientY,
      left: card.offsetLeft,
      top: card.offsetTop,
      dx: 0,
      dy: 0,
      moved: false
    };
    card.classList.add('is-dragging');
    card.setPointerCapture?.(event.pointerId);
  });

  card.addEventListener('pointermove', (event) => {
    if (!state.drag) return;
    state.drag.dx = event.clientX - state.drag.x;
    state.drag.dy = event.clientY - state.drag.y;
    if (Math.abs(state.drag.dx) + Math.abs(state.drag.dy) > 8) state.drag.moved = true;
    const maxX = innerWidth - card.offsetWidth - 8;
    const maxY = innerHeight - card.offsetHeight - 8;
    const nextLeft = Math.min(maxX, Math.max(8, state.drag.left + state.drag.dx));
    const nextTop = Math.min(maxY, Math.max(8, state.drag.top + state.drag.dy));
    card.style.insetInlineStart = `${nextLeft}px`;
    card.style.insetBlockStart = `${nextTop}px`;
    card.style.insetInlineEnd = 'auto';
    card.style.insetBlockEnd = 'auto';
  });

  const endDrag = () => {
    card.classList.remove('is-dragging');
    state.drag = null;
  };
  card.addEventListener('pointerup', endDrag);
  card.addEventListener('pointercancel', endDrag);
}

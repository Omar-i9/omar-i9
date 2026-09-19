import { $, $$ } from '../core/dom.js';
import { on } from '../core/events.js';
import { state } from '../core/state.js';

function getFocusable(root) {
  return $$('a[href], button:not([disabled]), input:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])', root)
    .filter((el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true');
}

export function openDialog(overlayId) {
  const overlay = $(`#${overlayId}`);
  if (!overlay) return;
  state.lastFocus = document.activeElement;
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  const panel = overlay.querySelector('[role="dialog"]') || overlay;
  const focusable = getFocusable(panel);
  (focusable[0] || panel).focus?.();
}

export function closeDialog(overlayId) {
  const overlay = overlayId ? $(`#${overlayId}`) : $('.overlay.is-open, .share-overlay.is-open, .version-overlay.is-open, .page-overlay.is-open');
  if (!overlay) return;
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  if (!$('.overlay.is-open, .share-overlay.is-open, .version-overlay.is-open, .page-overlay.is-open')) {
    document.body.classList.remove('modal-open');
  }
  state.lastFocus?.focus?.();
}

export function anyDialogOpen() {
  return Boolean($('.overlay.is-open, .share-overlay.is-open, .version-overlay.is-open, .page-overlay.is-open'));
}

export function initDialogs() {
  on(document, 'keydown', (event) => {
    if (event.key === 'Escape' && anyDialogOpen()) {
      closeDialog();
      const frame = $('#pageFrame');
      if (frame) frame.src = '';
    }
    if (event.key !== 'Tab') return;
    const overlay = $('.share-overlay.is-open, .version-overlay.is-open, .page-overlay.is-open');
    if (!overlay) return;
    const panel = overlay.querySelector('[role="dialog"]') || overlay;
    const nodes = getFocusable(panel);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

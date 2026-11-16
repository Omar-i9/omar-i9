export const $ = (selector, parent = document) => parent.querySelector(selector);
export const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function onReady(callback) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, { once: true });
  else callback();
}

export function safeStorageGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function safeStorageSet(key, value) {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}

export function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

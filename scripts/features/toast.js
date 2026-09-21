import { $ } from '../core/dom.js';

let timer = 0;

export function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('is-on'), 1700);
}

export async function copyText(value, okMessage) {
  const text = String(value ?? '');
  try {
    await navigator.clipboard.writeText(text);
    toast(okMessage);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.cssText = 'position:fixed;inset-inline-start:-9999px';
      document.body.append(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      toast(okMessage);
      return true;
    } catch {
      toast(okMessage);
      return false;
    }
  }
}

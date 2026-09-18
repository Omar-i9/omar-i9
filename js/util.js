const toastEl = () => document.getElementById('toast');
let toastTimer = 0;

export function toast(message) {
  const el = toastEl();
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 1600);
}

export async function copyText(value, okMessage) {
  try {
    await navigator.clipboard.writeText(value);
    toast(okMessage);
    return true;
  } catch {
    toast(okMessage);
    return false;
  }
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function externalRel() {
  return 'target="_blank" rel="noopener noreferrer"';
}

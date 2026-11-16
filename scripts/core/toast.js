let timer = 0;
export function toast(message, { type = 'info', duration = 2300 } = {}) {
  const node = document.getElementById('toast');
  if (!node) return;
  node.textContent = message;
  node.dataset.type = type;
  node.classList.add('is-visible');
  window.clearTimeout(timer);
  timer = window.setTimeout(() => node.classList.remove('is-visible'), duration);
}

export async function copyText(value, successMessage, failureMessage) {
  const text = String(value ?? '');
  if (!text) { toast(failureMessage || 'Nothing to copy', { type: 'error' }); return false; }
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    toast(successMessage || 'Copied', { type: 'success' });
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.readOnly = true;
      area.setAttribute('aria-hidden', 'true');
      area.style.cssText = 'position:fixed;inset-inline-start:-9999px;top:0;opacity:0';
      document.body.append(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      if (!ok) throw new Error('Copy failed');
      toast(successMessage || 'Copied', { type: 'success' });
      return true;
    } catch {
      toast(failureMessage || 'Copy failed', { type: 'error' });
      return false;
    }
  }
}

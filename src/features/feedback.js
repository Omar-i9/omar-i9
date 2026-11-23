let toastTimer = 0;

export function showToast(message) {
  const toast = document.getElementById('siteToast');
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2100);
}

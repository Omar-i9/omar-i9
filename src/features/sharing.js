import { translate } from '../core/i18n.js';
import { showToast } from './feedback.js';

async function copyText(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch { /* Use the legacy fallback below. */ }

  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  field.remove();
  return copied;
}

export function initSharing() {
  const dialog = document.getElementById('shareDialog');
  const openButton = document.getElementById('shareButton');
  const closeButton = document.getElementById('shareClose');
  const nativeButton = document.getElementById('nativeShareButton');
  const copyButton = document.getElementById('copyShareButton');
  if (!dialog || !openButton) return;

  const shareData = () => ({
    title: 'Omarr',
    text: document.documentElement.lang === 'ar'
      ? 'مساحتي الشخصية وحساباتي ومشاريعي.'
      : 'My personal space, accounts, and projects.',
    url: window.location.href
  });

  const openDialog = () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  const shareOrFallback = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData());
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    openDialog();
  };

  openButton.addEventListener('click', shareOrFallback);
  closeButton?.addEventListener('click', () => dialog.close?.());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close?.();
  });

  nativeButton?.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData());
        dialog.close?.();
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    const copied = await copyText(window.location.href);
    showToast(copied ? translate('shareCopied', 'Link copied') : translate('copyFailed', 'Could not copy the link'));
    if (copied) dialog.close?.();
  });

  copyButton?.addEventListener('click', async () => {
    const copied = await copyText(window.location.href);
    showToast(copied ? translate('shareCopied', 'Link copied') : translate('copyFailed', 'Could not copy'));
    if (copied) dialog.close?.();
  });
}

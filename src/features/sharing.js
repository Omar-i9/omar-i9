import QRCode from 'qrcode';
import { translate } from '../core/i18n.js';
import { showToast } from './feedback.js';

export function initSharing() {
  const dialog = document.getElementById('shareDialog');
  const openButton = document.getElementById('shareButton');
  const closeButton = document.getElementById('shareClose');
  const nativeButton = document.getElementById('nativeShareButton');
  const copyButton = document.getElementById('copyShareButton');
  const qrCanvas = document.getElementById('shareQrCanvas');
  if (!dialog || !openButton) return;

  const shareData = () => ({
    title: 'Omarr',
    text: document.documentElement.lang === 'ar'
      ? 'مساحتي الشخصية وحساباتي ومشاريعي.'
      : 'My personal space, accounts, and projects.',
    url: window.location.href
  });

  const renderQr = async () => {
    if (!qrCanvas) return;
    try {
      await QRCode.toCanvas(qrCanvas, window.location.href, {
        width: 144,
        margin: 1,
        errorCorrectionLevel: 'M',
        color: { dark: '#071421', light: '#ffffff' }
      });
    } catch {
      qrCanvas.hidden = true;
    }
  };

  const openDialog = () => {
    renderQr();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  openButton.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData());
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    openDialog();
  });
  closeButton?.addEventListener('click', () => dialog.close?.());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close?.();
  });
  nativeButton?.addEventListener('click', async () => {
    if (!navigator.share) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast(translate('shareCopied', 'Link copied'));
        dialog.close?.();
      } catch {
        showToast(translate('copyFailed', 'Could not copy the link'));
      }
      return;
    }
    try {
      await navigator.share(shareData());
      dialog.close?.();
    } catch (error) {
      if (error?.name !== 'AbortError') showToast(translate('copyFailed', 'Sharing is unavailable'));
    }
  });
  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(translate('shareCopied', 'Link copied'));
      dialog.close?.();
    } catch {
      showToast(translate('copyFailed', 'Could not copy'));
    }
  });
}

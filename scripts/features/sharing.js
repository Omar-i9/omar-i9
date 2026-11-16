import qrcode from '../vendor/qrcode-generator.js';
import { openDialog, closeDialog } from '../core/dialogs.js';
import { t } from '../core/i18n.js';
import { copyText, toast } from '../core/toast.js';

function siteUrl() {
  return new URL('./', window.location.href).href;
}

function drawQr(value) {
  const canvas = document.getElementById('shareQr');
  if (!canvas) return;
  const qr = qrcode(0, 'M');
  qr.addData(value);
  qr.make();
  const count = qr.getModuleCount();
  const size = 288;
  const cell = size / count;
  const context = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, size, size);
  context.fillStyle = '#0b1018';
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (qr.isDark(row, col)) context.fillRect(Math.floor(col * cell), Math.floor(row * cell), Math.ceil(cell), Math.ceil(cell));
    }
  }
}

function openShare() {
  const url = siteUrl();
  const field = document.getElementById('shareUrlInput');
  if (field) field.value = url;
  drawQr(url);
  openDialog('shareDialog');
}

async function nativeShare() {
  const url = siteUrl();
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Omar|عُمَر', text: t('shareText'), url });
      toast(t('shared', 'Shared'), { type: 'success' });
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }
  await copyText(url, t('copied'), t('copyFailed'));
}

export function initSharing() {
  document.getElementById('shareOpen')?.addEventListener('click', openShare);
  document.getElementById('shareOpenFloating')?.addEventListener('click', openShare);
  document.getElementById('nativeShareBtn')?.addEventListener('click', nativeShare);
  document.getElementById('copyShareBtn')?.addEventListener('click', () => copyText(siteUrl(), t('copied'), t('copyFailed')));
  document.querySelectorAll('[data-share-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const url = siteUrl();
      const target = button.dataset.shareTarget;
      if (target === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(`${t('shareText')} ${url}`)}`, '_blank', 'noopener,noreferrer');
      else {
        copyText(url, t('copied'), t('copyFailed'));
        window.open(target === 'instagram' ? 'https://www.instagram.com/' : 'https://www.snapchat.com/', '_blank', 'noopener,noreferrer');
      }
    });
  });
}

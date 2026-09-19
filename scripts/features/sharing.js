import qrcode from '../vendor/qrcode-generator.js';
import { $ } from '../core/dom.js';
import { on } from '../core/events.js';
import { siteUrl } from '../core/base-path.js';
import { t } from './language.js';
import { copyText, toast } from './toast.js';
import { openDialog, closeDialog } from './dialogs.js';
import { chromeIcon } from './icons.js';

function drawQr(text) {
  const canvas = $('#shareQr');
  if (!canvas) return;
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const count = qr.getModuleCount();
  const size = 320;
  const cell = size / count;
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  ctx.fillStyle = '#f7fbff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#050a12';
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (qr.isDark(row, col)) {
        ctx.fillRect(Math.floor(col * cell), Math.floor(row * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
  }
}

function openShare() {
  const url = siteUrl();
  const input = $('#shareUrlInput');
  if (input) input.value = url;
  drawQr(url);
  openDialog('shareOverlay');
  $('#sharePortalBtn')?.classList.add('is-active');
}

function closeShare() {
  closeDialog('shareOverlay');
  $('#sharePortalBtn')?.classList.remove('is-active');
}

async function nativeShare() {
  const url = siteUrl();
  if (navigator.share) {
    try {
      await navigator.share({
        title: t('shareNativeTitle'),
        text: t('shareNativeText'),
        url
      });
      toast(t('shared'));
      return;
    } catch {
      /* cancelled */
    }
  }
  await copyText(url, t('nativeShareUnavailable'));
}

async function shareTo(target) {
  const url = siteUrl();
  if (target === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${t('shareWhatsAppText')} ${url}`)}`, '_blank', 'noopener,noreferrer');
    return;
  }
  await copyText(url, t('shareFallbackCopied'));
  if (target === 'instagram') window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  if (target === 'snapchat') window.open('https://www.snapchat.com/', '_blank', 'noopener,noreferrer');
}

export function initSharing() {
  const fab = $('#sharePortalBtn');
  if (fab) fab.innerHTML = chromeIcon('share');
  on(document, 'omar:share', openShare);
  on(document, 'click', (event) => {
    if (event.target.closest('#sharePortalBtn')) openShare();
    if (event.target.closest('#closeShare') || event.target.id === 'shareOverlay') closeShare();
    if (event.target.closest('#copyShareBtn')) copyText($('#shareUrlInput')?.value, t('copied'));
    if (event.target.closest('#nativeShareBtn')) nativeShare();
    const target = event.target.closest('[data-share-target]')?.dataset.shareTarget;
    if (target) shareTo(target);
  });
}

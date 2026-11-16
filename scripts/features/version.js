import { release, siteVersionLabel } from '../../data/release.js';
import { currentLang, t } from '../core/i18n.js';
import { openDialog, closeDialog } from '../core/dialogs.js';

export function paintVersion() {
  const badge = document.getElementById('versionBadge');
  if (badge) badge.textContent = siteVersionLabel;
  const title = document.getElementById('versionTitle');
  const subtitle = document.getElementById('versionSubtitle');
  const tagline = document.getElementById('versionTagline');
  const date = document.getElementById('versionDate');
  const list = document.getElementById('versionList');
  if (title) title.textContent = release.version;
  if (subtitle) subtitle.textContent = t('versionSubtitle');
  if (tagline) tagline.textContent = t('versionTagline');
  if (date) date.textContent = release.date;
  if (list) list.innerHTML = t('versionChanges').map((item) => `<li>${item}</li>`).join('');
}

export function initVersion() {
  paintVersion();
  document.getElementById('versionBadge')?.addEventListener('click', () => openDialog('versionDialog'));
  document.getElementById('closeVersion')?.addEventListener('click', () => closeDialog('versionDialog'));
  document.addEventListener('omar:languagechange', paintVersion);
}

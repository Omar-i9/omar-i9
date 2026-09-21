import { release, siteVersionLabel } from '../../data/release.js';
import { $ } from '../core/dom.js';
import { on } from '../core/events.js';
import { currentLang, t } from './language.js';
import { openDialog, closeDialog } from './dialogs.js';

export function paintVersion() {
  const badge = $('#versionBadge');
  if (badge) badge.textContent = siteVersionLabel;
  const title = $('#versionTitle');
  const subtitle = $('#versionSubtitle');
  const date = $('#versionDate');
  const list = $('#versionList');
  const link = $('#versionGithub');
  if (title) title.textContent = release.version;
  if (subtitle) subtitle.textContent = release.name;
  const tagline = $('#versionTagline');
  if (tagline) tagline.textContent = t('releaseTagline', release.tagline || '');
  if (date) date.textContent = release.date;
  if (link) link.href = release.githubUrl;
  if (list) {
    const items = currentLang() === 'en' ? release.changesEn : release.changesAr;
    list.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
  }
}

export function initVersion() {
  paintVersion();
  on(document, 'omar:languagechange', paintVersion);
  on(document, 'click', (event) => {
    if (event.target.closest('#versionBadge')) openDialog('versionOverlay');
    if (event.target.closest('#closeVersion') || event.target.id === 'versionOverlay') closeDialog('versionOverlay');
  });
}

export { t };

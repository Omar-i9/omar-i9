import { taamenShowcase } from '../../data/projects.js';
import { t, currentLang, initLanguage } from '../core/i18n.js';
import { escapeHtml, onReady } from '../core/dom.js';
import { initWavesBackground } from '../background/waves.js';
import { initReveal } from '../core/reveal.js';
import { icon } from '../core/icons.js';

const value = (item) => item?.[currentLang()] ?? item?.ar ?? '';

function features() {
  return `<div class="taamen-feature-grid">${taamenShowcase.features.map((feature, index) => `<article class="taamen-feature" style="--feature-index:${index}"><span class="taamen-feature-icon">${icon(feature.icon)}</span><div><strong>${escapeHtml(currentLang() === 'en' ? feature.en.name : feature.ar.name)}</strong><p>${escapeHtml(currentLang() === 'en' ? feature.en.line : feature.ar.line)}</p></div></article>`).join('')}</div>`;
}
function timeline() {
  return `<div class="panel-note panel-note--amber"><strong>${escapeHtml(t('devTrack'))}</strong><p>${escapeHtml(t('devWarning'))}</p></div><ul class="status-list">${(currentLang() === 'en' ? taamenShowcase.developmentStatus.en : taamenShowcase.developmentStatus.ar).map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul><div class="dev-timeline">${taamenShowcase.timeline.map((entry) => `<article class="dev-entry"><span class="dev-entry-marker"></span><div class="dev-entry-top"><strong>${escapeHtml(entry.tag)}</strong><time>${escapeHtml(entry.date || '')}</time></div><p>${escapeHtml(currentLang() === 'en' ? entry.en : entry.ar)}</p></article>`).join('')}</div>`;
}
function internal() {
  const ideas = currentLang() === 'en' ? taamenShowcase.unannouncedTrack.en : taamenShowcase.unannouncedTrack.ar;
  return `<div class="panel-note panel-note--violet"><strong>${escapeHtml(t('labTrack'))}</strong><p>${escapeHtml(t('internalWarning'))}</p></div><div class="internal-ideas">${ideas.map((idea, index) => `<article class="internal-idea"><span class="internal-idea-index">0${index + 1}</span><div><strong>${escapeHtml(idea.title)}</strong><p>${escapeHtml(idea.detail)}</p></div><span class="idea-state">${escapeHtml(t('internalFeature'))}</span></article>`).join('')}</div><p class="project-private-note">${escapeHtml(value(taamenShowcase.note))}</p>`;
}
function paint() {
  const lead = document.getElementById('taamenHeroLead');
  if (lead) lead.textContent = value(taamenShowcase.heroLead);
  const published = document.getElementById('taamenPublished');
  if (published) published.innerHTML = `<div class="taamen-published-head"><div><span class="eyebrow">${escapeHtml(t('liveVersion'))}</span><h4>TAAMEN 2.0 <span>v2.0.0</span></h4><p>${escapeHtml(value(taamenShowcase.overview))}</p></div><div class="taamen-live-stamp"><i class="live-dot"></i><strong>${escapeHtml(value(taamenShowcase.productStatus))}</strong></div></div>${features()}<div class="taamen-actions"><a class="project-action project-action--primary" href="https://taamenn.com/" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openLive'))}${icon('arrow')}</a></div>`;
  const development = document.getElementById('taamenDevelopment');
  if (development) development.innerHTML = timeline();
  const lab = document.getElementById('taamenLab');
  if (lab) lab.innerHTML = internal();
}
function initTabs() {
  const root = document.getElementById('taamenPageShowcase');
  root?.querySelectorAll('[data-page-tab]').forEach((button) => button.addEventListener('click', () => {
    const name = button.dataset.pageTab;
    root.querySelectorAll('[data-page-tab]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
      item.tabIndex = active ? 0 : -1;
    });
    root.querySelectorAll('[data-page-pane]').forEach((pane) => {
      pane.hidden = pane.dataset.pagePane !== name;
      pane.classList.toggle('is-active', pane.dataset.pagePane === name);
    });
  }));
}
onReady(() => {
  initLanguage();
  initWavesBackground(document.getElementById('wavesCanvas'));
  initReveal();
  initTabs();
  paint();
  document.addEventListener('omar:languagechange', paint);
});

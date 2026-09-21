import { projects } from '../../data/projects.js';
import { $, escapeHtml } from '../core/dom.js';
import { on } from '../core/events.js';
import { withBase } from '../core/base-path.js';
import { t } from './language.js';
import { chromeIcon } from './icons.js';

function statusTone(statusKey) {
  if (statusKey === 'statusActive') return 'is-active';
  if (statusKey === 'statusLegacy') return 'is-legacy';
  return 'is-beta';
}

function hudMarkup(hud) {
  if (!hud) return '';
  return `
    <div class="project-hud" dir="ltr" aria-hidden="true">
      <span><b data-hud="speed">${escapeHtml(hud.speed)}</b><small>km/h</small></span>
      <span><b data-hud="soc">${escapeHtml(hud.soc)}</b><small>SOC%</small></span>
      <span><b data-hud="power">${escapeHtml(hud.power)}</b><small>kW</small></span>
      <span><b data-hud="temp">${escapeHtml(hud.temp)}</b><small>°C</small></span>
    </div>`;
}

function renderVisual(project) {
  if (project.image) {
    const src = escapeHtml(withBase(project.image));
    const fallback = escapeHtml(withBase(project.imageFallback || project.image));
    const img = project.imageFallback
      ? `<picture><source srcset="${src}" type="image/webp"><img src="${fallback}" alt="" width="88" height="88" loading="${project.featured ? 'eager' : 'lazy'}" decoding="async"></picture>`
      : `<img src="${src}" alt="" width="88" height="88" loading="${project.featured ? 'eager' : 'lazy'}" decoding="async">`;
    return `<div class="project-visual"><div class="project-logo-shell">${img}</div></div>`;
  }
  return `<div class="project-visual"><div class="project-logo-shell"><span class="project-bolt" aria-hidden="true">⚡</span></div></div>`;
}

function renderActions(project) {
  const items = [];
  if (project.liveUrl) {
    const label = escapeHtml(t(project.openKey || 'projectOpenLive', t('projectOpenLive')));
    items.push(`<a class="project-action is-primary" href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer">${label} ${chromeIcon('arrow')}</a>`);
  }
  if (project.pageUrl) {
    items.push(`<a class="project-action is-secondary" href="${escapeHtml(withBase(project.pageUrl))}">${escapeHtml(t('projectCaseStudy', 'Case study'))}</a>`);
  }
  if (project.repositoryUrl) {
    items.push(`<a class="project-action is-tertiary" href="${escapeHtml(project.repositoryUrl)}" target="_blank" rel="noopener noreferrer">${chromeIcon('github')}<span>${escapeHtml(t('projectGithub', 'Repository'))}</span></a>`);
  }
  if (!items.length) return '';
  return `<nav class="project-actions" aria-label="${escapeHtml(t('projectLinks', 'Links'))}">${items.join('')}</nav>`;
}

function renderProjectAcquisition(project) {
  const acq = project.acquisition;
  if (!acq?.enabled || !acq.url) return '';
  const price = acq.price
    ? `<span class="project-acquisition-price" dir="ltr">${escapeHtml(acq.price)}</span>`
    : '';
  const nego = acq.negotiable
    ? `<span class="project-acquisition-nego">${escapeHtml(t('projectAcquisitionNegotiable'))}</span>`
    : '';
  const meta = [price, nego].filter(Boolean).join('<span class="project-acquisition-sep" aria-hidden="true"> · </span>');
  return `
    <div class="project-acquisition">
      <p class="project-acquisition-label">${escapeHtml(t('projectAcquisitionLabel'))}</p>
      <p class="project-acquisition-title">${escapeHtml(t('projectAcquisitionTitle'))}</p>
      ${meta ? `<p class="project-acquisition-meta">${meta}</p>` : ''}
      <a class="project-acquisition-open" href="${escapeHtml(acq.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('projectAcquisitionOpen'))} ${chromeIcon('arrow')}</a>
    </div>`;
}

export function renderProjects() {
  const wrap = $('#projectsList');
  if (!wrap) return;
  wrap.innerHTML = projects.map((project, index) => {
    const title = escapeHtml(t(project.titleKey, project.id));
    const subtitle = escapeHtml(t(project.subtitleKey, ''));
    const short = escapeHtml(t(project.shortKey, ''));
    const status = escapeHtml(t(project.statusKey, project.status));
    const category = escapeHtml(t(project.categoryKey, ''));
    const tech = (project.technologies || []).slice(0, 6).map((item) => `<span>${escapeHtml(item)}</span>`).join('');
    const version = project.version ? `<span class="project-version" dir="ltr">${escapeHtml(project.version)}</span>` : '';
    const cold = project.id === 'ev-telemetry'
      ? `<p class="project-note" data-i18n="evColdStart">${escapeHtml(t('evColdStart'))}</p>`
      : '';
    const featured = project.featured ? ' is-featured' : '';
    return `
      <article class="project-card${featured} reveal" data-project="${escapeHtml(project.id)}" style="--delay:${index * 80}ms">
        <div class="project-card-layout">
          ${renderVisual(project)}
          <div class="project-body">
            <div class="project-meta">
              <span class="project-status ${statusTone(project.statusKey)}">${status}</span>
              <span class="project-cat">${category}</span>
              ${version}
            </div>
            <h3>${title}</h3>
            <p class="project-sub">${subtitle}</p>
            <p class="project-short">${short}</p>
            ${cold}
            ${hudMarkup(project.hud)}
            <div class="project-tech" aria-label="${escapeHtml(t('projectTech', 'Tech'))}">${tech}</div>
            ${renderActions(project)}
            ${renderProjectAcquisition(project)}
          </div>
        </div>
      </article>`;
  }).join('');
}

function tickHud() {
  const card = document.querySelector('.project-hud');
  if (card) {
    const speed = card.querySelector('[data-hud="speed"]');
    const soc = card.querySelector('[data-hud="soc"]');
    const power = card.querySelector('[data-hud="power"]');
    const temp = card.querySelector('[data-hud="temp"]');
    const wave = (base, amp, period) => {
      const tNow = Date.now() / period;
      return (base + Math.sin(tNow) * amp).toFixed(amp < 2 ? 1 : 0);
    };
    if (speed) speed.textContent = wave(75, 4, 1800);
    if (soc) soc.textContent = wave(85, 0.4, 4200);
    if (power) power.textContent = wave(14.5, 1.2, 1600);
    if (temp) temp.textContent = wave(32, 1.1, 2600);
  }
  requestAnimationFrame(tickHud);
}

export function initProjects() {
  renderProjects();
  on(document, 'omar:languagechange', renderProjects);
  tickHud();
}

import { projects, hasCapability } from '../../data/projects.js';
import { $, escapeHtml } from '../core/dom.js';
import { on } from '../core/events.js';
import { withBase } from '../core/base-path.js';
import { t } from './language.js';
import { chromeIcon } from './icons.js';

let selectedId = null;
let hudLoopStarted = false;

function statusTone(statusKey) {
  if (statusKey === 'statusActive') return 'is-active';
  if (statusKey === 'statusLegacy') return 'is-legacy';
  return 'is-beta';
}

function can(project, capability) {
  return hasCapability(project, capability);
}

function hudMarkup(hud, compact) {
  if (!hud) return '';
  if (compact) {
    return `
      <div class="project-hud is-hint" dir="ltr" aria-hidden="true">
        <span><b data-hud="speed">${escapeHtml(hud.speed)}</b><small>km/h</small></span>
        <span><b data-hud="soc">${escapeHtml(hud.soc)}</b><small>SOC</small></span>
      </div>`;
  }
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
      ? `<picture><source srcset="${src}" type="image/webp"><img src="${fallback}" alt="" width="56" height="56" loading="${project.featured ? 'eager' : 'lazy'}" decoding="async"></picture>`
      : `<img src="${src}" alt="" width="56" height="56" loading="${project.featured ? 'eager' : 'lazy'}" decoding="async">`;
    return `<div class="project-visual"><div class="project-logo-shell">${img}</div></div>`;
  }
  return `<div class="project-visual"><div class="project-logo-shell"><span class="project-bolt" aria-hidden="true">⚡</span></div></div>`;
}

function renderActions(project) {
  const items = [];
  if (can(project, 'live') && project.liveUrl) {
    const label = escapeHtml(t(project.openKey || 'projectOpenLive', t('projectOpenLive')));
    items.push(`<a class="project-action is-primary" href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer">${label} ${chromeIcon('arrow')}</a>`);
  }
  if (can(project, 'acquisition') && project.acquisition?.enabled && project.acquisition.url) {
    items.push(`<a class="project-action is-acquisition" href="${escapeHtml(project.acquisition.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('projectAcquisitionOpen'))}</a>`);
  }
  if (can(project, 'repository') && project.repositoryUrl) {
    items.push(`<a class="project-action is-tertiary" href="${escapeHtml(project.repositoryUrl)}" target="_blank" rel="noopener noreferrer">${chromeIcon('github')}<span>${escapeHtml(t('projectGithub', 'Repository'))}</span></a>`);
  }
  if (can(project, 'caseStudy') && project.pageUrl) {
    items.push(`<a class="project-action is-secondary" href="${escapeHtml(withBase(project.pageUrl))}">${escapeHtml(t('projectCaseStudy', 'Case study'))}</a>`);
  }
  if (!items.length) return '';
  return `<nav class="project-actions">${items.join('')}</nav>`;
}

function renderProjectAcquisition(project) {
  const acq = project.acquisition;
  if (!can(project, 'acquisition') || !acq?.enabled || !acq.url) return '';
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
    </div>`;
}

function renderProjectMedia(project) {
  const shots = project.media?.screenshots || [];
  const video = project.media?.video;
  if (!shots.length && !video) return '';
  const gallery = shots.map((shot) => {
    const src = escapeHtml(withBase(shot.src));
    const alt = escapeHtml(shot.alt || '');
    return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
  }).join('');
  const vid = video?.src
    ? `<video class="project-video" poster="${escapeHtml(withBase(video.poster || ''))}" controls playsinline preload="metadata"><source src="${escapeHtml(withBase(video.src))}" type="${escapeHtml(video.type || 'video/mp4')}"></video>`
    : '';
  return `<div class="project-media">${vid}${gallery ? `<div class="project-shots">${gallery}</div>` : ''}</div>`;
}

export function renderProjects() {
  const wrap = $('#projectsList');
  if (!wrap) return;
  wrap.innerHTML = projects.map((project, index) => {
    const open = selectedId === project.id;
    const title = escapeHtml(t(project.titleKey, project.id));
    const subtitle = escapeHtml(t(project.subtitleKey, ''));
    const short = escapeHtml(t(project.shortKey, ''));
    const status = escapeHtml(t(project.statusKey, project.status));
    const category = escapeHtml(t(project.categoryKey, ''));
    const version = project.version ? `<span class="project-version" dir="ltr">${escapeHtml(project.version)}</span>` : '';
    const cold = project.id === 'ev-telemetry' && open
      ? `<p class="project-note">${escapeHtml(t('evColdStart'))}</p>`
      : '';
    const featured = project.featured ? ' is-featured' : '';
    const panelId = `project-panel-${escapeHtml(project.id)}`;
    const expandLabel = open ? t('projectCollapse') : t('projectExpand');
    return `
      <article class="project-row${featured}${open ? ' is-open' : ''} reveal" data-project="${escapeHtml(project.id)}" style="--delay:${index * 80}ms">
        <button class="project-row-header" type="button" aria-expanded="${open ? 'true' : 'false'}" aria-controls="${panelId}" data-project-toggle="${escapeHtml(project.id)}" aria-label="${escapeHtml(expandLabel)} — ${title}">
          ${renderVisual(project)}
          <div class="project-row-copy">
            <div class="project-row-top">
              <h3>${title}</h3>
              <p class="project-meta">
                <span class="project-status ${statusTone(project.statusKey)}">${status}</span>
                <span class="project-cat">${category}</span>
                ${version}
              </p>
            </div>
            <p class="project-sub">${subtitle}</p>
            ${!open ? hudMarkup(project.hud, true) : ''}
          </div>
          <span class="project-chevron" aria-hidden="true">${chromeIcon('arrow')}</span>
        </button>
        <div class="project-row-panel" id="${panelId}"${open ? '' : ' inert'}>
          <div class="project-row-panel-inner">
            <p class="project-short">${short}</p>
            ${cold}
            ${open ? hudMarkup(project.hud, false) : ''}
            ${renderProjectAcquisition(project)}
            ${renderActions(project)}
            ${open ? renderProjectMedia(project) : ''}
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
  on(document, 'click', (event) => {
    const toggle = event.target.closest?.('[data-project-toggle]');
    if (!toggle) return;
    const id = toggle.getAttribute('data-project-toggle');
    selectedId = selectedId === id ? null : id;
    renderProjects();
    document.querySelector(`[data-project-toggle="${id}"]`)?.focus();
  });
  if (!hudLoopStarted) {
    hudLoopStarted = true;
    tickHud();
  }
}

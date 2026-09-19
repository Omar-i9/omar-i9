import { projects } from '../../data/projects.js';
import { $, escapeHtml } from '../core/dom.js';
import { on } from '../core/events.js';
import { withBase } from '../core/base-path.js';
import { t } from './language.js';
import { chromeIcon } from './icons.js';

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

export function renderProjects() {
  const wrap = $('#projectsList');
  if (!wrap) return;
  wrap.innerHTML = projects.map((project, index) => {
    const title = escapeHtml(t(project.titleKey, project.id));
    const subtitle = escapeHtml(t(project.subtitleKey, ''));
    const short = escapeHtml(t(project.shortKey, ''));
    const status = escapeHtml(t(project.statusKey, project.status));
    const category = escapeHtml(t(project.categoryKey, ''));
    const href = escapeHtml(withBase(project.pageUrl));
    const visual = project.image
      ? `<img src="${escapeHtml(withBase(project.image))}" alt="" width="88" height="88" loading="lazy" decoding="async">`
      : '<span class="project-bolt" aria-hidden="true">⚡</span>';
    const tech = (project.technologies || []).slice(0, 6).map((item) => `<span>${escapeHtml(item)}</span>`).join('');
    const version = project.version ? `<span class="project-version" dir="ltr">${escapeHtml(project.version)}</span>` : '';
    const cold = project.id === 'ev-telemetry'
      ? `<p class="project-note" data-i18n="evColdStart">${escapeHtml(t('evColdStart'))}</p>`
      : '';
    return `
      <article class="project-card ${project.featured ? 'is-featured' : ''} reveal" style="--delay:${index * 80}ms">
        <a class="project-card-link" href="${href}">
          <div class="project-visual">${visual}</div>
          <div class="project-body">
            <div class="project-meta">
              <span class="project-status">${status}</span>
              <span class="project-cat">${category}</span>
              ${version}
            </div>
            <h3>${title}</h3>
            <p class="project-sub">${subtitle}</p>
            <p class="project-short">${short}</p>
            ${cold}
            ${hudMarkup(project.hud)}
            <div class="project-tech" aria-label="${escapeHtml(t('projectTech', 'Tech'))}">${tech}</div>
            <span class="project-go">${escapeHtml(t('projectCaseStudy', 'Case study'))} ${chromeIcon('arrow')}</span>
          </div>
        </a>
      </article>`;
  }).join('');
}

function tickHud() {
  const card = document.querySelector('.project-hud');
  if (!card) return;
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
  requestAnimationFrame(tickHud);
}

export function initProjects() {
  renderProjects();
  on(document, 'omar:languagechange', renderProjects);
  tickHud();
}

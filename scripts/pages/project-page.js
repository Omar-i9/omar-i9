import { getProject, hasCapability, taamenShowcase, evShowcase } from '../../data/projects.js';
import { release } from '../../data/release.js';
import { $, escapeHtml } from '../core/dom.js';
import { withBase } from '../core/base-path.js';
import { detectPerformance } from '../core/performance.js';
import { initLanguage, currentLang, t, applyLanguage, savedLanguage } from '../features/language.js';
import { initDialogs } from '../features/dialogs.js';
import { initReveal } from '../motion/reveal.js';
import { chromeIcon } from '../features/icons.js';

function statusTone(statusKey) {
  if (statusKey === 'statusActive') return 'is-active';
  if (statusKey === 'statusLegacy') return 'is-legacy';
  return 'is-beta';
}

function langText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return currentLang() === 'en' ? value.en : value.ar;
}

function featureIcon(name) {
  return `<span class="feat-glyph" data-icon="${escapeHtml(name)}"></span>`;
}

export function renderProjectShell(projectId) {
  const project = getProject(projectId);
  if (!project) return;
  const title = t(project.titleKey, project.id);
  const subtitle = t(project.subtitleKey, '');
  const status = t(project.statusKey, project.status);
  const root = $('#projectRoot');
  if (!root) return;

  const lang = currentLang();
  const actions = [
    hasCapability(project, 'live') && project.liveUrl
      ? `<a class="btn btn-primary" href="${escapeHtml(project.liveUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t(project.openKey || 'projectOpenLive'))}</a>`
      : '',
    hasCapability(project, 'acquisition') && project.acquisition?.url
      ? `<a class="btn btn-ghost" href="${escapeHtml(project.acquisition.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('projectAcquisitionOpen'))}</a>`
      : '',
    hasCapability(project, 'repository') && project.repositoryUrl
      ? `<a class="btn" href="${escapeHtml(project.repositoryUrl)}" target="_blank" rel="noopener noreferrer">${chromeIcon('github')}<span>${escapeHtml(t('projectGithub'))}</span></a>`
      : '',
    hasCapability(project, 'caseStudy') && project.pageUrl
      ? `<a class="btn" href="${escapeHtml(withBase(project.pageUrl))}">${escapeHtml(t('projectCaseStudy'))}</a>`
      : '',
    hasCapability(project, 'releases') && project.releasesUrl
      ? `<a class="btn" href="${escapeHtml(project.releasesUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('projectReleases'))}</a>`
      : '',
    hasCapability(project, 'pages') && project.pagesUrl
      ? `<a class="btn btn-ghost" href="${escapeHtml(project.pagesUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('projectPagesMirror'))}</a>`
      : ''
  ].filter(Boolean).join('');

  document.title = `${title} | Omar Profiles`;
  const visual = project.image
    ? `<div class="project-hero-mark"><picture><source srcset="${escapeHtml(withBase(project.image))}" type="image/webp"><img class="project-logo" src="${escapeHtml(withBase(project.imageFallback || project.image))}" alt="${escapeHtml(title)}" width="96" height="96"></picture></div>`
    : '<div class="project-hero-mark is-bolt" aria-hidden="true">⚡</div>';
  let extra = '';
  if (projectId === 'taamenn') extra = renderTaamen(lang);
  if (projectId === 'ev-telemetry') extra = renderEv(lang);

  root.innerHTML = `
    <header class="project-topbar reveal">
      <a class="crumb" href="${escapeHtml(withBase('index.html'))}">${chromeIcon('arrow')}<span data-i18n="projectBack">${escapeHtml(t('projectBack'))}</span></a>
      <button id="langToggleBtn" class="lang-toggle${lang === 'en' ? ' is-en' : ' is-ar'}" type="button" data-i18n-aria="ariaBtn" aria-label="${escapeHtml(t('ariaBtn'))}">
        <span class="lang-pair">
          <span data-lang-ar>AR</span>
          <span class="lang-sep" aria-hidden="true">/</span>
          <span data-lang-en>EN</span>
        </span>
      </button>
    </header>
    <section class="project-hero reveal">
      <div class="project-hero-visual">${visual}</div>
      <div class="project-hero-copy">
        <div class="project-meta-row">
          <span class="project-status ${statusTone(project.statusKey)}">${escapeHtml(status)}</span>
          ${project.version ? `<span class="project-version" dir="ltr">${escapeHtml(project.version)}</span>` : ''}
          ${project.versionDate ? `<span class="project-date" dir="ltr">${escapeHtml(project.versionDate)}</span>` : ''}
        </div>
        <h1>${escapeHtml(title)}</h1>
        <p class="lede">${escapeHtml(subtitle)}</p>
        <div class="hero-actions-row">${actions}</div>
        <ul class="tech-row">${(project.technologies || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
    </section>
    ${extra}
    <section class="project-links reveal">
      <h2 data-i18n="projectLinks">${escapeHtml(t('projectLinks'))}</h2>
      <div class="hero-actions-row">${actions}</div>
      <p class="site-ver" dir="ltr">${escapeHtml(release.version)} • ${escapeHtml(release.name)}</p>
    </section>
  `;
}

function renderTaamen(lang) {
  const s = taamenShowcase;
  const current = getProject('taamenn');
  const features = s.features.map((item, i) => `
    <article class="feat-card reveal" style="--delay:${i * 40}ms">
      ${featureIcon(item.icon)}
      <h3>${escapeHtml(item[lang].name)}</h3>
      <p>${escapeHtml(item[lang].line)}</p>
    </article>`).join('');
  const layers = s.architectureLayers.map((item) => `<li>${escapeHtml(langText(item))}</li>`).join('');
  const timeline = s.timeline.map((item) => `
    <li class="time-item reveal">
      <span class="time-tag" dir="ltr">${escapeHtml(item.tag)}</span>
      <span class="time-date" dir="ltr">${escapeHtml(item.date || t('dateUnspecified'))}</span>
      <p>${escapeHtml(lang === 'en' ? item.en : item.ar)}</p>
    </li>`).join('');
  return `
    <section class="project-block reveal">
      <h2 data-i18n="projectOverview">${escapeHtml(t('projectOverview'))}</h2>
      <p class="lede">${escapeHtml(langText(s.heroLead))}</p>
      <p>${escapeHtml(langText(s.overview))}</p>
    </section>
    <section class="project-block reveal">
      <h2 data-i18n="projectFeatures">${escapeHtml(t('projectFeatures'))}</h2>
      <div class="feat-grid">${features}</div>
    </section>
    <section class="project-block reveal">
      <h2 data-i18n="projectArchitecture">${escapeHtml(t('projectArchitecture'))}</h2>
      <ol class="arch-list">${layers}</ol>
    </section>
    <section class="project-block reveal">
      <h2 data-i18n="projectTimeline">${escapeHtml(t('projectTimeline'))}</h2>
      <ol class="time-list">${timeline}</ol>
    </section>
    <section class="project-block reveal">
      <h2 data-i18n="projectVisuals">${escapeHtml(t('projectVisuals'))}</h2>
      <p>${escapeHtml(langText(s.visualsNote))}</p>
    </section>
    <section class="project-block reveal">
      <h2 data-i18n="projectCurrent">${escapeHtml(t('projectCurrent'))}</h2>
      <p>${escapeHtml(t('projectName'))} · <span dir="ltr">${escapeHtml(current?.version || '')}</span> · ${escapeHtml(t(current?.statusKey || 'statusActive'))}</p>
      ${current?.acquisition?.enabled && current.acquisition.url ? `
      <p class="muted">${escapeHtml(t('projectAcquisitionLabel'))} · ${escapeHtml(t('projectAcquisitionTitle'))} · <span dir="ltr">${escapeHtml(current.acquisition.price || '')}</span> · ${escapeHtml(t('projectAcquisitionNegotiable'))}</p>` : ''}
    </section>`;
}

function renderEv(lang) {
  const s = evShowcase;
  const highs = s.highlights.map((item) => `<li>${escapeHtml(langText(item))}</li>`).join('');
  return `
    <section class="project-block reveal">
      <h2 data-i18n="projectOverview">${escapeHtml(t('projectOverview'))}</h2>
      <p>${escapeHtml(langText(s.overview))}</p>
    </section>
    <section class="project-block reveal">
      <h2 data-i18n="projectHighlights">${escapeHtml(t('projectHighlights'))}</h2>
      <ul class="ev-highs">${highs}</ul>
      <p class="muted">${escapeHtml(langText(s.note))}</p>
    </section>`;
}

export function bootProjectPage(projectId) {
  detectPerformance();
  applyLanguage(savedLanguage());
  initLanguage();
  initDialogs();
  const paint = () => {
    renderProjectShell(projectId);
    requestAnimationFrame(() => {
      document.body.classList.add('site-ready');
      initReveal();
    });
  };
  paint();
  document.addEventListener('omar:languagechange', () => {
    renderProjectShell(projectId);
    initReveal();
  });
}

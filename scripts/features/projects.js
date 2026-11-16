import { projects, taamenShowcase, evShowcase } from '../../data/projects.js';
import { escapeHtml } from '../core/dom.js';
import { currentLang, t } from '../core/i18n.js';
import { icon } from '../core/icons.js';
import { clearReveals, observeReveals } from '../core/reveal.js';

let openProjectId = null;

function langValue(value) {
  return value?.[currentLang()] ?? value?.ar ?? '';
}

function projectLogo(project) {
  if (project.image) {
    const source = escapeHtml(project.image);
    const fallback = escapeHtml(project.imageFallback || project.image);
    return `<picture><source srcset="${source}" type="image/webp"><img class="project-logo" src="${fallback}" alt="" width="68" height="68" loading="lazy" decoding="async"></picture>`;
  }
  return `<span class="project-logo project-logo--ev">${icon('bolt')}</span>`;
}

function actionLink(href, label, kind = 'secondary', external = true) {
  if (!href) return '';
  const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="project-action project-action--${kind}" href="${escapeHtml(href)}"${attrs}>${escapeHtml(label)}${icon('arrow')}</a>`;
}

function chips(items) {
  return `<div class="tech-chips">${items.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>`;
}

function renderFeatureGrid() {
  return `<div class="taamen-feature-grid">${taamenShowcase.features.map((feature, index) => `
    <article class="taamen-feature" style="--feature-index:${index}">
      <span class="taamen-feature-icon">${icon(feature.icon)}</span>
      <div><strong>${escapeHtml(langValue({ ar: feature.ar.name, en: feature.en.name }))}</strong><p>${escapeHtml(langValue({ ar: feature.ar.line, en: feature.en.line }))}</p></div>
    </article>`).join('')}</div>`;
}

function renderTimeline() {
  return `<div class="dev-timeline">${taamenShowcase.timeline.map((entry, index) => `
    <article class="dev-entry" style="--entry-index:${index}">
      <span class="dev-entry-marker" aria-hidden="true"></span>
      <div class="dev-entry-top"><strong>${escapeHtml(entry.tag)}</strong><time>${escapeHtml(entry.date || '')}</time></div>
      <p>${escapeHtml(currentLang() === 'en' ? entry.en : entry.ar)}</p>
    </article>`).join('')}</div>`;
}

function renderDevelopmentStatus() {
  const list = currentLang() === 'en' ? taamenShowcase.developmentStatus.en : taamenShowcase.developmentStatus.ar;
  return `<ul class="status-list">${list.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`;
}

function renderInternalLab() {
  const list = currentLang() === 'en' ? taamenShowcase.unannouncedTrack.en : taamenShowcase.unannouncedTrack.ar;
  return `<div class="internal-ideas">${list.map((idea, index) => `
    <article class="internal-idea" style="--idea-index:${index}">
      <span class="internal-idea-index">0${index + 1}</span>
      <div><strong>${escapeHtml(idea.title)}</strong><p>${escapeHtml(idea.detail)}</p></div>
      <span class="idea-state">${escapeHtml(t('internalFeature'))}</span>
    </article>`).join('')}</div>`;
}

function renderTaamenPanel(project) {
  const lead = langValue(taamenShowcase.heroLead);
  const overview = langValue(taamenShowcase.overview);
  const status = langValue(taamenShowcase.productStatus);
  const note = langValue(taamenShowcase.note);
  const layers = taamenShowcase.architectureLayers.map((layer) => escapeHtml(currentLang() === 'en' ? layer.en : layer.ar));
  return `
    <div class="project-panel-inner project-panel-inner--taamen">
      <nav class="project-tabs" aria-label="${escapeHtml(t('projectDetails'))}" role="tablist">
        <button class="project-tab is-active" type="button" role="tab" aria-selected="true" data-project-tab="published">${escapeHtml(t('liveProduct'))}</button>
        <button class="project-tab" type="button" role="tab" aria-selected="false" data-project-tab="development">${escapeHtml(t('devTrack'))}</button>
        <button class="project-tab" type="button" role="tab" aria-selected="false" data-project-tab="lab">${escapeHtml(t('labTrack'))}</button>
      </nav>
      <section class="project-pane is-active" data-project-pane="published" role="tabpanel">
        <div class="taamen-published-head">
          <div><span class="eyebrow">${escapeHtml(t('liveVersion'))}</span><h4>TAAMEN 2.0 <span>v2.0.0</span></h4><p>${escapeHtml(overview)}</p></div>
          <div class="taamen-live-stamp"><span class="live-dot"></span><strong>${escapeHtml(status)}</strong><small>taamenn.com</small></div>
        </div>
        <p class="taamen-lead">${escapeHtml(lead)}</p>
        ${renderFeatureGrid()}
        <div class="architecture-strip"><span>${escapeHtml(t('architecture'))}</span>${layers.map((layer) => `<b>${layer}</b>`).join('<i aria-hidden="true">→</i>')}</div>
        <div class="taamen-actions">${actionLink(project.liveUrl, t('openLive'), 'primary')}${actionLink(project.pageUrl, t('projectDetails'), 'secondary', false)}</div>
      </section>
      <section class="project-pane" data-project-pane="development" role="tabpanel" hidden>
        <div class="panel-note panel-note--amber"><strong>${escapeHtml(t('devTrack'))}</strong><p>${escapeHtml(t('devWarning'))}</p></div>
        ${renderDevelopmentStatus()}
        ${renderTimeline()}
      </section>
      <section class="project-pane" data-project-pane="lab" role="tabpanel" hidden>
        <div class="panel-note panel-note--violet"><strong>${escapeHtml(t('labTrack'))}</strong><p>${escapeHtml(t('internalWarning'))}</p></div>
        ${renderInternalLab()}
        <p class="project-private-note">${escapeHtml(note)}</p>
      </section>
    </div>`;
}

function renderEvPanel(project) {
  const overview = langValue(evShowcase.overview);
  const note = langValue(evShowcase.note);
  const highlights = evShowcase.highlights.map((item) => currentLang() === 'en' ? item.en : item.ar);
  return `<div class="project-panel-inner project-panel-inner--ev">
    <div class="ev-overview"><span class="eyebrow">${escapeHtml(t('projectOverview'))}</span><p>${escapeHtml(overview)}</p></div>
    <div class="ev-highlights">${highlights.map((item, index) => `<span style="--feature-index:${index}">${icon('bolt')}${escapeHtml(item)}</span>`).join('')}</div>
    <p class="project-private-note">${escapeHtml(note)}</p>
    <div class="taamen-actions">${actionLink(project.liveUrl, t('openLive'), 'primary')}${actionLink(project.repositoryUrl, t('projectGithub'), 'secondary')}</div>
    ${chips(project.technologies)}
  </div>`;
}

function renderProject(project, index) {
  const title = t(project.titleKey, project.id);
  const subtitle = t(project.subtitleKey, '');
  const status = t(project.statusKey, project.status);
  const panelId = `project-panel-${project.id}`;
  const isTaamen = project.id === 'taamenn';
  const mark = projectLogo(project);
  return `<article class="project-card project-card--${escapeHtml(project.id)} ${project.featured ? 'is-featured' : ''}" data-project-card="${escapeHtml(project.id)}" data-reveal style="--card-index:${index}">
    <button class="project-card-head" type="button" data-project-toggle="${escapeHtml(project.id)}" aria-expanded="false" aria-controls="${panelId}">
      ${mark}
      <span class="project-card-main">
        <span class="project-card-kicker"><span class="project-state"><i></i>${escapeHtml(status)}</span><span>${escapeHtml(t(project.categoryKey, ''))}</span></span>
        <strong class="project-card-title">${escapeHtml(title)}</strong>
        <span class="project-card-subtitle">${escapeHtml(subtitle)}</span>
        <span class="project-card-version" dir="ltr">${escapeHtml(project.version || (isTaamen ? 'v2.0.0' : ''))}</span>
      </span>
      <span class="project-toggle-icon" aria-hidden="true">${icon('chevron')}</span>
    </button>
    <div class="project-panel" id="${panelId}" hidden inert aria-hidden="true">
      ${isTaamen ? renderTaamenPanel(project) : renderEvPanel(project)}
    </div>
  </article>`;
}

function setProjectTab(card, tabName) {
  const tabs = card.querySelectorAll('[data-project-tab]');
  const panes = card.querySelectorAll('[data-project-pane]');
  tabs.forEach((button) => {
    const active = button.dataset.projectTab === tabName;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
    button.tabIndex = active ? 0 : -1;
  });
  panes.forEach((pane) => {
    const active = pane.dataset.projectPane === tabName;
    pane.classList.toggle('is-active', active);
    pane.hidden = !active;
  });
}

function closeCard(card) {
  const id = card.dataset.projectCard;
  const toggle = card.querySelector('[data-project-toggle]');
  const panel = card.querySelector('.project-panel');
  card.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  if (panel) {
    panel.inert = true;
    panel.setAttribute('aria-hidden', 'true');
    const finish = (event) => {
      if (event.target !== panel || card.classList.contains('is-open')) return;
      panel.hidden = true;
      panel.removeEventListener('transitionend', finish);
    };
    panel.addEventListener('transitionend', finish);
    window.setTimeout(() => { if (!card.classList.contains('is-open')) panel.hidden = true; }, 780);
  }
  if (openProjectId === id) openProjectId = null;
}

function openCard(card, selectedTab = 'published') {
  const id = card.dataset.projectCard;
  document.querySelectorAll('[data-project-card].is-open').forEach((other) => {
    if (other !== card) closeCard(other);
  });
  const panel = card.querySelector('.project-panel');
  const toggle = card.querySelector('[data-project-toggle]');
  if (!panel) return;
  panel.hidden = false;
  panel.inert = false;
  panel.setAttribute('aria-hidden', 'false');
  toggle?.setAttribute('aria-expanded', 'true');
  openProjectId = id;
  if (id === 'taamenn') setProjectTab(card, selectedTab);

  // Give the browser one frame to establish the collapsed state before opening.
  requestAnimationFrame(() => {
    if (!panel.isConnected) return;
    card.classList.add('is-open');
    requestAnimationFrame(() => {
      if (card.classList.contains('is-open')) card.classList.add('is-opening');
    });
  });
  const finishOpening = (event) => {
    if (event.target !== panel || event.propertyName !== 'grid-template-rows') return;
    card.classList.remove('is-opening');
    panel.removeEventListener('transitionend', finishOpening);
  };
  panel.addEventListener('transitionend', finishOpening);
}

export function renderProjects() {
  const list = document.getElementById('projectsList');
  if (!list) return;
  const wasOpen = openProjectId;
  const oldOpenCard = wasOpen ? list.querySelector(`[data-project-card="${CSS.escape(wasOpen)}"]`) : null;
  const previousTab = oldOpenCard?.querySelector('[data-project-tab].is-active')?.dataset.projectTab || 'published';
  clearReveals(list);
  list.innerHTML = projects.map(renderProject).join('');
  if (wasOpen) {
    const card = list.querySelector(`[data-project-card="${CSS.escape(wasOpen)}"]`);
    if (card) openCard(card, previousTab);
  }
  observeReveals(list);
}

export function initProjects() {
  renderProjects();
  document.addEventListener('omar:languagechange', renderProjects);
  document.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-project-tab]');
    if (tab) {
      const card = tab.closest('[data-project-card]');
      if (card) setProjectTab(card, tab.dataset.projectTab);
      return;
    }
    const toggle = event.target.closest('[data-project-toggle]');
    if (!toggle) return;
    const card = toggle.closest('[data-project-card]');
    if (!card) return;
    if (card.classList.contains('is-open')) closeCard(card);
    else openCard(card);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !openProjectId) return;
    const card = document.querySelector(`[data-project-card="${CSS.escape(openProjectId)}"]`);
    if (card) {
      closeCard(card);
      card.querySelector('[data-project-toggle]')?.focus();
    }
  });
}

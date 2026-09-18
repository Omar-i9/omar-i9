import { CONTACT, STACK, FOCUS, MINDSET, ENGINEERING_TOPICS } from '../data/site.js';
import { PROJECTS, PROJECT_FILTERS } from '../data/projects.js';
import { t } from './i18n.js';
import { copyText, escapeHtml, externalRel } from './util.js';
import { openProject } from './modal.js';
import { initMotion } from './motion.js';

let activeFilter = 'all';

function statusChip(status) {
  const cls = status === 'experimental' ? 'chip status status-experimental' : 'chip status';
  return `<span class="${cls}">${escapeHtml(t(`status.${status}`))}</span>`;
}

function techChips(list = []) {
  return list.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('');
}

function projectMatches(project, filter) {
  if (filter === 'all') return true;
  if (project.category === filter) return true;
  return Array.isArray(project.extraCategories) && project.extraCategories.includes(filter);
}

function renderFeatured(project) {
  const mount = document.getElementById('featuredMount');
  if (!mount) return;
  if (!project || !projectMatches(project, activeFilter)) {
    mount.innerHTML = '';
    return;
  }
  const img = project.image
    ? `<img src="${escapeHtml(project.image)}" alt="" width="180" height="180" decoding="async">`
    : '';
  const highlights = (project.keys.highlights || [])
    .map((key) => `<span class="chip">${escapeHtml(t(key))}</span>`)
    .join('');
  mount.innerHTML = `
    <article class="featured" data-reveal>
      <div class="featured-visual">${img}</div>
      <div class="featured-copy">
        <p class="kicker">${escapeHtml(t(project.keys.title))}</p>
        <div class="featured-meta">
          ${statusChip(project.status)}
          <span class="chip">${escapeHtml(String(project.year))}</span>
          <span class="chip">${escapeHtml(t(`filter.${project.category}`))}</span>
        </div>
        <h3>${escapeHtml(t(project.keys.title))}</h3>
        <p class="featured-sub">${escapeHtml(t(project.keys.subtitle))}</p>
        <p class="featured-desc">${escapeHtml(t(project.keys.short))}</p>
        <div class="featured-actions">
          <a class="btn btn-primary" href="${escapeHtml(project.liveUrl)}" ${externalRel()}>${escapeHtml(t('project.live'))}</a>
          <a class="btn" href="${escapeHtml(project.repositoryUrl)}" ${externalRel()}>${escapeHtml(t('project.repo'))}</a>
          <button class="btn btn-ghost" type="button" data-open-project="${escapeHtml(project.id)}">${escapeHtml(t('project.details'))}</button>
        </div>
        <div class="highlight-row">${highlights}</div>
      </div>
    </article>
  `;
}

function renderCards() {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;
  const list = PROJECTS.filter((project) => !project.featured && projectMatches(project, activeFilter));
  grid.innerHTML = list.map((project) => `
    <article class="project-card">
      <div class="card-meta">
        ${statusChip(project.status)}
        <span class="chip">${escapeHtml(t(`filter.${project.category}`))}</span>
        <span class="chip">${escapeHtml(String(project.year))}</span>
      </div>
      <h3>${escapeHtml(t(project.keys.title))}</h3>
      <p>${escapeHtml(t(project.keys.short))}</p>
      <div class="highlight-row">${techChips(project.technologies.slice(0, 5))}</div>
      <div class="card-actions">
        ${project.liveUrl ? `<a class="btn btn-primary" href="${escapeHtml(project.liveUrl)}" ${externalRel()}>${escapeHtml(t('project.live'))}</a>` : ''}
        ${project.repositoryUrl ? `<a class="btn" href="${escapeHtml(project.repositoryUrl)}" ${externalRel()}>${escapeHtml(t('project.repo'))}</a>` : ''}
        <button class="btn btn-ghost" type="button" data-open-project="${escapeHtml(project.id)}">${escapeHtml(t('project.details'))}</button>
      </div>
    </article>
  `).join('');
}

function renderFilters() {
  const wrap = document.getElementById('projectFilters');
  if (!wrap) return;
  const used = new Set(['all']);
  PROJECTS.forEach((project) => {
    used.add(project.category);
    (project.extraCategories || []).forEach((item) => used.add(item));
  });
  wrap.innerHTML = PROJECT_FILTERS.filter((item) => used.has(item.id)).map((item) => `
    <button type="button" data-filter="${item.id}" aria-pressed="${item.id === activeFilter}">${escapeHtml(t(item.key))}</button>
  `).join('');
}

function renderAboutExtras() {
  const eng = document.getElementById('engGrid');
  if (eng) {
    eng.innerHTML = ENGINEERING_TOPICS.map((topic) => `
      <article class="panel eng-card" data-reveal>
        <h3>${escapeHtml(t(topic.titleKey))}</h3>
        <p>${escapeHtml(t(topic.bodyKey))}</p>
      </article>
    `).join('');
  }

  const focus = document.getElementById('focusGrid');
  if (focus) {
    focus.innerHTML = FOCUS.map((item) => `
      <article class="panel" data-reveal>
        <span class="chip horizon">${escapeHtml(t(`focus.${item.horizon}`))}</span>
        <h3>${escapeHtml(t(item.titleKey))}</h3>
        <p>${escapeHtml(t(item.bodyKey))}</p>
      </article>
    `).join('');
  }

  const stack = document.getElementById('stackGrid');
  if (stack) {
    stack.innerHTML = STACK.map((group) => `
      <article class="panel" data-reveal>
        <h3>${escapeHtml(t(group.titleKey))}</h3>
        <div class="stack-items">${techChips(group.items)}</div>
      </article>
    `).join('');
  }

  const mind = document.getElementById('mindsetTrack');
  if (mind) {
    mind.innerHTML = MINDSET.map((step) => `
      <div class="mindset-step" data-reveal>
        <span class="mindset-n">${escapeHtml(step.n)}</span>
        <strong>${escapeHtml(t(step.key))}</strong>
      </div>
    `).join('');
  }
}

function renderContact() {
  const primary = document.getElementById('contactPrimary');
  if (primary) {
    primary.innerHTML = CONTACT.primary.map((item) => {
      const label = escapeHtml(t(item.labelKey));
      const handle = escapeHtml(item.handle);
      if (item.copy) {
        return `<div class="contact-card"><div><b>${label}</b><span>${handle}</span></div><button class="btn" type="button" data-copy="${escapeHtml(item.copy)}">${escapeHtml(t('contact.copy'))}</button></div>`;
      }
      return `<a class="contact-card" href="${escapeHtml(item.url)}" ${externalRel()}><div><b>${label}</b><span>${handle}</span></div></a>`;
    }).join('');
  }

  const elseWrap = document.getElementById('elsewhere');
  if (elseWrap) {
    elseWrap.innerHTML = CONTACT.elsewhere.map((item) =>
      `<a href="${escapeHtml(item.url)}" ${externalRel()}>${escapeHtml(item.label)} · ${escapeHtml(item.handle)}</a>`
    ).join('');
  }

  const ids = document.getElementById('idList');
  if (ids) {
    ids.innerHTML = CONTACT.ids.map((item) =>
      `<button type="button" data-copy="${escapeHtml(item.value)}">${escapeHtml(t(item.labelKey))}: ${escapeHtml(item.value)}</button>`
    ).join('');
  }
}

export function renderAll() {
  renderFeatured(PROJECTS.find((item) => item.featured));
  renderFilters();
  renderCards();
  renderAboutExtras();
  renderContact();
}

export function initRender() {
  renderAll();

  document.getElementById('projectFilters')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-filter]');
    if (!btn) return;
    activeFilter = btn.getAttribute('data-filter');
    renderFilters();
    renderFeatured(PROJECTS.find((item) => item.featured));
    renderCards();
    initMotion();
  });

  document.body.addEventListener('click', (event) => {
    const openBtn = event.target.closest('[data-open-project]');
    if (openBtn) {
      openProject(openBtn.getAttribute('data-open-project'));
      return;
    }
    const copyBtn = event.target.closest('[data-copy]');
    if (copyBtn) {
      event.preventDefault();
      copyText(copyBtn.getAttribute('data-copy'), t('contact.copied'));
    }
  });
}

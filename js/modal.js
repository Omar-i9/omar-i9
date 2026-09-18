import { PROJECTS } from '../data/projects.js';
import { t } from './i18n.js';
import { escapeHtml, externalRel } from './util.js';

function projectById(id) {
  return PROJECTS.find((item) => item.id === id);
}

export function openProject(id) {
  const project = projectById(id);
  const dialog = document.getElementById('projectDialog');
  if (!project || !dialog) return;

  const highlights = (project.keys.highlights || [])
    .map((key) => `<li>${escapeHtml(t(key))}</li>`)
    .join('');

  dialog.innerHTML = `
    <div class="dialog-head">
      <div>
        <p class="kicker">${escapeHtml(t(`filter.${project.category}`))} · ${escapeHtml(t(`status.${project.status}`))}</p>
        <h2 id="projectDialogTitle">${escapeHtml(t(project.keys.title))}</h2>
        <p class="featured-sub">${escapeHtml(t(project.keys.subtitle))}</p>
      </div>
      <button class="icon-btn" type="button" data-close-dialog data-i18n-aria="project.close" aria-label="${escapeHtml(t('project.close'))}">
        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z"/></svg>
      </button>
    </div>
    <div class="dialog-body">
      <p>${escapeHtml(t(project.keys.long))}</p>
      <div>
        <h3>${escapeHtml(t('project.highlights'))}</h3>
        <ul>${highlights}</ul>
      </div>
      <div>
        <h3>${escapeHtml(t('project.tech'))}</h3>
        <div class="highlight-row">${project.technologies.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('')}</div>
      </div>
      <div>
        <h3>${escapeHtml(t('project.architecture'))}</h3>
        <p>${escapeHtml(t(project.keys.architecture))}</p>
      </div>
      <div>
        <h3>${escapeHtml(t('project.notes'))}</h3>
        <p>${escapeHtml(t(project.keys.notes))}</p>
      </div>
      <div class="dialog-actions">
        ${project.liveUrl ? `<a class="btn btn-primary" href="${escapeHtml(project.liveUrl)}" ${externalRel()}>${escapeHtml(t('modal.live'))}</a>` : ''}
        ${project.repositoryUrl ? `<a class="btn" href="${escapeHtml(project.repositoryUrl)}" ${externalRel()}>${escapeHtml(t('modal.repo'))}</a>` : ''}
      </div>
    </div>
  `;

  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  document.body.classList.add('dialog-open');
}

export function initModal() {
  const dialog = document.getElementById('projectDialog');
  if (!dialog) return;
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.closest('[data-close-dialog]')) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
}

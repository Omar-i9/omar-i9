import { projects } from '../data/projects.js';
import { currentLanguage, translate } from '../core/i18n.js';

export function renderProjectGrid() {
  const root = document.getElementById('projectsGrid');
  if (!root) return;
  const project = projects[0];
  const lang = currentLanguage();
  const status = project.status[lang];
  const summary = project.summary[lang];
  const features = project.features.map((feature) => feature[lang]);

  root.innerHTML = `
    <article class="project-card" aria-labelledby="taamenName">
      <div class="project-card__brand">
        <img src="./visuals/taamen-brand-opaque.webp" alt="TAAMEN official brand mark" width="112" height="112" loading="lazy" decoding="async" />
      </div>
      <div class="project-card__body">
        <div class="project-card__topline">
          <span class="project-card__version">TAAMEN ${project.version}</span>
          <span class="project-status"><i aria-hidden="true"></i>${status}</span>
        </div>
        <h2 id="taamenName">TAAMEN</h2>
        <p class="project-card__summary">${summary}</p>
        <ul class="project-features">${features.map((feature) => `<li>${feature}</li>`).join('')}</ul>
        <div class="project-tags">${project.stack.map((tag) => `<span>${tag}</span>`).join('')}</div>
        <div class="project-card__actions">
          <a class="project-link project-link--primary" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">${translate('projectVisit', 'Open live website')} <span aria-hidden="true">↗</span></a>
          <a class="project-link project-link--secondary" href="${project.detailsUrl}">${translate('projectDetails', 'Project information')} <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </article>`;
}

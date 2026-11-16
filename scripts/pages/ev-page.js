import { evShowcase } from '../../data/projects.js';
import { currentLang, initLanguage, t } from '../core/i18n.js';
import { onReady, escapeHtml } from '../core/dom.js';
import { initReveal } from '../core/reveal.js';
function value(item) { return item?.[currentLang()] ?? item?.ar ?? ''; }
function paint() {
  const overview = document.getElementById('evOverview');
  const note = document.getElementById('evNote');
  const highlights = document.getElementById('evHighlights');
  if (overview) overview.textContent = value(evShowcase.overview);
  if (note) note.textContent = value(evShowcase.note);
  if (highlights) highlights.innerHTML = evShowcase.highlights.map((item) => `<span>${escapeHtml(value(item))}</span>`).join('');
}
onReady(() => { initLanguage(); initReveal(); paint(); document.addEventListener('omar:languagechange', paint); });

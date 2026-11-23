import './styles/index.css';
import { initLanguage } from './core/i18n.js';
import { renderSocialGrid } from './components/social-grid.js';
import { renderGamingGrid } from './components/gaming-grid.js';
import { renderProjectGrid } from './components/project-grid.js';
import { initSceneEngine, initMagneticProfile } from './features/scene-engine.js';
import { initSharing } from './features/sharing.js';

function initProfilePhoto() {
  const image = document.querySelector('.portrait-image');
  if (!image) return;
  image.addEventListener('error', () => {
    if (!image.dataset.fallbackUsed) {
      image.dataset.fallbackUsed = 'true';
      image.src = image.dataset.fallback;
      return;
    }
    image.removeAttribute('src');
    image.classList.add('portrait-image--missing');
  });
  image.src = image.dataset.src;
}

function renderDynamicContent() {
  renderSocialGrid();
  renderGamingGrid();
  renderProjectGrid();
}

function boot() {
  initLanguage();
  renderDynamicContent();
  document.addEventListener('identity:languagechange', renderDynamicContent);
  initProfilePhoto();
  initSceneEngine();
  initMagneticProfile();
  initSharing();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();

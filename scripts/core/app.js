import { onReady } from './dom.js';
import { detectPerformance } from './performance.js';
import { initLanguage } from '../features/language.js';
import { initProfile } from '../features/profile.js';
import { initSocial } from '../features/social.js';
import { initFilters } from '../features/filters.js';
import { initQuickCopy } from '../features/quick-copy.js';
import { initProjects } from '../features/projects.js';
import { initAyah } from '../features/ayah.js';
import { initSharing } from '../features/sharing.js';
import { initVersion } from '../features/version.js';
import { initDiscord } from '../features/discord.js';
import { initDialogs } from '../features/dialogs.js';
import { initReveal } from '../motion/reveal.js';
import { initHover, initMagnetic } from '../motion/hover.js';
import { initPointer } from '../motion/pointer.js';
import { initBackground } from '../motion/background.js';

onReady(() => {
  detectPerformance();
  initLanguage();
  initDialogs();
  initProfile();
  initFilters();
  initSocial();
  initQuickCopy();
  initProjects();
  initAyah();
  initSharing();
  initVersion();
  initDiscord();
  initHover();
  initMagnetic();
  initPointer();
  initBackground();
  requestAnimationFrame(() => {
    document.body.classList.add('site-ready');
    initReveal();
    const skeleton = document.getElementById('siteSkeleton');
    if (skeleton) {
      skeleton.classList.add('is-done');
      setTimeout(() => skeleton.remove(), 420);
    }
  });
});

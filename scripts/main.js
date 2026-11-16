import { onReady } from './core/dom.js';
import { initLanguage } from './core/i18n.js';
import { initDialogs } from './core/dialogs.js';
import { initReveal } from './core/reveal.js';
import { initWavesBackground } from './background/waves.js';
import { initPresence } from './features/presence.js';
import { initProfile } from './features/profile.js';
import { initSocial } from './features/social.js';
import { initQuickCopy } from './features/quick-copy.js';
import { initProjects } from './features/projects.js';
import { initAyah } from './features/ayah.js';
import { initSharing } from './features/sharing.js';
import { initVersion } from './features/version.js';

onReady(() => {
  initLanguage();
  initDialogs();
  initPresence();
  initProfile();
  initSocial();
  initQuickCopy();
  initProjects();
  initAyah();
  initSharing();
  initVersion();
  initReveal();
  initWavesBackground(document.getElementById('wavesCanvas'));


  const progress = document.getElementById('scrollProgress');
  let scrollFrame = 0;
  const updateScrollProgress = () => {
    scrollFrame = 0;
    if (!progress) return;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const amount = available > 0 ? window.scrollY / available : 0;
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, amount))})`;
  };
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollProgress);
  }, { passive: true });
  updateScrollProgress();
});

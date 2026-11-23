import { onReady } from './core/dom.js';
import { initLanguage } from './core/i18n.js';
import { initDialogs } from './core/dialogs.js';
import { initReveal } from './core/reveal.js';
import { initPresence } from './features/presence.js';
import { initProfile } from './features/profile.js';
import { initSocial } from './features/social.js';
import { initQuickCopy } from './features/quick-copy.js';
import { initProjects } from './features/projects.js';
import { initSharing } from './features/sharing.js';
import { initScrollExperience } from './features/scroll-experience.js';

onReady(() => {
  initLanguage();
  initDialogs();
  initPresence();
  initProfile();
  initSocial();
  initQuickCopy();
  initProjects();
  initSharing();
  initReveal();
  initScrollExperience();
});

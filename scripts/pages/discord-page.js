import { detectPerformance } from '../core/performance.js';
import { applyLanguage, savedLanguage, initLanguage, t } from '../features/language.js';
import { initDiscordPage } from '../features/discord.js';
import { chromeIcon } from '../features/icons.js';

detectPerformance();
applyLanguage(savedLanguage());
initLanguage();
document.getElementById('discordCopyBtn')?.insertAdjacentHTML('afterbegin', chromeIcon('copy'));
const close = document.getElementById('discordClose');
if (close) {
  close.innerHTML = chromeIcon('close');
  close.addEventListener('click', () => {
    const parentClose = window.parent?.document?.getElementById('closePageBtn');
    if (parentClose) parentClose.click();
    else location.href = '../index.html';
  });
}
initDiscordPage();
document.querySelector('[data-handle]')?.setAttribute('aria-label', t('discordHandleLabel'));
document.body.classList.add('site-ready');

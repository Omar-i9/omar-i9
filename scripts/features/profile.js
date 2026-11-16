import { t } from '../core/i18n.js';
import { prefersReducedMotion } from '../core/dom.js';

export function initProfile() {
  const card = document.getElementById('profileCard');
  const trigger = document.getElementById('profileToggle');
  if (!card || !trigger) return;
  const details = document.getElementById('profileDetails');

  let userInteracted = false;
  const setExpanded = (expanded) => {
    card.classList.toggle('is-expanded', expanded);
    trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (details) {
      details.inert = !expanded;
      details.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    }
    trigger.setAttribute('aria-label', t(expanded ? 'profileClose' : 'profileAction'));
  };

  setExpanded(false);

  trigger.addEventListener('click', () => {
    userInteracted = true;
    setExpanded(!card.classList.contains('is-expanded'));
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && card.classList.contains('is-expanded')) {
      setExpanded(false);
      trigger.focus();
    }
  });

  document.addEventListener('omar:languagechange', () => {
    trigger.setAttribute('aria-label', t(card.classList.contains('is-expanded') ? 'profileClose' : 'profileAction'));
  });

  const introDelay = prefersReducedMotion() ? 0 : 1450;
  window.setTimeout(() => {
    if (userInteracted || !card.isConnected) return;
    card.classList.add('is-intro-opening');
    setExpanded(true);
    window.setTimeout(() => card.classList.remove('is-intro-opening'), prefersReducedMotion() ? 0 : 2050);
  }, introDelay);
}

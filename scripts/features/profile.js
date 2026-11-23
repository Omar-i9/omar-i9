import { prefersReducedMotion } from '../core/dom.js';

export function initProfile() {
  const card = document.getElementById('profileCard');
  const details = document.getElementById('profileDetails');
  if (!card || !details) return;

  const setExpanded = (expanded) => {
    card.classList.toggle('is-expanded', expanded);
    details.inert = !expanded;
    details.setAttribute('aria-hidden', expanded ? 'false' : 'true');
  };

  // Preserve the delayed intro: profile details fade/slide in once and remain visible.
  // There is intentionally no click or keyboard toggle that can collapse the profile.
  setExpanded(false);
  const reducedMotion = prefersReducedMotion();
  const introDelay = reducedMotion ? 0 : 520;
  window.setTimeout(() => {
    if (!card.isConnected) return;
    card.classList.add('is-intro-opening');
    setExpanded(true);
    window.setTimeout(() => card.classList.remove('is-intro-opening'), reducedMotion ? 0 : 2050);
  }, introDelay);

  // v1.6.5 magnetic profile tilt, limited to desktop/fine-pointer devices.
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion;
  if (!canTilt) return;

  let resetTimer = 0;
  const resetTilt = () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1)';
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      if (card.isConnected) card.style.transition = '';
    }, 600);
  };

  card.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = ((event.clientX - centerX) / (rect.width / 2)) * 4;
    const dy = ((event.clientY - centerY) / (rect.height / 2)) * 3;
    window.clearTimeout(resetTimer);
    card.style.transition = '';
    card.style.transform = `translateY(-4px) perspective(800px) rotateX(${-dy}deg) rotateY(${dx}deg)`;
  }, { passive: true });

  card.addEventListener('pointerleave', resetTilt, { passive: true });
  window.addEventListener('blur', resetTilt);
}

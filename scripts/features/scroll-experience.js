import { prefersReducedMotion } from '../core/dom.js';

const SCENES = ['identity', 'social', 'gaming', 'projects', 'contact'];

export function initScrollExperience() {
  const body = document.body;
  const progress = document.getElementById('scrollProgress');
  const header = document.querySelector('[data-v5-header]');
  const scenes = [...document.querySelectorAll('[data-v5-scene]')];
  const magneticItems = [...document.querySelectorAll('[data-v5-magnetic]')];
  const reducedMotion = prefersReducedMotion();
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let frame = 0;
  let activeScene = 'identity';

  const setScene = (scene) => {
    if (!SCENES.includes(scene) || scene === activeScene) return;
    activeScene = scene;
    body.dataset.v5Scene = scene;
  };

  const updateScrollState = () => {
    frame = 0;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const amount = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    if (progress) progress.style.transform = `scaleX(${amount})`;
    body.classList.toggle('v5-is-scrolled', window.scrollY > 42);
    header?.classList.toggle('is-compact', window.scrollY > 42);
    if (!('IntersectionObserver' in window)) {
      const midpoint = window.innerHeight * 0.48;
      const current = scenes.find((scene) => {
        const rect = scene.getBoundingClientRect();
        return rect.top <= midpoint && rect.bottom >= midpoint;
      });
      if (current) setScene(current.dataset.v5Scene);
    }
  };

  const requestScrollUpdate = () => {
    if (!frame) frame = requestAnimationFrame(updateScrollState);
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  updateScrollState();

  let sceneObserver;
  if ('IntersectionObserver' in window) {
    sceneObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setScene(visible[0].target.dataset.v5Scene);
    }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.12, 0.3, 0.55] });
    scenes.forEach((scene) => sceneObserver.observe(scene));
  }

  if (finePointer && !reducedMotion) {
    let pointerFrame = 0;
    let pointerX = 50;
    let pointerY = 34;
    const setPointer = (event) => {
      pointerX = Math.round((event.clientX / Math.max(1, window.innerWidth)) * 100);
      pointerY = Math.round((event.clientY / Math.max(1, window.innerHeight)) * 100);
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        body.style.setProperty('--v5-pointer-x', `${pointerX}%`);
        body.style.setProperty('--v5-pointer-y', `${pointerY}%`);
      });
    };
    window.addEventListener('pointermove', setPointer, { passive: true });
    body.classList.add('v5-pointer-enabled');

    magneticItems.forEach((item) => {
      let magnetFrame = 0;
      item.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const rect = item.getBoundingClientRect();
        const dx = (event.clientX - rect.left - rect.width / 2) / Math.max(1, rect.width / 2);
        const dy = (event.clientY - rect.top - rect.height / 2) / Math.max(1, rect.height / 2);
        if (magnetFrame) cancelAnimationFrame(magnetFrame);
        magnetFrame = requestAnimationFrame(() => {
          item.style.setProperty('--v5-magnet-x', `${(dx * 5).toFixed(1)}px`);
          item.style.setProperty('--v5-magnet-y', `${(dy * 4).toFixed(1)}px`);
        });
      }, { passive: true });
      item.addEventListener('pointerleave', () => {
        if (magnetFrame) cancelAnimationFrame(magnetFrame);
        item.style.setProperty('--v5-magnet-x', '0px');
        item.style.setProperty('--v5-magnet-y', '0px');
      }, { passive: true });
    });
  }

  document.querySelectorAll('[data-v5-share]').forEach((button) => {
    button.addEventListener('click', () => document.getElementById('shareOpen')?.click());
  });

  return () => {
    window.removeEventListener('scroll', requestScrollUpdate);
    window.removeEventListener('resize', requestScrollUpdate);
    sceneObserver?.disconnect();
    cancelAnimationFrame(frame);
  };
}

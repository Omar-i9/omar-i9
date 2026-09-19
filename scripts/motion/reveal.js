import { $$ } from '../core/dom.js';
import { state } from '../core/state.js';

export function initReveal() {
  const bar = document.getElementById('scrollProgress');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    bar?.style.setProperty('--progress', String(p));
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  if (state.reducedMotion) {
    $$('.reveal').forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el) => io.observe(el));
}

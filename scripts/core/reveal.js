import { prefersReducedMotion } from './dom.js';

let observer = null;
let initialized = false;

function collect(root) {
  const elements = [];
  if (root?.matches?.('[data-reveal]')) elements.push(root);
  root?.querySelectorAll?.('[data-reveal]').forEach((item) => elements.push(item));
  return elements;
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.bottom >= 0 && rect.top <= window.innerHeight && rect.right >= 0 && rect.left <= window.innerWidth;
}

/** Stop observing old targets before a dynamic region is replaced. */
export function clearReveals(root = document) {
  collect(root).forEach((item) => observer?.unobserve(item));
}

/** Register new targets after language/data rendering without leaving them in the hidden pre-reveal state. */
export function observeReveals(root = document) {
  const targets = collect(root);
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  if (!observer) {
    observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  }
  targets.forEach((item) => {
    if (item.classList.contains('is-visible')) return;
    const parent = item.parentElement?.closest('[data-reveal]');
    if ((parent?.classList.contains('is-visible') && isInViewport(item)) || isInViewport(item)) {
      requestAnimationFrame(() => item.classList.add('is-visible'));
      observer.unobserve(item);
    } else {
      observer.observe(item);
    }
  });
}

export function initReveal() {
  if (initialized) return;
  initialized = true;
  observeReveals(document);
}

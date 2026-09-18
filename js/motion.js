let io;

export function initMotion() {
  const nodes = Array.from(document.querySelectorAll('[data-reveal]:not(.is-in)'));
  if (!nodes.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach((node) => node.classList.add('is-in'));
    return;
  }
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  }
  nodes.forEach((node) => io.observe(node));
}

import { NAV } from '../data/site.js';
import { t } from './i18n.js';

let bound = false;

function closeDrawer(drawer, btn) {
  if (!drawer || !btn) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('dialog-open');
}

export function renderNav() {
  const items = NAV.map((item) => `<a href="${item.href}" data-nav="${item.id}" data-i18n="${item.key}">${t(item.key)}</a>`).join('');
  const linksWrap = document.getElementById('navLinks');
  const drawerLinks = document.getElementById('drawerLinks');
  if (linksWrap) linksWrap.innerHTML = items;
  if (drawerLinks) drawerLinks.innerHTML = items;
}

export function initNav() {
  renderNav();
  if (bound) return;
  bound = true;

  const drawer = document.getElementById('navDrawer');
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('drawerClose');
  const drawerLinks = document.getElementById('drawerLinks');

  menuBtn?.addEventListener('click', () => {
    const open = !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('dialog-open', open);
    if (open) closeBtn?.focus();
  });

  closeBtn?.addEventListener('click', () => closeDrawer(drawer, menuBtn));
  drawer?.addEventListener('click', (event) => {
    if (event.target === drawer) closeDrawer(drawer, menuBtn);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer?.classList.contains('is-open')) {
      closeDrawer(drawer, menuBtn);
      menuBtn.focus();
    }
  });
  drawerLinks?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeDrawer(drawer, menuBtn);
  });

  const spy = () => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(Boolean);
    const y = window.scrollY + 96;
    let current = 'top';
    for (const section of sections) {
      if (section.offsetTop <= y) current = section.id;
    }
    document.querySelectorAll('[data-nav]').forEach((link) => {
      const on = link.getAttribute('data-nav') === current;
      if (on) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  };

  spy();
  window.addEventListener('scroll', spy, { passive: true });
}

import { escapeHtml } from '../core/dom.js';
import { withBase } from '../core/base-path.js';

export function iconMarkup(icon, className = 'brand-icon-img') {
  if (!icon) return '';
  if (icon.includes('/') || /\.(svg|png|webp)$/i.test(icon)) {
    return `<img src="${escapeHtml(withBase(icon))}" alt="" class="${escapeHtml(className)}" width="48" height="48" loading="lazy" decoding="async">`;
  }
  return chromeIcon(icon);
}

export function chromeIcon(name) {
  const icons = {
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .17 1H8.83A3 3 0 1 0 6 9.83V14.17A3 3 0 1 0 8 16h.17A3.01 3.01 0 0 0 11 14.17V9.83A3.01 3.01 0 0 0 8.83 8h6.34A3 3 0 0 0 18 8Z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 7h11v14H9zm2 2v10h7V9zm-6-4h11v2H7v12H5V5z"/></svg>',
    lang: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm7 9c0 .9-.17 1.76-.48 2.55H15.1A19 19 0 0 0 15 12c0-.87.1-1.72.1-2.55h3.42c.31.79.48 1.65.48 2.55ZM9.9 9.45A17 17 0 0 0 9.8 12c0 .87.04 1.72.1 2.55H5.48A7.03 7.03 0 0 1 5 12c0-.9.17-1.76.48-2.55Zm.96-2.5h2.28A11.5 11.5 0 0 0 12 4.08 11.5 11.5 0 0 0 10.86 6.95Zm2.28 10.1H10.86A11.5 11.5 0 0 0 12 19.92 11.5 11.5 0 0 0 13.14 17.05Zm1.76-2.5h3.62A7.04 7.04 0 0 1 12 19.03 13.4 13.4 0 0 1 14.9 14.55Zm0-7.1A13.4 13.4 0 0 1 12 4.97 7.04 7.04 0 0 1 18.52 7.45ZM5.48 7.45A7.04 7.04 0 0 1 12 4.97c.9 1.36 1.57 3.08 1.9 2.48H8.9A13.4 13.4 0 0 1 5.48 7.45Z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 5c5.5 0 9.5 4.5 10.5 7-1 2.5-5 7-10.5 7S2.5 14.5 1.5 12C2.5 9.5 6.5 5 12 5Zm0 3a4 4 0 1 0 .01 8.01A4 4 0 0 0 12 8Z"/></svg>',
    hide: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.3 2.3 21.7 20.7l-1.4 1.4-2.62-2.63A12.6 12.6 0 0 1 12 19C6.5 19 2.5 14.5 1.5 12a13.7 13.7 0 0 1 5.2-5.66L1.9 3.7 3.3 2.3ZM12 7a5 5 0 0 1 4.9 6.1l-1.6-1.6A3 3 0 0 0 12 9a3 3 0 0 0-.5.04L10 7.54A5 5 0 0 1 12 7Zm0 10a5 5 0 0 0 1.3-.17l-1.56-1.56A3 3 0 0 1 9.73 13.3L8.12 11.7A5 5 0 0 0 12 17Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4Z"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.2-3.37-1.2-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-1.99 1.03-2.7-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84a9.6 9.6 0 0 1 2.5.34c1.9-1.3 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.71 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m3.4 11.2 15.4-7.2-1.7 16.4-5.5-4.1-3.3 3.4.1-5.5z"/></svg>',
    rotate: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 5 11.6 6.4 16.2 11H4v2h12.2l-4.6 4.6L13 19l7-7z"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10.6 13.4a4 4 0 0 1 0-5.6l2.1-2.1a4 4 0 0 1 5.6 5.6l-1.2 1.2-1.4-1.4 1.2-1.2a2 2 0 1 0-2.8-2.8l-2.1 2.1a2 2 0 0 0 0 2.8zm2.8-2.8a4 4 0 0 1 0 5.6l-2.1 2.1a4 4 0 1 1-5.6-5.6l1.2-1.2 1.4 1.4-1.2 1.2a2 2 0 1 0 2.8 2.8l2.1-2.1a2 2 0 0 0 0-2.8z"/></svg>'
  };
  return icons[name] || '';
}

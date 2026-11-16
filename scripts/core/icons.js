const paths = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4m-6.6 7 6.6 4.3"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
  github: '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.2-3.37-1.2-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-1.99 1.03-2.7-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84a9.6 9.6 0 0 1 2.5.34c1.9-1.3 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.71 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/>',
  pitch: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16m0-11a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>',
  archive: '<path d="M3 5h18v4H3zM5 9v10h14V9m-9 4h4"/>',
  board: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  stadia: '<path d="M3 19V8l9-4 9 4v11M5 19h14M7 19v-6h10v6M3 8l9 4 9-4"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-2.2 7.2-2.2 8.5h16.4C20.2 16.2 18 16 18 9ZM10 21h4"/>',
  disk: '<path d="M4 4h13l3 3v13H4zM8 4v6h8V4M8 20v-7h8v7"/>',
  app: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M7 12h10M12 7v10"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5zM4 17.5A2.5 2.5 0 0 1 6.5 15H20"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>'
};

export function icon(name, className = '') {
  const inner = paths[name] || paths.info;
  return `<svg class="ui-icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${inner}</svg>`;
}

export function imageIcon(path, className = '') {
  return `<img class="brand-icon ${className}" src="${path}" alt="" width="40" height="40" loading="lazy" decoding="async">`;
}

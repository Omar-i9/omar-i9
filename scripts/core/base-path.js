export function withBase(path) {
  if (!path) return path;
  if (/^(https?:|data:|mailto:|#)/i.test(path)) return path;
  const base = document.documentElement.getAttribute('data-base') || './';
  return `${base}${String(path).replace(/^\.\//, '')}`;
}

export function siteUrl() {
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  if (canonical) return canonical;
  return new URL(withBase(''), location.href).href;
}

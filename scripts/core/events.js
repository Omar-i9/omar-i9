const listeners = [];

export function on(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  listeners.push({ target, type, handler, options });
}

export function emit(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

export function onEmit(name, handler) {
  on(document, name, handler);
}

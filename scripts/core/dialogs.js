const stack = [];

function focusable(panel) {
  return [...panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
}

export function openDialog(dialog) {
  const node = typeof dialog === 'string' ? document.getElementById(dialog) : dialog;
  if (!(node instanceof HTMLDialogElement) || node.open) return;
  const active = document.activeElement;
  node.dataset.returnFocusId = active?.id || '';
  node.showModal();
  stack.push(node);
  requestAnimationFrame(() => (focusable(node)[0] || node).focus({ preventScroll: true }));
}

export function closeDialog(dialog) {
  const node = typeof dialog === 'string' ? document.getElementById(dialog) : dialog;
  if (!(node instanceof HTMLDialogElement) || !node.open) return;
  node.close();
  const index = stack.lastIndexOf(node);
  if (index >= 0) stack.splice(index, 1);
  const target = node.dataset.returnFocusId ? document.getElementById(node.dataset.returnFocusId) : null;
  target?.focus({ preventScroll: true });
}

export function initDialogs() {
  document.querySelectorAll('dialog[data-dialog]').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog || event.target.closest('[data-dialog-close]')) closeDialog(dialog);
    });
    dialog.addEventListener('close', () => {
      const index = stack.lastIndexOf(dialog);
      if (index >= 0) stack.splice(index, 1);
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const nodes = focusable(dialog);
      if (!nodes.length) { event.preventDefault(); dialog.focus(); return; }
      const first = nodes[0];
      const last = nodes.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  });
}

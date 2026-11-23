const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function initSceneEngine() {
  const scenes = [...document.querySelectorAll('.scene[data-scene]')];
  if (!scenes.length) return () => {};
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let activeScene = '';

  const update = () => {
    frame = 0;
    const viewportCenter = window.innerHeight / 2;
    const fadeDistance = Math.max(window.innerHeight * 0.68, 300);
    let best = { name: scenes[0].dataset.scene, focus: -1 };

    for (const scene of scenes) {
      const rect = scene.getBoundingClientRect();
      const inside = rect.top <= viewportCenter && rect.bottom >= viewportCenter;
      const distance = inside ? 0 : rect.top > viewportCenter ? rect.top - viewportCenter : viewportCenter - rect.bottom;
      const focus = reduceMotionQuery.matches ? 1 : clamp(1 - distance / fadeDistance, 0, 1);
      scene.style.setProperty('--scene-focus', focus.toFixed(3));
      scene.style.setProperty('--scene-blur', `${((1 - focus) * 3.2).toFixed(2)}px`);
      if (focus > best.focus) best = { name: scene.dataset.scene, focus };
    }

    if (best.name !== activeScene && best.focus > 0.1) {
      activeScene = best.name;
      document.body.dataset.scene = activeScene;
    }
  };

  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  reduceMotionQuery.addEventListener?.('change', requestUpdate);
  update();

  if (!reduceMotionQuery.matches && window.matchMedia('(pointer: fine)').matches) {
    let pointerFrame = 0;
    const pointerMove = (event) => {
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const x = (event.clientX / Math.max(window.innerWidth, 1)) * 100;
        const y = (event.clientY / Math.max(window.innerHeight, 1)) * 100;
        document.documentElement.style.setProperty('--pointer-x', `${x.toFixed(2)}%`);
        document.documentElement.style.setProperty('--pointer-y', `${y.toFixed(2)}%`);
      });
    };
    window.addEventListener('pointermove', pointerMove, { passive: true });
  }

  if (reduceMotionQuery.matches) document.body.classList.add('reduce-motion');
  return () => {
    window.removeEventListener('scroll', requestUpdate);
    window.removeEventListener('resize', requestUpdate);
    reduceMotionQuery.removeEventListener?.('change', requestUpdate);
    cancelAnimationFrame(frame);
  };
}

export function initMagneticProfile() {
  const card = document.getElementById('identityCard');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!card || !finePointer.matches || reduceMotion.matches) return () => {};

  let pointerFrame = 0;
  const onMove = (event) => {
    if (pointerFrame) return;
    const rect = card.getBoundingClientRect();
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      const px = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
      const py = clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
      const dx = (px - 0.5) * 2;
      const dy = (py - 0.5) * 2;
      // Repulsion: the glass card moves a few pixels away from the cursor.
      card.style.setProperty('--card-shift-x', `${(-dx * 13).toFixed(2)}px`);
      card.style.setProperty('--card-shift-y', `${(-dy * 10).toFixed(2)}px`);
      card.style.setProperty('--card-rotate-x', `${(dy * 3.6).toFixed(2)}deg`);
      card.style.setProperty('--card-rotate-y', `${(-dx * 4.2).toFixed(2)}deg`);
      card.style.setProperty('--card-light-x', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--card-light-y', `${(py * 100).toFixed(1)}%`);
      card.classList.add('is-pointer-active');
    });
  };
  const reset = () => {
    card.style.setProperty('--card-shift-x', '0px');
    card.style.setProperty('--card-shift-y', '0px');
    card.style.setProperty('--card-rotate-x', '0deg');
    card.style.setProperty('--card-rotate-y', '0deg');
    card.classList.remove('is-pointer-active');
  };
  card.addEventListener('pointermove', onMove, { passive: true });
  card.addEventListener('pointerleave', reset);
  return () => {
    cancelAnimationFrame(pointerFrame);
    card.removeEventListener('pointermove', onMove);
    card.removeEventListener('pointerleave', reset);
    reset();
  };
}

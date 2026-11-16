import { prefersReducedMotion } from '../core/dom.js';

/**
 * Native Canvas port of the supplied React/WebGL Waves component.
 * It retains the silky line flow, pointer bending, spring return and click ripples,
 * while staying independent from React/WebGL and bounding work on lower-end devices.
 */
export function initWavesBackground(canvas) {
  if (!canvas) return () => {};
  const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!context) return () => {};

  const reducedQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reducedMotion = reducedQuery?.matches ?? prefersReducedMotion();
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const narrow = window.matchMedia?.('(max-width: 760px)').matches ?? false;
  const saveData = navigator.connection?.saveData === true;
  const lowPower = saveData || cores <= 4 || memory <= 4 || narrow;
  const config = lowPower
    ? { lines: narrow ? 12 : 14, samples: 54, fps: 24, dpr: 1.05, amplitude: 17 }
    : cores >= 8 && memory >= 8
      ? { lines: 23, samples: 118, fps: 40, dpr: 1.45, amplitude: 23 }
      : { lines: 18, samples: 82, fps: 32, dpr: 1.25, amplitude: 20 };

  let width = 1;
  let height = 1;
  let ratio = 1;
  let raf = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let visible = true;
  let disposed = false;
  const pointer = { x: -1000, y: -1000, vx: 0, vy: 0, targetX: -1000, targetY: -1000, active: false };
  const ripples = [];
  const palette = ['#a9d9ff', '#cbbaff', '#f5c7b2', '#8fd7d0'];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width || window.innerWidth);
    height = Math.max(1, rect.height || window.innerHeight);
    ratio = Math.min(window.devicePixelRatio || 1, config.dpr);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    render(0, true);
  }

  function addRipple(x, y) {
    if (reducedMotion || lowPower && ripples.length >= 1) return;
    ripples.push({ x, y, age: 0, strength: lowPower ? 0.35 : 0.56 });
    while (ripples.length > (lowPower ? 1 : 3)) ripples.shift();
    wake();
  }

  function render(dt, staticFrame = false) {
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'screen';
    context.lineCap = 'round';
    context.lineJoin = 'round';

    const time = reducedMotion ? 0 : elapsed;
    const count = config.lines;
    const pointCount = config.samples;
    const spacing = height / Math.max(1, count - 1);
    const spring = 1 - Math.exp(-Math.max(0, dt) * 8.5);
    pointer.x += (pointer.targetX - pointer.x) * spring;
    pointer.y += (pointer.targetY - pointer.y) * spring;
    pointer.vx *= 0.91;
    pointer.vy *= 0.91;

    if (!staticFrame) {
      for (const ripple of ripples) ripple.age += dt;
      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        if (ripples[index].age > 2.4) ripples.splice(index, 1);
      }
    }

    for (let line = 0; line < count; line += 1) {
      const lane = line / Math.max(1, count - 1);
      const baseY = lane * height;
      const phase = line * 0.31;
      const amplitude = config.amplitude * (0.58 + Math.sin(line * 1.7) * 0.18);
      const gradient = context.createLinearGradient(0, baseY - 70, width, baseY + 70);
      const colorIndex = line % palette.length;
      gradient.addColorStop(0, `${palette[colorIndex]}00`);
      gradient.addColorStop(0.19, palette[colorIndex]);
      gradient.addColorStop(0.62, palette[(colorIndex + 1) % palette.length]);
      gradient.addColorStop(1, `${palette[(colorIndex + 2) % palette.length]}00`);

      context.beginPath();
      for (let sample = 0; sample <= pointCount; sample += 1) {
        const progress = sample / pointCount;
        const x = progress * (width + 80) - 40;
        const slowWave = Math.sin(progress * Math.PI * 2.1 + phase + time * 0.44) * amplitude;
        const fineWave = Math.sin(progress * Math.PI * 4.6 - phase * 0.74 - time * 0.25) * amplitude * 0.31;
        const drift = Math.sin(progress * Math.PI * 1.05 + phase * 1.8 + time * 0.15) * amplitude * 0.42;
        let y = baseY + slowWave + fineWave + drift;

        if (!reducedMotion && pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const radius = lowPower ? 145 : 205;
          const influence = Math.exp(-((dx * dx) / (radius * radius * 1.4) + (dy * dy) / (radius * radius * 0.62)));
          const direction = Math.sign(dy || 1);
          y += direction * influence * (lowPower ? 12 : 21) + pointer.vy * influence * 0.012;
        }

        if (!reducedMotion && ripples.length) {
          for (const ripple of ripples) {
            const dx = x - ripple.x;
            const dy = y - ripple.y;
            const distance = Math.hypot(dx, dy);
            const front = ripple.age * 430;
            const band = (distance - front) / 54;
            if (Math.abs(band) < 2.8) {
              const envelope = Math.exp(-band * band * 1.5) * Math.max(0, 1 - ripple.age / 2.4);
              y += Math.sin(band * Math.PI) * envelope * ripple.strength * 24 * Math.sign(dy || 1);
            }
          }
        }

        if (sample === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = gradient;
      context.globalAlpha = 0.085 + (line % 4) * 0.017;
      context.lineWidth = line % 5 === 0 ? 1.15 : 0.72;
      context.stroke();
    }

    // A small number of soft motes add depth without a particle system or DOM nodes.
    if (!lowPower && !reducedMotion) {
      context.globalAlpha = 0.22;
      for (let i = 0; i < 14; i += 1) {
        const x = ((i * 167.7 + time * (8 + i % 3)) % (width + 40)) - 20;
        const y = (i * 97.31 + Math.sin(time * 0.32 + i) * 18) % height;
        context.fillStyle = palette[i % palette.length];
        context.beginPath();
        context.arc(x, y, i % 4 === 0 ? 1.7 : 1, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
  }

  function frame(now) {
    raf = 0;
    if (disposed || document.hidden || !visible) return;
    const frameInterval = 1000 / config.fps;
    if (lastFrame && now - lastFrame < frameInterval - 1) {
      raf = requestAnimationFrame(frame);
      return;
    }
    const dt = lastFrame ? Math.min(0.06, (now - lastFrame) / 1000) : 1 / config.fps;
    lastFrame = now;
    elapsed += dt;
    render(dt);
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (disposed || reducedMotion || document.hidden || !visible || raf) return;
    raf = requestAnimationFrame(frame);
  }

  function handlePointer(event) {
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.active = true;
    pointer.vx = event.movementX || 0;
    pointer.vy = event.movementY || 0;
    wake();
  }
  function pointerLeave() {
    pointer.active = false;
    pointer.targetX = -1000;
    pointer.targetY = -1000;
  }
  function pointerDown(event) { addRipple(event.clientX, event.clientY); }
  function visibilityChanged() {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
    } else wake();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(document.documentElement);
  const intersection = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (!visible) {
      cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
    } else wake();
  }, { threshold: 0.01 });
  intersection.observe(canvas);
  window.addEventListener('pointermove', handlePointer, { passive: true });
  window.addEventListener('pointerdown', pointerDown, { passive: true });
  window.addEventListener('blur', pointerLeave);
  document.documentElement.addEventListener('pointerleave', pointerLeave);
  document.addEventListener('visibilitychange', visibilityChanged);
  resize();

  if (reducedMotion) render(0, true);
  else wake();

  const onMotionChange = (event) => {
    reducedMotion = Boolean(event.matches);
    if (reducedMotion) {
      cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
      pointer.active = false;
      pointer.targetX = -1000;
      pointer.targetY = -1000;
      render(0, true);
    } else {
      lastFrame = 0;
      wake();
    }
  };
  reducedQuery?.addEventListener?.('change', onMotionChange);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersection.disconnect();
    window.removeEventListener('pointermove', handlePointer);
    window.removeEventListener('pointerdown', pointerDown);
    window.removeEventListener('blur', pointerLeave);
    document.documentElement.removeEventListener('pointerleave', pointerLeave);
    document.removeEventListener('visibilitychange', visibilityChanged);
    reducedQuery?.removeEventListener?.('change', onMotionChange);
  };
}

'use strict';

(function () {
  const site = window.OMAR_SITE || {};
  const i18n = window.OMAR_I18N;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  const state = {
    activeFilter: 'all',
    ayahIndex: 0,
    ayahOrder: [],
    ayahPointer: 0,
    ayahTimer: 0,
    titleIndex: 0,
    charIndex: 0,
    deleting: false,
    titleTimer: 0,
    titlePaused: false,
    cancelNextCardClick: false,
    drag: null,
    profileTimer: 0,
    currentStatus: null,
    ayahDelay: 0,
    lowPower: false
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function icon(className) {
    return `<i class="${escapeHtml(className)}" aria-hidden="true"></i>`;
  }

  function renderHeroActions() {
    const wrap = $('#heroActions');
    if (!wrap) return;
    wrap.innerHTML = (site.heroActions || []).map((item) => {
      const label = escapeHtml(i18n?.t(item.labelKey, item.label) || item.label);
      if (item.url) {
        return `<a class="hero-action interactive magnetic hero-action-${escapeHtml(item.id)}" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${label}" data-action-id="${escapeHtml(item.id)}" data-burst>${icon(item.icon)}<span data-i18n="${escapeHtml(item.labelKey)}">${label}</span></a>`;
      }
      return `<button class="hero-action interactive magnetic hero-action-${escapeHtml(item.id)}" type="button" data-action="${escapeHtml(item.action)}" data-action-id="${escapeHtml(item.id)}" aria-label="${label}" data-burst>${icon(item.icon)}<span data-i18n="${escapeHtml(item.labelKey)}">${label}</span></button>`;
    }).join('');
  }

  function renderFilters() {
    // Removed category filters to keep the original source-style full grid.
  }

  function renderSocialLinks() {
    const grid = $('#linksGrid');
    if (!grid) return;
    grid.innerHTML = (site.socialLinks || []).map((item, index) => {
      const title = escapeHtml(i18n?.t(item.titleKey, item.title) || item.title);
      const handle = escapeHtml(item.handleKey ? i18n?.t(item.handleKey, item.handle) : item.handle);
      const badgeClass = item.badgeType === 'neo' ? 'badge-vip-neo' : 'badge-vip';
      const badgeKey = item.badge === 'PUBLIC' ? 'privacyPublic' : 'privacyPrivate';
      const badgeLabel = escapeHtml(i18n?.t(badgeKey, item.badge) || item.badge);
      const content = `
        <span class="${badgeClass}" data-i18n="${badgeKey}">${badgeLabel}</span>
        <span class="social-icon">${icon(item.icon)}${item.extraBadge ? `<span class="brilliant-badge">${escapeHtml(item.extraBadge)}</span>` : ''}</span>
        <div class="social-text"><strong data-i18n="${escapeHtml(item.titleKey)}">${title}</strong><span${item.handleKey ? ` data-i18n="${escapeHtml(item.handleKey)}"` : ''}>${handle}</span></div>
      `;
      const baseClass = `social-card ${escapeHtml(item.className)} reveal`;
      const delay = `style="--delay:${Math.min(index * 55, 520)}ms"`;

      if (item.action) {
        return `<button class="${baseClass}" ${delay} type="button" data-id="${escapeHtml(item.id)}" data-group="${escapeHtml(item.group)}" data-action="${escapeHtml(item.action)}" data-copy-text="${escapeHtml(item.copy || item.url || '')}" aria-label="${title}" data-burst>${content}</button>`;
      }
      return `<a class="${baseClass}" ${delay} href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" data-id="${escapeHtml(item.id)}" data-group="${escapeHtml(item.group)}" data-copy-text="${escapeHtml(item.url)}" aria-label="${title}" data-burst>${content}</a>`;
    }).join('');
  }

  function renderCopyRows() {
    const wrap = $('#copyList');
    if (!wrap) return;
    wrap.innerHTML = (site.quickCopy || []).map((item, index) => {
      const label = escapeHtml(i18n?.t(item.labelKey, item.label) || item.label);
      const copyLabel = escapeHtml(i18n?.t('copyBtn', 'نسخ') || 'نسخ');
      return `
        <div class="copy-row reveal" style="--delay:${index * 70}ms">
          <div class="copy-meta"><span data-i18n="${escapeHtml(item.labelKey)}">${label}</span><strong>${escapeHtml(item.value)}</strong></div>
          <button class="copy-btn interactive" type="button" data-copy="${escapeHtml(item.value)}" data-burst data-i18n="copyBtn">${copyLabel}</button>
        </div>
      `;
    }).join('');
  }

  function renderProjects() {
    const wrap = $('#projectsList');
    if (!wrap) return;
    wrap.innerHTML = (site.projects || []).map((project, index) => {
      const title = escapeHtml(i18n?.t(project.titleKey, project.title) || project.title);
      const desc = escapeHtml(i18n?.t(project.descKey, project.desc) || project.desc);
      return `
        <a class="work-card reveal" style="--delay:${index * 80}ms" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer" data-burst>
          <picture>
            <source srcset="${escapeHtml(project.image)}" type="image/webp" />
            <img src="assets/img/tameen-logo.jpeg" alt="${title}" class="work-logo" loading="lazy" decoding="async" />
          </picture>
          <div class="work-text">
            <span class="project-status">${escapeHtml(project.status || 'LIVE')}</span>
            <strong data-i18n="${escapeHtml(project.titleKey)}">${title}</strong>
            <span data-i18n="${escapeHtml(project.descKey)}">${desc}</span>
          </div>
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
        </a>
      `;
    }).join('');
  }

  function renderAll() {
    renderHeroActions();
    renderFilters();
    renderSocialLinks();
    renderCopyRows();
    renderProjects();
    i18n?.applyLanguage(i18n.getSavedLanguage());
    updateSmartStatus();
  }

  function applyFilter() {
    // No visual filtering in this build. All social cards stay visible.
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message || i18n?.t('copied', 'تم النسخ ✓') || 'تم النسخ ✓';
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1700);
  }

  async function copyText(text, btn) {
    const value = String(text || '');
    if (!value) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const temp = document.createElement('textarea');
        temp.value = value;
        temp.setAttribute('readonly', '');
        temp.style.cssText = 'position:fixed;top:-9999px;opacity:0;';
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        document.execCommand('copy');
        temp.remove();
      }
      if (btn) {
        btn.classList.add('is-copied');
        const original = btn.textContent;
        btn.textContent = i18n?.t('copied', 'تم النسخ ✓') || 'تم النسخ ✓';
        setTimeout(() => {
          btn.classList.remove('is-copied');
          if (btn.matches('[data-i18n="copyBtn"]')) btn.textContent = i18n?.t('copyBtn', 'نسخ') || 'نسخ';
          else btn.textContent = original;
        }, 1200);
      }
      showToast(i18n?.t('copied', 'تم النسخ ✓'));
    } catch (_) {
      showToast('تعذر النسخ');
    }
  }

  function openShare() {
    const overlay = $('#shareOverlay');
    const input = $('#shareUrlInput');
    const qr = $('#shareQrImg');
    if (!overlay) return;
    const url = site.baseUrl || location.href;
    if (input) input.value = url;
    if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(url)}`;
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeShare() {
    const overlay = $('#shareOverlay');
    if (!overlay) return;
    overlay.classList.add('is-closing');
    setTimeout(() => {
      overlay.classList.remove('show', 'is-closing');
      overlay.setAttribute('aria-hidden', 'true');
      unlockBodyIfClean();
    }, 360);
  }

  async function nativeSharePage() {
    const url = site.baseUrl || location.href;
    const shareData = {
      title: i18n?.t('shareNativeTitle', 'Omar Profiles') || 'Omar Profiles',
      text: i18n?.t('shareNativeText', 'Omar Profiles links and projects in one place.') || 'Omar Profiles links and projects in one place.',
      url
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast(i18n?.t('shared', 'تم فتح المشاركة ✓'));
      } else {
        await copyText(`${shareData.text}\n${url}`);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        await copyText(`${shareData.text}\n${url}`);
      }
    }
  }

  function openDiscord() {
    const overlay = $('#pageOverlay');
    const frame = $('#pageFrame');
    if (!overlay || !frame) return;
    frame.src = site.discordPage || 'pages/discord.html';
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeDiscord() {
    const overlay = $('#pageOverlay');
    const frame = $('#pageFrame');
    if (!overlay || !frame) return;
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    frame.src = '';
    unlockBodyIfClean();
  }

  function unlockBodyIfClean() {
    if (!$('#shareOverlay')?.classList.contains('show') && !$('#pageOverlay')?.classList.contains('show')) {
      document.body.classList.remove('modal-open');
    }
  }

  function makeRipple(target, event) {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  function flowerBurst(x, y, amount = 9) {
    if (state.lowPower) amount = Math.min(amount, 4);
    const colors = ['#5bf6ff', '#14e7c0', '#ff3d8e', '#f8ff00', '#8b5cf6', '#ffffff'];
    for (let i = 0; i < amount; i += 1) {
      const petal = document.createElement('span');
      petal.className = 'flower-petal';
      const angle = (Math.PI * 2 * i) / amount + Math.random() * .35;
      const distance = 42 + Math.random() * 58;
      petal.style.left = `${x}px`;
      petal.style.top = `${y}px`;
      petal.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      petal.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      petal.style.setProperty('--spin', `${180 + Math.random() * 280}deg`);
      petal.style.setProperty('--rot', `${Math.random() * 360}deg`);
      petal.style.setProperty('--petal-color', colors[i % colors.length]);
      document.body.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove(), { once: true });
    }
  }

  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -20px' });
    const mobileReveal = matchMedia('(max-width: 560px)').matches;
    const delayStep = mobileReveal ? 62 : 45;
    const maxDelay = mobileReveal ? 620 : 420;
    items.forEach((el, index) => {
      if (!el.style.getPropertyValue('--delay')) el.style.setProperty('--delay', `${Math.min(index * delayStep, maxDelay)}ms`);
      observer.observe(el);
    });
  }

  function initTilt() {
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover) return;
    document.addEventListener('pointermove', (event) => {
      const ev = event.target.closest?.('.evc-root');
      if (ev) {
        const evRect = ev.getBoundingClientRect();
        ev.style.setProperty('--mx', `${event.clientX - evRect.left}px`);
        ev.style.setProperty('--my', `${event.clientY - evRect.top}px`);
      }
      const card = event.target.closest?.('.social-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty('--ry', `${x * -8}deg`);
      card.style.setProperty('--rx', `${y * 7}deg`);
    });
    document.addEventListener('pointerleave', (event) => {
      const card = event.target.closest?.('.social-card');
      if (!card) return;
      card.style.removeProperty('--ry');
      card.style.removeProperty('--rx');
    }, true);
  }


  function getLocalDateKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function chooseEveningStatus() {
    const choices = ['online', 'coding', 'gaming'];
    const key = `omar_evening_status_${getLocalDateKey()}`;
    try {
      const saved = localStorage.getItem(key);
      if (choices.includes(saved)) return saved;
      const picked = choices[Math.floor(Math.random() * choices.length)];
      localStorage.setItem(key, picked);
      return picked;
    } catch (_) {
      return choices[Math.floor(Math.random() * choices.length)];
    }
  }

  function getSmartStatusKey() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 8) return 'sleeping';
    if (hour >= 8 && hour < 18) return 'busy';
    return chooseEveningStatus();
  }

  function updateSmartStatus() {
    const key = getSmartStatusKey();
    const config = site.smartStatuses?.[key] || site.smartStatuses?.busy || { labelKey: 'statusBusy', bg: 'stars', color: '#00eaff' };
    const statusEl = $('#statusText') || $('.status');
    if (statusEl) {
      statusEl.textContent = i18n?.t(config.labelKey, key.toUpperCase()) || key.toUpperCase();
      statusEl.dataset.status = key;
      statusEl.setAttribute('aria-label', statusEl.textContent);
    }
    state.currentStatus = key;
    document.body.dataset.status = key;
    document.body.style.setProperty('--status-color', config.color || '#00eaff');
    document.body.style.setProperty('--status-glow', config.glow || 'rgba(0,234,255,.45)');
    ['bg-mode-sleep','bg-mode-stars','bg-mode-aurora','bg-mode-coding','bg-mode-gaming'].forEach((name) => document.body.classList.remove(name));
    document.body.classList.add(`bg-mode-${config.bg || 'aurora'}`);
  }

  function initSmartStatus() {
    updateSmartStatus();
    setInterval(updateSmartStatus, 60 * 1000);
    document.addEventListener('omar:languagechange', updateSmartStatus);
  }

  function detectLowPowerMode() {
    const mobile = matchMedia('(max-width: 620px)').matches || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const memory = Number(navigator.deviceMemory || 8);
    const cores = Number(navigator.hardwareConcurrency || 8);
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slowNet = connection && (connection.saveData || ['slow-2g', '2g'].includes(connection.effectiveType));
    const low = Boolean(mobile && (memory <= 3 || cores <= 4 || slowNet));
    state.lowPower = low;
    document.body.classList.toggle('low-power-mode', low);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('user-reduced-motion');
    }
  }

  function initMagneticButtons() {
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!canHover || state.lowPower) return;
    document.addEventListener('pointermove', (event) => {
      const target = event.target.closest?.('.magnetic, .hero-action, .native-share-btn, .share-copy-btn');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      target.style.setProperty('--mag-x', `${x * 9}px`);
      target.style.setProperty('--mag-y', `${y * 7}px`);
    });
    document.addEventListener('pointerleave', (event) => {
      const target = event.target.closest?.('.magnetic, .hero-action, .native-share-btn, .share-copy-btn');
      if (!target) return;
      target.style.removeProperty('--mag-x');
      target.style.removeProperty('--mag-y');
    }, true);
  }

  function initProfilePopover() {
    const avatar = $('#avatarBtn');
    const popover = $('#profilePopover');
    if (!avatar || !popover) return;
    avatar.addEventListener('click', () => {
      popover.classList.add('show');
      clearTimeout(state.profileTimer);
      state.profileTimer = setTimeout(() => popover.classList.remove('show'), 5000);
    });
    document.addEventListener('click', (event) => {
      if (!popover.classList.contains('show')) return;
      if (event.target.closest('#avatarBtn') || event.target.closest('#profilePopover')) return;
      popover.classList.remove('show');
    });
  }

  function initScrollProgress() {
    const bar = $('#scrollProgress');
    if (!bar) return;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const value = Math.min(100, Math.max(0, (scrollY / max) * 100));
      bar.style.width = `${value}%`;
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  }

  function shuffleArray(values) {
    const arr = values.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function rebuildAyahOrder(avoidIndex = -1) {
    const list = site.ayahs || [];
    const indexes = list.map((_, index) => index);
    state.ayahOrder = shuffleArray(indexes);
    if (state.ayahOrder.length > 1 && state.ayahOrder[0] === avoidIndex) {
      state.ayahOrder.push(state.ayahOrder.shift());
    }
    state.ayahPointer = 0;
  }

  function nextAyahIndex() {
    const list = site.ayahs || [];
    if (!list.length) return 0;
    if (!state.ayahOrder.length || state.ayahPointer >= state.ayahOrder.length) {
      rebuildAyahOrder(state.ayahIndex);
    }
    const next = state.ayahOrder[state.ayahPointer];
    state.ayahPointer += 1;
    return next;
  }

  function nextAyahDelay() {
    const isDetail = $('#ayahFloat')?.classList.contains('is-detail');
    const min = isDetail ? 45000 : 18000;
    const range = isDetail ? 20000 : 11000;
    return min + Math.floor(Math.random() * range);
  }

  function restartAyahRing(delay) {
    const card = $('#ayahFloat');
    const ring = $('#ayahRing');
    if (!card || !ring) return;
    state.ayahDelay = delay;
    card.style.setProperty('--ayah-duration', `${delay}ms`);
    ring.classList.remove('is-running');
    void ring.offsetWidth;
    ring.classList.add('is-running');
  }

  function getCurrentAyahCopyText() {
    const list = site.ayahs || [];
    const item = list[state.ayahIndex % list.length];
    if (!item) return '';
    const ref = i18n?.lang === 'en' ? item.refEn : item.refAr;
    return `${item.text}\n${item.en || ''}\n${ref}\n${site.baseUrl || location.href}`;
  }

  function updateAyah(index) {
    const list = site.ayahs || [];
    if (!list.length) return;
    const item = list[index % list.length];
    const lang = i18n?.lang || 'ar';
    const isEn = lang === 'en';
    const els = {
      text: $('#ayahText'),
      translation: $('#ayahTranslation'),
      ref: $('#ayahRef'),
      note: $('#ayahNote'),
      detail: $('#ayahDetail'),
      hint: $('#ayahHint')
    };
    Object.values(els).filter(Boolean).forEach((el) => el.classList.remove('ayah-swap'));
    requestAnimationFrame(() => {
      if (els.text) els.text.textContent = item.text;
      if (els.translation) els.translation.textContent = item.en || '';
      if (els.ref) els.ref.textContent = isEn ? `[${item.refEn}]` : `[${item.refAr}]`;
      if (els.note) els.note.textContent = isEn ? (item.noteEn || '') : (item.noteAr || '');
      if (els.detail) els.detail.textContent = isEn ? (item.tafsirEn || '') : (item.tafsirAr || '');
      if (els.hint) els.hint.textContent = i18n?.t('ayahHint', isEn ? 'Tap to view tafsir' : 'اضغط لعرض تفاصيل الآية');
      Object.values(els).filter(Boolean).forEach((el) => el.classList.add('ayah-swap'));
    });
  }

  function scheduleNextAyah() {
    clearTimeout(state.ayahTimer);
    const delay = nextAyahDelay();
    restartAyahRing(delay);
    state.ayahTimer = setTimeout(() => {
      const card = $('#ayahFloat');
      if (card && !card.classList.contains('is-hidden-hard')) {
        state.ayahIndex = nextAyahIndex();
        updateAyah(state.ayahIndex);
      }
      scheduleNextAyah();
    }, delay);
  }

  function initAyah() {
    const card = $('#ayahFloat');
    const eye = $('#ayahEye');
    const dock = $('#ayahDock');
    if (!card) return;
    rebuildAyahOrder();
    state.ayahIndex = nextAyahIndex();
    updateAyah(state.ayahIndex);
    scheduleNextAyah();

    document.addEventListener('omar:languagechange', () => updateAyah(state.ayahIndex));

    card.addEventListener('click', (event) => {
      if (event.target.closest('button')) return;
      if (state.drag?.moved) return;
      card.classList.toggle('is-detail');
      scheduleNextAyah();
    });

    function hideCard() {
      card.classList.add('is-water-out');
      setTimeout(() => {
        card.classList.add('is-hidden-hard');
        dock?.classList.add('show');
      }, 430);
    }
    function showCard() {
      card.classList.remove('is-hidden-hard');
      dock?.classList.remove('show');
      requestAnimationFrame(() => {
        card.classList.remove('is-water-out');
        card.classList.add('is-water-in');
        setTimeout(() => card.classList.remove('is-water-in'), 620);
      });
    }

    eye?.addEventListener('click', (event) => { event.stopPropagation(); hideCard(); });
    dock?.addEventListener('click', showCard);
    $('#copyAyahBtn')?.addEventListener('click', (event) => {
      event.stopPropagation();
      copyText(getCurrentAyahCopyText(), event.currentTarget);
      showToast(i18n?.t('ayahCopied', 'تم نسخ الآية ✓'));
    });

    card.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button')) return;
      state.drag = {
        x: event.clientX,
        y: event.clientY,
        left: card.offsetLeft,
        top: card.offsetTop,
        moved: false
      };
      card.setPointerCapture?.(event.pointerId);
    });
    card.addEventListener('pointermove', (event) => {
      if (!state.drag) return;
      const dx = event.clientX - state.drag.x;
      const dy = event.clientY - state.drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) state.drag.moved = true;
      const nextLeft = Math.min(innerWidth - card.offsetWidth - 8, Math.max(8, state.drag.left + dx));
      const nextTop = Math.min(innerHeight - card.offsetHeight - 8, Math.max(8, state.drag.top + dy));
      card.style.left = `${nextLeft}px`;
      card.style.right = 'auto';
      card.style.top = `${nextTop}px`;
    });
    card.addEventListener('pointerup', () => { state.drag = null; });
    card.addEventListener('pointercancel', () => { state.drag = null; });
  }

  function initTitleEffect() {
    const titleEl = document.querySelector('title');
    const words = site.titles || ['Omar Profiles'];
    function tick() {
      if (state.titlePaused || !titleEl) return;
      const word = words[state.titleIndex % words.length];
      state.charIndex += state.deleting ? -1 : 1;
      titleEl.textContent = word.slice(0, state.charIndex) || 'Omar Profiles';
      let speed = state.deleting ? 38 : 58;
      if (!state.deleting && state.charIndex >= word.length) { speed = 1200; state.deleting = true; }
      if (state.deleting && state.charIndex <= 0) { state.deleting = false; state.titleIndex += 1; speed = 250; }
      state.titleTimer = setTimeout(tick, speed);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        state.titlePaused = true;
        clearTimeout(state.titleTimer);
        if (titleEl) titleEl.textContent = 'لا تهرب خليكككك';
      } else {
        state.titlePaused = false;
        if (titleEl) titleEl.textContent = 'رجعت هيك 😎';
        clearTimeout(state.titleTimer);
        state.titleTimer = setTimeout(tick, 900);
      }
    });
    tick();
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const socialClick = event.target.closest?.('.social-card');
      if (state.cancelNextCardClick && socialClick) {
        event.preventDefault();
        event.stopPropagation();
        state.cancelNextCardClick = false;
        return;
      }

      const burstTarget = event.target.closest?.('[data-burst], .interactive, .social-card, .work-card, .copy-row, .evc-inner');
      if (burstTarget) {
        makeRipple(burstTarget, event);
        if (burstTarget.matches('.social-card, .hero-action, .avatar, .share-fab, .work-card, .copy-btn')) {
          flowerBurst(event.clientX, event.clientY, burstTarget.matches('.avatar') ? 14 : 8);
        }
      }

      const action = event.target.closest?.('[data-action]')?.dataset.action;
      if (action === 'share') { event.preventDefault(); openShare(); return; }
      if (action === 'discord') { event.preventDefault(); openDiscord(); return; }


      const copyBtn = event.target.closest?.('[data-copy]');
      if (copyBtn) { copyText(copyBtn.dataset.copy, copyBtn); }
    });

    // Long press on cards copies the link instead of opening it. Normal click still opens.
    let longPressTimer = 0;
    let longPressTarget = null;
    document.addEventListener('pointerdown', (event) => {
      const card = event.target.closest?.('.social-card[data-copy-text]');
      if (!card) return;
      longPressTarget = card;
      longPressTimer = setTimeout(() => {
        card.classList.add('is-pressed');
        state.cancelNextCardClick = true;
        copyText(card.dataset.copyText);
        flowerBurst(event.clientX, event.clientY, 10);
        longPressTimer = 0;
      }, 650);
    });
    ['pointerup', 'pointercancel', 'pointerleave', 'scroll'].forEach((name) => {
      document.addEventListener(name, () => {
        if (longPressTimer) clearTimeout(longPressTimer);
        longPressTimer = 0;
        longPressTarget?.classList.remove('is-pressed');
        longPressTarget = null;
      }, { passive: true });
    });

    $('#langToggleBtn')?.addEventListener('click', (event) => {
      const btn = event.currentTarget;
      btn.classList.add('is-switching');
      setTimeout(() => btn.classList.remove('is-switching'), 520);
      i18n?.toggleLanguage();
    });
    $('#sharePortalBtn')?.addEventListener('click', openShare);
    $('#closeShare')?.addEventListener('click', closeShare);
    $('#copyShareBtn')?.addEventListener('click', () => copyText($('#shareUrlInput')?.value, $('#copyShareBtn')));
    $('#nativeShareBtn')?.addEventListener('click', nativeSharePage);
    $('#shareOverlay')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) closeShare(); });
    $('#closePageBtn')?.addEventListener('click', closeDiscord);
    $('#pageOverlay')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) closeDiscord(); });
    window.addEventListener('message', (event) => { if (event.data?.type === 'close-discord') closeDiscord(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { closeShare(); closeDiscord(); }
      if (event.altKey && event.key.toLowerCase() === 'l') { event.preventDefault(); i18n?.toggleLanguage(); }
    });

    $('#avatarBtn')?.addEventListener('click', (event) => {
      const btn = event.currentTarget;
      btn.classList.add('is-popping');
      setTimeout(() => btn.classList.remove('is-popping'), 520);
    });
  }

  function init() {
    detectLowPowerMode();
    renderAll();
    bindEvents();
    initSmartStatus();
    initProfilePopover();
    initReveal();
    initTilt();
    initMagneticButtons();
    initScrollProgress();
    initAyah();
    initTitleEffect();
    requestAnimationFrame(() => document.body.classList.add('site-ready'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
